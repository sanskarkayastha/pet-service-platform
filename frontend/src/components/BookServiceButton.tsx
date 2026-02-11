"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { extractAuthUser } from "@/lib/auth-helpers";

interface BookServiceButtonProps {
  href: string;
  label?: string;
}

export function BookServiceButton({
  href,
  label = "Book a Service",
}: BookServiceButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await authClient.getSession();
      const authUser = extractAuthUser(session);
      if (!authUser?.id) {
        const searchParams = new URLSearchParams({
          next: href,
        });
        router.push(`/users/login?${searchParams.toString()}`);
        return;
      }
      router.push(href);
    } catch (err) {
      console.error("Unable to verify session before booking", err);
      setError("Unable to verify your session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          background: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
          color: "#ffffff",
          borderRadius: "8px",
          border: "none",
          fontWeight: 500,
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          boxShadow: isLoading
            ? "none"
            : "0 12px 24px rgba(156, 39, 176, 0.25)",
        }}
      >
        {isLoading ? "Checking access..." : label}
      </button>
      {error && (
        <span style={{ color: "#b91c1c", fontSize: "13px" }}>{error}</span>
      )}
    </div>
  );
}
