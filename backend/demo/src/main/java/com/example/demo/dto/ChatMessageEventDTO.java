package com.example.demo.dto;

public record ChatMessageEventDTO(
        ChatMessageDTO message,
        ConversationSummaryDTO conversation
) {
}
