package com.example.demo.controller;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.dto.ConversationSummaryDTO;
import com.example.demo.dto.StartConversationRequest;
import com.example.demo.services.MessagingService;
import com.example.demo.util.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessagingController {

    private final MessagingService messagingService;

    public MessagingController(MessagingService messagingService) {
        this.messagingService = messagingService;
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ConversationSummaryDTO>> getCustomerConversations(Authentication authentication) {
        String userId = JwtUtils.extractUserId(authentication);
        return ResponseEntity.ok(messagingService.getCustomerConversations(userId));
    }

    @GetMapping("/business")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<List<ConversationSummaryDTO>> getBusinessConversations(Authentication authentication) {
        String userId = JwtUtils.extractUserId(authentication);
        return ResponseEntity.ok(messagingService.getBusinessConversations(userId));
    }

    @PostMapping("/conversations")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ConversationSummaryDTO> startConversation(
            @RequestBody StartConversationRequest request,
            Authentication authentication
    ) {
        String userId = JwtUtils.extractUserId(authentication);
        return ResponseEntity.ok(messagingService.ensureConversation(userId, request.businessId()));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(
            @PathVariable Long conversationId,
            Authentication authentication
    ) {
        String userId = JwtUtils.extractUserId(authentication);
        return ResponseEntity.ok(messagingService.getMessages(conversationId, userId));
    }

    @PostMapping("/conversations/{conversationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConversationSummaryDTO> markRead(
            @PathVariable Long conversationId,
            Authentication authentication
    ) {
        String userId = JwtUtils.extractUserId(authentication);
        return ResponseEntity.ok(messagingService.markConversationRead(conversationId, userId));
    }
}
