"use client";

import { useEffect, useRef } from "react";
import styles from "@/components/messages/messaging.module.css";
import type { ChatMessage, ViewerRole } from "@/components/messages/types";

interface MessageThreadProps {
  viewer: ViewerRole;
  peerName: string;
  peerSubtitle?: string;
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
}

export function MessageThread({
  viewer,
  peerName,
  peerSubtitle,
  messages,
  isLoading,
  isConnected,
}: MessageThreadProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
  }, [messages.length]);

  const headerSubtitle =
    peerSubtitle ||
    (viewer === "customer"
      ? "Business contact"
      : "Customer conversation");

  return (
    <div className={styles.chatPane}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderInfo}>
          <div className={styles.chatHeaderTitle}>{peerName}</div>
          <div className={styles.chatHeaderSubtitle}>{headerSubtitle}</div>
        </div>
        <div className={styles.statusBar}>
          <span
            className={`${styles.statusDot} ${
              isConnected ? styles.statusOnline : ""
            }`}
          />
          {isConnected ? "Live" : "Reconnecting"}
        </div>
      </div>

      <div ref={scrollerRef} className={styles.messageScroller}>
        {isLoading && messages.length === 0 && (
          <>
            <MessageSkeleton align="left" />
            <MessageSkeleton align="right" />
          </>
        )}

        {!isLoading && messages.length === 0 && (
          <div className={styles.chatPlaceholder}>
            <div>
              <strong>Say hello!</strong>
              <p style={{ marginTop: "8px", color: "#6b7280" }}>
                This conversation is empty. Start by sending a friendly
                message.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isViewerMessage =
            viewer === "business"
              ? message.sentByBusiness
              : !message.sentByBusiness;

          return (
            <div
              key={message.id}
              className={`${styles.messageBubble} ${
                isViewerMessage ? styles.fromViewer : styles.fromOther
              }`}
            >
              <div>{message.content}</div>
              <div className={styles.messageMeta}>
                {formatTimestamp(message.sentAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function MessageSkeleton({ align }: { align: "left" | "right" }) {
  return (
    <div
      style={{
        alignSelf: align === "right" ? "flex-end" : "flex-start",
        width: "55%",
        height: "76px",
        borderRadius: "18px",
        background:
          "linear-gradient(90deg, rgba(229,231,235,0.6) 25%, rgba(229,231,235,0.95) 50%, rgba(229,231,235,0.6) 75%)",
        backgroundSize: "200% 100%",
        animation: "pulse 1.2s ease-in-out infinite",
      }}
    />
  );
}
