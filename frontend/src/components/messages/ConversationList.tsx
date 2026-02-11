"use client";

import styles from "@/components/messages/messaging.module.css";
import type {
  ConversationSummary,
  ViewerRole,
} from "@/components/messages/types";

interface ConversationListProps {
  viewer: ViewerRole;
  conversations: ConversationSummary[];
  selectedConversationId: number | null;
  onSelect: (conversationId: number) => void;
  isLoading: boolean;
}

export function ConversationList({
  viewer,
  conversations,
  selectedConversationId,
  onSelect,
  isLoading,
}: ConversationListProps) {
  const unreadKey =
    viewer === "customer" ? "unreadByCustomer" : "unreadByBusiness";

  return (
    <div className={styles.conversationsPane}>
      <div className={styles.conversationsHeader}>
        <div className={styles.conversationsTitle}>
          {viewer === "customer" ? "Businesses" : "Customer Chats"}
        </div>
      </div>

      <div className={styles.conversationList}>
        {isLoading &&
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className={styles.skeleton} />
          ))}

        {!isLoading && conversations.length === 0 && (
          <div className={styles.emptyState}>
            {viewer === "customer"
              ? "Message a business to start the conversation."
              : "Customer messages will appear here once they reach out."}
          </div>
        )}

        {conversations.map((conversation) => {
          const isActive = conversation.id === selectedConversationId;
          const unreadCount = conversation[unreadKey] ?? 0;
          const displayName =
            viewer === "customer"
              ? conversation.businessName || "Business"
              : conversation.customerName || "Customer";

          const preview =
            conversation.lastMessagePreview || "No messages yet.";
          const timestamp = conversation.lastMessageAt
            ? formatRelativeTime(conversation.lastMessageAt)
            : null;

          return (
            <div
              key={conversation.id}
              className={`${styles.conversationItem} ${
                isActive ? styles.conversationActive : ""
              }`}
              onClick={() => onSelect(conversation.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(conversation.id);
                }
              }}
            >
              <div className={styles.conversationName}>{displayName}</div>
              <div className={styles.conversationPreview}>{preview}</div>
              <div className={styles.conversationMeta}>
                <span>{timestamp || "New"}</span>
                {unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{unreadCount}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Number.isNaN(diffMinutes)) {
    return "";
  }

  if (diffMinutes < 1) {
    return "Just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
