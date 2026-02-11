"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { extractAuthUser } from "@/lib/auth-helpers";
import {
  fetchBusinessConversations,
  fetchConversationMessages,
  fetchCustomerConversations,
  markConversationRead,
} from "@/lib/messaging-api";
import { createMessagingClient } from "@/lib/messaging-socket";
import type {
  ChatMessage,
  ChatMessageEvent,
  ConversationSummary,
  ViewerRole,
} from "@/components/messages/types";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessageThread } from "@/components/messages/MessageThread";
import { ChatComposer } from "@/components/messages/ChatComposer";
import styles from "@/components/messages/messaging.module.css";
import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";

interface MessagingWorkspaceProps {
  viewer: ViewerRole;
  initialConversationId?: number | null;
}

type MessagesByConversation = Record<number, ChatMessage[]>;

export default function MessagingWorkspace({
  viewer,
  initialConversationId = null,
}: MessagingWorkspaceProps) {
  const [sessionStatus, setSessionStatus] = useState<"loading" | "ready">(
    "loading",
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(initialConversationId);
  const [messagesByConversation, setMessagesByConversation] =
    useState<MessagesByConversation>({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const clientRef = useRef<Client | null>(null);
  const conversationSubscriptionRef = useRef<StompSubscription | null>(null);
  const listSubscriptionRef = useRef<StompSubscription | null>(null);
  const readInFlightRef = useRef<Set<number>>(new Set());
  const initialAppliedRef = useRef<boolean>(false);

  // Load session + token
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const [sessionResult, tokenResult] = await Promise.all([
          authClient.getSession(),
          authClient.token().catch(() => null),
        ]);

        if (cancelled) return;

        const sessionUser = extractAuthUser(sessionResult);
        setUserId(sessionUser?.id ?? null);

        const resolvedToken =
          tokenResult && typeof tokenResult === "object" && "token" in tokenResult
            ? tokenResult.token
            : typeof tokenResult === "string"
              ? tokenResult
              : null;

        setToken(resolvedToken);
      } catch (err) {
        console.error("Failed to load session", err);
        if (!cancelled) {
          setError("Unable to load your session. Please refresh the page.");
        }
      } finally {
        if (!cancelled) {
          setSessionStatus("ready");
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load conversation list once session is ready
  useEffect(() => {
    if (sessionStatus !== "ready" || !userId) {
      setIsLoadingConversations(false);
      return;
    }

    let cancelled = false;

    async function loadConversations() {
      setIsLoadingConversations(true);
      try {
        const fetcher =
          viewer === "customer"
            ? fetchCustomerConversations
            : fetchBusinessConversations;
        const result = await fetcher();
        if (!cancelled) {
          setConversations(sortConversations(result));
        }
      } catch (err) {
        console.error("Failed to load conversations", err);
        if (!cancelled) {
          setError("Unable to load conversations right now.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingConversations(false);
        }
      }
    }

    loadConversations();

    return () => {
      cancelled = true;
    };
  }, [sessionStatus, userId, viewer]);

  // Apply initial conversation selection once
  useEffect(() => {
    if (initialAppliedRef.current) {
      return;
    }
    if (conversations.length === 0) {
      return;
    }

    if (initialConversationId) {
      const exists = conversations.some(
        (conversation) => conversation.id === initialConversationId,
      );
      if (exists) {
        setSelectedConversationId(initialConversationId);
        initialAppliedRef.current = true;
        return;
      }
    }

    if (selectedConversationId === null && conversations[0]) {
      setSelectedConversationId(conversations[0].id);
      initialAppliedRef.current = true;
    }
  }, [conversations, initialConversationId, selectedConversationId]);

  // Set up websocket client
  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    const client = createMessagingClient(token);
    clientRef.current = client;

    client.onConnect = () => {
      setSocketConnected(true);
      subscribeToConversationList(client, userId);
      // Re-subscribe to active conversation after connect
      if (selectedConversationId) {
        subscribeToConversation(client, selectedConversationId);
      }
    };

    client.onDisconnect = () => {
      setSocketConnected(false);
      cleanupSubscriptions();
    };

    client.activate();

    return () => {
      cleanupSubscriptions();
      if (client.active) {
        client.deactivate();
      }
      clientRef.current = null;
      setSocketConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userId]);

  // Update conversation subscription when selection changes
  useEffect(() => {
    if (!clientRef.current || !clientRef.current.connected) {
      return;
    }
    if (!selectedConversationId) {
      if (conversationSubscriptionRef.current) {
        conversationSubscriptionRef.current.unsubscribe();
        conversationSubscriptionRef.current = null;
      }
      return;
    }
    subscribeToConversation(clientRef.current, selectedConversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId, socketConnected]);

  // Load messages + mark as read when conversation changes
  useEffect(() => {
    if (!selectedConversationId || !userId) {
      return;
    }

    let cancelled = false;

    async function loadMessages() {
      setIsLoadingMessages(true);
      try {
        const data = await fetchConversationMessages(selectedConversationId);
        if (!cancelled) {
          setMessagesByConversation((prev) => ({
            ...prev,
            [selectedConversationId]: data,
          }));
          void markAsRead(selectedConversationId);
        }
      } catch (err) {
        console.error("Failed to load conversation messages", err);
        if (!cancelled) {
          setError("Unable to load some messages.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMessages(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId, userId]);

  const currentConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    return conversations.find(
      (conversation) => conversation.id === selectedConversationId,
    );
  }, [conversations, selectedConversationId]);

  const currentMessages =
    (selectedConversationId &&
      messagesByConversation[selectedConversationId]) ||
    [];

  const peerName = useMemo(() => {
    if (!currentConversation) return "Select a conversation";
    return viewer === "customer"
      ? currentConversation.businessName || "Business"
      : currentConversation.customerName || "Customer";
  }, [currentConversation, viewer]);

  const handleConversationSelect = useCallback((conversationId: number) => {
    setSelectedConversationId(conversationId);
    setSendError(null);
  }, []);

  const handleConversationUpdate = useCallback(
    (incoming: ConversationSummary) => {
      setConversations((prev) => upsertConversation(prev, incoming));
    },
    [],
  );

  const markAsRead = useCallback(
    async (conversationId: number) => {
      if (readInFlightRef.current.has(conversationId)) {
        return;
      }
      readInFlightRef.current.add(conversationId);
      try {
        const updated = await markConversationRead(conversationId);
        handleConversationUpdate(updated);
      } catch (err) {
        console.error("Failed to mark conversation as read", err);
      } finally {
        readInFlightRef.current.delete(conversationId);
      }
    },
    [handleConversationUpdate],
  );

  const handleIncomingEvent = useCallback(
    (event: ChatMessageEvent) => {
      handleConversationUpdate(event.conversation);
      setMessagesByConversation((prev) => {
        const existing = prev[event.message.conversationId] ?? [];
        const updated = mergeMessage(existing, event.message);
        return { ...prev, [event.message.conversationId]: updated };
      });

      if (
        selectedConversationId === event.message.conversationId &&
        (viewer === "customer"
          ? event.message.sentByBusiness
          : !event.message.sentByBusiness)
      ) {
        void markAsRead(event.message.conversationId);
      }
    },
    [handleConversationUpdate, markAsRead, selectedConversationId, viewer],
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      setSendError(null);

      if (!selectedConversationId) {
        setSendError("Select a conversation before sending messages.");
        return;
      }

      const client = clientRef.current;
      if (!client || !client.connected) {
        setSendError(
          "Connection is not ready yet. Please wait a moment and try again.",
        );
        return;
      }

      try {
        client.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({
            conversationId: selectedConversationId,
            content,
          }),
        });
      } catch (err) {
        console.error("Failed to send message", err);
        setSendError("Unable to send message right now.");
      }
    },
    [selectedConversationId],
  );

  function subscribeToConversationList(client: Client, activeUserId: string) {
    if (listSubscriptionRef.current) {
      listSubscriptionRef.current.unsubscribe();
    }
    listSubscriptionRef.current = client.subscribe(
      `/topic/users/${activeUserId}/conversations`,
      (message: IMessage) => {
        try {
          const payload = JSON.parse(message.body) as ConversationSummary;
          handleConversationUpdate(payload);
        } catch (err) {
          console.error("Failed to parse conversation update", err);
        }
      },
    );
  }

  function subscribeToConversation(client: Client, conversationId: number) {
    if (conversationSubscriptionRef.current) {
      conversationSubscriptionRef.current.unsubscribe();
    }

    conversationSubscriptionRef.current = client.subscribe(
      `/topic/conversations/${conversationId}`,
      (message: IMessage) => {
        try {
          const payload = JSON.parse(message.body) as ChatMessageEvent;
          handleIncomingEvent(payload);
        } catch (err) {
          console.error("Failed to parse message event", err);
        }
      },
    );
  }

  function cleanupSubscriptions() {
    if (conversationSubscriptionRef.current) {
      conversationSubscriptionRef.current.unsubscribe();
      conversationSubscriptionRef.current = null;
    }
    if (listSubscriptionRef.current) {
      listSubscriptionRef.current.unsubscribe();
      listSubscriptionRef.current = null;
    }
  }

  if (sessionStatus === "loading") {
    return (
      <div style={{ padding: "32px" }}>
        <div className={styles.workspace}>
          <div className={styles.chatPane}>
            <div className={styles.chatPlaceholder}>Loading messages...</div>
          </div>
          <div className={styles.conversationsPane}>
            <div className={styles.conversationsHeader}>
              <div className={styles.conversationsTitle}>Conversations</div>
            </div>
            <div className={styles.conversationList}>
              <div className={styles.skeleton} />
              <div className={styles.skeleton} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div style={{ padding: "32px" }}>
        <div className={styles.workspace}>
          <div className={styles.chatPane}>
            <div className={styles.chatPlaceholder}>
              Please sign in to view and send messages.
            </div>
          </div>
          <div className={styles.conversationsPane}>
            <div className={styles.conversationsHeader}>
              <div className={styles.conversationsTitle}>Conversations</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px" }}>
      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: "rgba(239, 68, 68, 0.12)",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      <div className={styles.workspace}>
        {currentConversation ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MessageThread
              viewer={viewer}
              peerName={peerName}
              peerSubtitle={
                viewer === "customer"
                  ? currentConversation.businessLogo
                    ? "Trusted partner"
                    : undefined
                  : `Customer • ${currentConversation.customerId.slice(0, 6)}`
              }
              messages={currentMessages}
              isLoading={isLoadingMessages}
              isConnected={socketConnected}
            />
            <div style={{ padding: "0 24px 24px" }}>
              <ChatComposer
                disabled={!socketConnected}
                onSend={handleSendMessage}
              />
              {sendError && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color: "#b91c1c",
                  }}
                >
                  {sendError}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.chatPane}>
            <div className={styles.chatPlaceholder}>
              Select a conversation to start chatting.
            </div>
          </div>
        )}
        <ConversationList
          viewer={viewer}
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelect={handleConversationSelect}
          isLoading={isLoadingConversations}
        />
      </div>
    </div>
  );
}

function sortConversations(
  conversations: ConversationSummary[],
): ConversationSummary[] {
  return [...conversations].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bTime - aTime;
  });
}

function upsertConversation(
  list: ConversationSummary[],
  incoming: ConversationSummary,
): ConversationSummary[] {
  const existingIndex = list.findIndex(
    (conversation) => conversation.id === incoming.id,
  );
  if (existingIndex === -1) {
    return sortConversations([...list, incoming]);
  }
  const updated = [...list];
  updated[existingIndex] = incoming;
  return sortConversations(updated);
}

function mergeMessage(
  existing: ChatMessage[],
  incoming: ChatMessage,
): ChatMessage[] {
  const index = existing.findIndex((message) => message.id === incoming.id);
  if (index !== -1) {
    const updated = [...existing];
    updated[index] = incoming;
    return updated;
  }
  return [...existing, incoming].sort(
    (a, b) =>
      new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
  );
}
