package com.example.demo.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(
    name = "conversations",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_conversation_customer_business", columnNames = {"customer_id", "business_id"})
    }
)
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    private Instant lastMessageAt;

    @Column(length = 255)
    private String lastMessagePreview;

    @Column(nullable = false)
    private int unreadByCustomer = 0;

    @Column(nullable = false)
    private int unreadByBusiness = 0;

    public Conversation() {
    }

    public Conversation(User customer, Business business) {
        this.customer = customer;
        this.business = business;
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public void applyNewMessage(boolean sentByBusiness, String preview, Instant sentAt) {
        this.lastMessageAt = sentAt;
        this.lastMessagePreview = preview;
        if (sentByBusiness) {
            this.unreadByCustomer += 1;
            this.unreadByBusiness = 0;
        } else {
            this.unreadByBusiness += 1;
            this.unreadByCustomer = 0;
        }
        this.updatedAt = sentAt;
    }

    public void markReadFor(ConversationParticipant participant) {
        if (participant == ConversationParticipant.BUSINESS) {
            this.unreadByBusiness = 0;
        } else if (participant == ConversationParticipant.CUSTOMER) {
            this.unreadByCustomer = 0;
        }
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Instant getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(Instant lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public String getLastMessagePreview() {
        return lastMessagePreview;
    }

    public void setLastMessagePreview(String lastMessagePreview) {
        this.lastMessagePreview = lastMessagePreview;
    }

    public int getUnreadByCustomer() {
        return unreadByCustomer;
    }

    public void setUnreadByCustomer(int unreadByCustomer) {
        this.unreadByCustomer = unreadByCustomer;
    }

    public int getUnreadByBusiness() {
        return unreadByBusiness;
    }

    public void setUnreadByBusiness(int unreadByBusiness) {
        this.unreadByBusiness = unreadByBusiness;
    }
}
