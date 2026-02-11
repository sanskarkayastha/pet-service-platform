package com.example.demo.websocket;

import com.example.demo.dto.ChatMessageEventDTO;
import com.example.demo.dto.ChatMessageSendRequest;
import com.example.demo.dto.ConversationSummaryDTO;
import com.example.demo.services.MessagingService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class MessagingWebSocketController {

    private final MessagingService messagingService;
    private final SimpMessagingTemplate messagingTemplate;

    public MessagingWebSocketController(MessagingService messagingService, SimpMessagingTemplate messagingTemplate) {
        this.messagingService = messagingService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void handleChatMessage(@Payload ChatMessageSendRequest request, Principal principal) {
        if (principal == null || request == null) {
            return;
        }

        ChatMessageEventDTO event = messagingService.recordMessage(
                request.conversationId(),
                principal.getName(),
                request.content()
        );

        ConversationSummaryDTO conversation = event.conversation();

        messagingTemplate.convertAndSend("/topic/conversations/" + conversation.id(), event);
        messagingTemplate.convertAndSend("/topic/users/" + conversation.customerId() + "/conversations", conversation);

        if (conversation.businessOwnerId() != null) {
            messagingTemplate.convertAndSend("/topic/users/" + conversation.businessOwnerId() + "/conversations", conversation);
        }

        messagingTemplate.convertAndSend("/topic/businesses/" + conversation.businessId() + "/conversations", conversation);
    }
}
