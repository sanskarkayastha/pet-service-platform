import { apiGet, apiPost } from "@/lib/api-fetch";
import type {
  ConversationSummary,
  ChatMessage,
} from "@/components/messages/types";

export async function fetchCustomerConversations(): Promise<ConversationSummary[]> {
  return apiGet<ConversationSummary[]>("/api/messages/customer");
}

export async function fetchBusinessConversations(): Promise<ConversationSummary[]> {
  return apiGet<ConversationSummary[]>("/api/messages/business");
}

export async function fetchConversationMessages(
  conversationId: number,
): Promise<ChatMessage[]> {
  return apiGet<ChatMessage[]>(`/api/messages/conversations/${conversationId}/messages`);
}

export async function startConversation(businessId: number): Promise<ConversationSummary> {
  return apiPost<ConversationSummary>("/api/messages/conversations", {
    businessId,
  });
}

export async function markConversationRead(conversationId: number): Promise<ConversationSummary> {
  return apiPost<ConversationSummary>(`/api/messages/conversations/${conversationId}/read`);
}
