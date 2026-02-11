package com.example.demo.mapper;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.dto.ChatMessageEventDTO;
import com.example.demo.dto.ConversationSummaryDTO;
import com.example.demo.model.ChatMessage;
import com.example.demo.model.Conversation;

public final class MessagingMapper {

    private MessagingMapper() {
    }

    public static ConversationSummaryDTO toConversationSummaryDTO(Conversation conversation) {
        return new ConversationSummaryDTO(
                conversation.getId(),
                conversation.getBusiness().getId(),
                conversation.getBusiness().getUser() != null ? conversation.getBusiness().getUser().getId() : null,
                conversation.getBusiness().getBusinessName(),
                conversation.getBusiness().getBusinessLogo(),
                conversation.getCustomer().getId(),
                conversation.getCustomer().getName(),
                conversation.getUnreadByCustomer(),
                conversation.getUnreadByBusiness(),
                conversation.getLastMessageAt(),
                conversation.getLastMessagePreview()
        );
    }

    public static ChatMessageDTO toChatMessageDTO(ChatMessage chatMessage) {
        return new ChatMessageDTO(
                chatMessage.getId(),
                chatMessage.getConversation().getId(),
                chatMessage.isSentByBusiness(),
                chatMessage.getContent(),
                chatMessage.getSentAt()
        );
    }

    public static ChatMessageEventDTO toChatMessageEventDTO(ChatMessage chatMessage) {
        Conversation conversation = chatMessage.getConversation();
        return new ChatMessageEventDTO(
                toChatMessageDTO(chatMessage),
                toConversationSummaryDTO(conversation)
        );
    }
}
