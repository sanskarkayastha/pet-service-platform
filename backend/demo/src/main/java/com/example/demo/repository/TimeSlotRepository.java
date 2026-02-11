package com.example.demo.repository;

import com.example.demo.model.Business;
import com.example.demo.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByBusinessAndDateOrderByStartTimeAsc(Business business, LocalDate date);

    Optional<TimeSlot> findByBusinessAndDateAndStartTime(
            Business business,
            LocalDate date,
            LocalTime startTime
    );
}

