package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Business;
import com.example.demo.model.BusinessStatus;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.User;

@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {

    List<Business> findByStatus(BusinessStatus status);

    Optional<Business> findByUser(User user);
}
