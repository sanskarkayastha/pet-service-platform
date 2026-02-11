"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { startConversation } from "@/lib/messaging-api";
import { extractAuthUser } from "@/lib/auth-helpers";

interface MessageBusinessButtonProps {
  businessId: number;
  businessName?: string;
}

export function MessageBusinessButton({
  businessId,
  businessName,
}: MessageBusinessButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const session = await authClient.getSession();
      const authUser = extractAuthUser(session);
      if (!authUser?.id) {
        router.push("/users/login");
        return;
      }

      const conversation = await startConversation(businessId);
      router.push(
        `/users/profile/messages?conversation=${conversation.id}`,
      );
    } catch (err) {
      console.error("Failed to start conversation", err);
      setError("Unable to start a conversation right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          background: "linear-gradient(135deg, #6366f1, #4c1d95)",
          color: "#ffffff",
          borderRadius: "8px",
          border: "none",
          fontWeight: 500,
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxShadow: isLoading
            ? "none"
            : "0 10px 20px rgba(99, 102, 241, 0.25)",
        }}
      >
        {isLoading ? "Opening chat..." : `Message ${businessName ?? "Business"}`}
      </button>
      {error && (
        <span style={{ color: "#b91c1c", fontSize: "13px" }}>{error}</span>
      )}
    </div>
  );
}
