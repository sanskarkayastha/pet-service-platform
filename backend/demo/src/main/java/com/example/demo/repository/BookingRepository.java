package com.example.demo.repository;

import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import com.example.demo.model.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByBusiness(Business business);
    
    List<Booking> findByBusinessAndStatus(Business business, BookingStatus status);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.business JOIN FETCH b.service JOIN FETCH b.user WHERE b.business = :business")
    List<Booking> findByBusinessWithDetails(Business business);
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.service WHERE b.business = :business AND b.bookingDateTime >= :start AND b.bookingDateTime < :end")
    List<Booking> findByBusinessAndDateRange(Business business, LocalDateTime start, LocalDateTime end);
    
    List<Booking> findByUser_Id(String userId);
    
    Optional<Booking> findById(Long id);
}
