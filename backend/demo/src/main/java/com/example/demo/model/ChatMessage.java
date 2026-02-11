package com.example.demo.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @Column(nullable = false)
    private boolean sentByBusiness;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false, updatable = false)
    private Instant sentAt;

    public ChatMessage() {
    }

    public ChatMessage(Conversation conversation, boolean sentByBusiness, String content) {
        this.conversation = conversation;
        this.sentByBusiness = sentByBusiness;
        this.content = content;
    }

    @PrePersist
    protected void onCreate() {
        this.sentAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }

    public boolean isSentByBusiness() {
        return sentByBusiness;
    }

    public void setSentByBusiness(boolean sentByBusiness) {
        this.sentByBusiness = sentByBusiness;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }
}
