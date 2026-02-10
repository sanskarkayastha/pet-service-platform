package com.example.demo.repository;

import com.example.demo.model.Business;
import com.example.demo.model.DayOfWeek;
import com.example.demo.model.WorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkingHoursRepository extends JpaRepository<WorkingHours, Long> {
    
    List<WorkingHours> findByBusiness(Business business);
    
    Optional<WorkingHours> findByBusinessAndDayOfWeek(Business business, DayOfWeek dayOfWeek);
    
    void deleteByBusiness(Business business);
}
