"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import MessagingWorkspace from "@/components/messages/MessagingWorkspace";

export default function MessagesPage() {
  const searchParams = useSearchParams();

  const initialConversationId = useMemo(() => {
    const value = searchParams.get("conversation");
    if (!value) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }, [searchParams]);

  return (
    <MessagingWorkspace
      viewer="customer"
      initialConversationId={initialConversationId}
    />
  );
}
