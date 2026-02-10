package com.example.demo.controller;

import com.example.demo.dto.ServiceCreateRequest;
import com.example.demo.dto.ServiceResponseDTO;
import com.example.demo.model.Business;
import com.example.demo.model.User;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.services.BusinessServices;
import com.example.demo.services.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services/management")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceManagementController {

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private BusinessServices businessServices;

    // Get all services for current business
    @GetMapping("/my-services")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<List<ServiceResponseDTO>> getMyServices(@CurrentUser User currentUser) {
        Business business = businessServices.getBusinessByUserId(currentUser.getId());
        List<ServiceResponseDTO> services = serviceService.getServicesByBusiness(business.getId());
        return ResponseEntity.ok(services);
    }

    // Create service
    @PostMapping("/create")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<ServiceResponseDTO> createService(
            @RequestBody ServiceCreateRequest request,
            @CurrentUser User currentUser) {
        Business business = businessServices.getBusinessByUserId(currentUser.getId());
        request.setBusinessId(business.getId());
        
        Long serviceId = serviceService.createService(request);
        ServiceResponseDTO service = serviceService.getServiceById(serviceId);
        return ResponseEntity.status(HttpStatus.CREATED).body(service);
    }

    // Update service
    @PutMapping("/{serviceId}")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<ServiceResponseDTO> updateService(
            @PathVariable Long serviceId,
            @RequestBody ServiceCreateRequest request,
            @CurrentUser User currentUser) {
        Business business = businessServices.getBusinessByUserId(currentUser.getId());
        request.setBusinessId(business.getId());
        
        ServiceResponseDTO updated = serviceService.updateService(serviceId, request);
        return ResponseEntity.ok(updated);
    }

    // Delete service
    @DeleteMapping("/{serviceId}")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long serviceId,
            @CurrentUser User currentUser) {
        serviceService.deleteService(serviceId);
        return ResponseEntity.noContent().build();
    }

    // Get service by ID
    @GetMapping("/{serviceId}")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<ServiceResponseDTO> getService(@PathVariable Long serviceId) {
        ServiceResponseDTO service = serviceService.getServiceById(serviceId);
        return ResponseEntity.ok(service);
    }
}
