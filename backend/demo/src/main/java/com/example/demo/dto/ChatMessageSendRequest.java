package com.example.demo.dto;

public record ChatMessageSendRequest(Long conversationId, String content) {
}
