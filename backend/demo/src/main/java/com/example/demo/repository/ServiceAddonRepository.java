package com.example.demo.repository;

import com.example.demo.model.ServiceAddon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceAddonRepository extends JpaRepository<ServiceAddon, Long> {
}
