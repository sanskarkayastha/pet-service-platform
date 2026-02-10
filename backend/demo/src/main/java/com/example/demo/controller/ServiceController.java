package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ServiceCreateRequest;
import com.example.demo.dto.ServiceResponseDTO;
import com.example.demo.model.Business;
import com.example.demo.model.User;
import com.example.demo.security.CurrentUser;
import com.example.demo.services.BusinessServices;
import com.example.demo.services.ServiceService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private BusinessServices businessServices;

    @PostMapping("/create")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('ADMIN')")
    public ResponseEntity<?> createService(
            @RequestBody ServiceCreateRequest request,
            @CurrentUser User currentUser) {

        Long serviceId = serviceService.createService(request);
        return ResponseEntity.ok(serviceId);
    }

    // Get services for a business (public - for booking)
    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<ServiceResponseDTO>> getBusinessServices(@PathVariable Long businessId) {
        List<ServiceResponseDTO> services = serviceService.getServicesByBusiness(businessId);
        return ResponseEntity.ok(services);
    }

    // Get service by ID (public)
    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDTO> getService(@PathVariable Long serviceId) {
        ServiceResponseDTO service = serviceService.getServiceById(serviceId);
        return ResponseEntity.ok(service);
    }
}
