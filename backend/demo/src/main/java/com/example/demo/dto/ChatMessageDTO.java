package com.example.demo.dto;

import java.time.Instant;

public record ChatMessageDTO(
        Long id,
        Long conversationId,
        boolean sentByBusiness,
        String content,
        Instant sentAt
) {
}
