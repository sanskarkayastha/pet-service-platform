package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.BusinessService;

public interface ServiceRepository extends JpaRepository<BusinessService, Long> {

}
