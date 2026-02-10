package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Business;
import com.example.demo.model.BusinessStatus;
import com.example.demo.model.User;

import java.util.List;
import java.util.Optional;


@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {

    List<Business> findByStatus(BusinessStatus status);

    Optional<Business> findByUser(User user);

    // Eagerly fetch user to avoid LazyInitializationException
    @Query("SELECT b FROM Business b JOIN FETCH b.user")
    List<Business> findAllWithUser();

}
