"use client";

import { useState } from "react";
import styles from "@/components/messages/messaging.module.css";

interface ChatComposerProps {
  onSend: (message: string) => Promise<void> | void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled = false }: ChatComposerProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSend =
    !disabled && !isSubmitting && message.trim().length > 0 && message.trim().length <= 2000;

  const handleSubmit = async () => {
    if (!canSend) return;
    try {
      setIsSubmitting(true);
      await onSend(message.trim());
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.composer}>
      <input
        className={styles.composerInput}
        placeholder="Type your message..."
        value={message}
        disabled={disabled || isSubmitting}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
          }
        }}
        maxLength={2000}
      />
      <button
        className={styles.composerButton}
        onClick={handleSubmit}
        disabled={!canSend}
        type="button"
      >
        Send
      </button>
    </div>
  );
}
