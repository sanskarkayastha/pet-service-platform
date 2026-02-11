export type ViewerRole = "customer" | "business";

export interface ConversationSummary {
  id: number;
  businessId: number;
  businessOwnerId: string | null;
  businessName: string | null;
  businessLogo: string | null;
  customerId: string;
  customerName: string | null;
  unreadByCustomer: number;
  unreadByBusiness: number;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  sentByBusiness: boolean;
  content: string;
  sentAt: string;
}

export interface ChatMessageEvent {
  message: ChatMessage;
  conversation: ConversationSummary;
}
