package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ServiceCreateRequest;
import com.example.demo.services.ServiceService;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @PostMapping("/create")
    public ResponseEntity<?> createService(
            @RequestBody ServiceCreateRequest request) {

        Long serviceId = serviceService.createService(request);
        return ResponseEntity.ok(serviceId);
    }
}
