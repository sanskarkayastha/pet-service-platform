package com.example.demo.repository;

import com.example.demo.model.BlockedSlot;
import com.example.demo.model.Business;
import com.example.demo.model.BusinessService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BlockedSlotRepository extends JpaRepository<BlockedSlot, Long> {

    List<BlockedSlot> findByBusinessAndDate(Business business, LocalDate date);

    List<BlockedSlot> findByBusinessAndServiceAndDate(Business business,
                                                      BusinessService service,
                                                      LocalDate date);

    List<BlockedSlot> findByBusinessAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThan(
            Business business,
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime
    );
}

