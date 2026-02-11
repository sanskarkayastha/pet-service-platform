package com.example.demo.repository;

import com.example.demo.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    List<Conversation> findByCustomer_IdOrderByUpdatedAtDesc(String customerId);

    List<Conversation> findByBusiness_IdOrderByUpdatedAtDesc(Long businessId);

    Optional<Conversation> findByCustomer_IdAndBusiness_Id(String customerId, Long businessId);
}
