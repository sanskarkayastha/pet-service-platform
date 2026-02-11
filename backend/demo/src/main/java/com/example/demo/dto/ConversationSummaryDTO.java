package com.example.demo.dto;

import java.time.Instant;

public record ConversationSummaryDTO(
        Long id,
        Long businessId,
        String businessOwnerId,
        String businessName,
        String businessLogo,
        String customerId,
        String customerName,
        int unreadByCustomer,
        int unreadByBusiness,
        Instant lastMessageAt,
        String lastMessagePreview
) {
}
