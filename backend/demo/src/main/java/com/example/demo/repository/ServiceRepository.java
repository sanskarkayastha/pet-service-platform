package com.example.demo.repository;

import com.example.demo.model.Business;
import com.example.demo.model.BusinessService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<BusinessService, Long> {
    
    List<BusinessService> findByBusiness(Business business);
    
    @Query("SELECT s FROM BusinessService s JOIN FETCH s.business WHERE s.business = :business")
    List<BusinessService> findByBusinessWithDetails(Business business);
}
