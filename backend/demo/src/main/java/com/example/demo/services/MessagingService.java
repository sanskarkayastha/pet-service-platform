package com.example.demo.services;

import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.dto.ChatMessageEventDTO;
import com.example.demo.dto.ConversationSummaryDTO;
import com.example.demo.mapper.MessagingMapper;
import com.example.demo.model.*;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.ChatMessageRepository;
import com.example.demo.repository.ConversationRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class MessagingService {

    private static final int MAX_MESSAGE_LENGTH = 2000;
    private static final int PREVIEW_LENGTH = 180;

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;

    public MessagingService(
            ConversationRepository conversationRepository,
            ChatMessageRepository chatMessageRepository,
            BusinessRepository businessRepository,
            UserRepository userRepository
    ) {
        this.conversationRepository = conversationRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.businessRepository = businessRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ConversationSummaryDTO ensureConversation(String customerId, Long businessId) {
        if (customerId == null || customerId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User context is missing");
        }
        if (businessId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Business id is required");
        }

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found"));

        Optional<Conversation> existing = conversationRepository.findByCustomer_IdAndBusiness_Id(customerId, businessId);
        Conversation conversation = existing.orElseGet(() -> conversationRepository.save(new Conversation(customer, business)));
        return MessagingMapper.toConversationSummaryDTO(conversation);
    }

    @Transactional(readOnly = true)
    public List<ConversationSummaryDTO> getCustomerConversations(String customerId) {
        if (customerId == null || customerId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User context is missing");
        }

        return conversationRepository.findByCustomer_IdOrderByUpdatedAtDesc(customerId)
                .stream()
                .map(MessagingMapper::toConversationSummaryDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConversationSummaryDTO> getBusinessConversations(String ownerUserId) {
        if (ownerUserId == null || ownerUserId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User context is missing");
        }

        Business business = businessRepository.findByUser_Id(ownerUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Business profile not found for user"));

        return conversationRepository.findByBusiness_IdOrderByUpdatedAtDesc(business.getId())
                .stream()
                .map(MessagingMapper::toConversationSummaryDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getMessages(Long conversationId, String requesterId) {
        if (requesterId == null || requesterId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User context is missing");
        }

        Conversation conversation = requireConversation(conversationId);
        resolveParticipant(conversation, requesterId);
        return chatMessageRepository.findByConversation_IdOrderBySentAtAsc(conversationId)
                .stream()
                .map(MessagingMapper::toChatMessageDTO)
                .toList();
    }

    @Transactional
    public ChatMessageEventDTO recordMessage(Long conversationId, String requesterId, String rawContent) {
        if (requesterId == null || requesterId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User context is missing");
        }

        String content = sanitizeContent(rawContent);

        Conversation conversation = requireConversation(conversationId);
        ConversationParticipant participant = resolveParticipant(conversation, requesterId);
        boolean sentByBusiness = participant == ConversationParticipant.BUSINESS;

        ChatMessage chatMessage = new ChatMessage(conversation, sentByBusiness, content);
        chatMessage = chatMessageRepository.save(chatMessage);

        Instant sentAt = chatMessage.getSentAt();
        if (sentAt == null) {
            sentAt = Instant.now();
            chatMessage.setSentAt(sentAt);
        }

        conversation.applyNewMessage(sentByBusiness, createPreview(content), sentAt);
        conversationRepository.save(conversation);

        return MessagingMapper.toChatMessageEventDTO(chatMessage);
    }

    @Transactional
    public ConversationSummaryDTO markConversationRead(Long conversationId, String requesterId) {
        if (requesterId == null || requesterId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User context is missing");
        }

        Conversation conversation = requireConversation(conversationId);
        ConversationParticipant participant = resolveParticipant(conversation, requesterId);

        conversation.markReadFor(participant);
        conversationRepository.save(conversation);
        return MessagingMapper.toConversationSummaryDTO(conversation);
    }

    private Conversation requireConversation(Long conversationId) {
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found"));
    }

    private ConversationParticipant resolveParticipant(Conversation conversation, String requesterId) {
        if (conversation.getCustomer().getId().equals(requesterId)) {
            return ConversationParticipant.CUSTOMER;
        }

        User businessOwner = conversation.getBusiness().getUser();
        if (businessOwner != null && businessOwner.getId().equals(requesterId)) {
            return ConversationParticipant.BUSINESS;
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not part of this conversation");
    }

    private String sanitizeContent(String rawContent) {
        if (rawContent == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message content is required");
        }

        String trimmed = rawContent.trim();
        if (trimmed.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message content cannot be empty");
        }

        if (trimmed.length() > MAX_MESSAGE_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message content exceeds allowed length");
        }
        return trimmed;
    }

    private String createPreview(String content) {
        if (content.length() <= PREVIEW_LENGTH) {
            return content;
        }
        return content.substring(0, PREVIEW_LENGTH) + "...";
    }
}
