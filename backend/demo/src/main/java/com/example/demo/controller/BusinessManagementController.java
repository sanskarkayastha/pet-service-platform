package com.example.demo.controller;

import com.example.demo.dto.BusinessUpdateRequest;
import com.example.demo.model.Business;
import com.example.demo.model.User;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.security.CurrentUser;
import com.example.demo.services.BusinessServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business/management")
@CrossOrigin(origins = "http://localhost:3000")
public class BusinessManagementController {

    @Autowired
    private BusinessServices businessServices;

    @Autowired
    private BusinessRepository businessRepository;

    // Get current user's business
    @GetMapping("/my-business")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<Business> getMyBusiness(@CurrentUser User currentUser) {
        Business business = businessServices.getBusinessByUserId(currentUser.getId());
        return ResponseEntity.ok(business);
    }

    // Update business information
    @PutMapping("/update")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<Business> updateBusiness(
            @RequestBody BusinessUpdateRequest request,
            @CurrentUser User currentUser) {
        Business business = businessServices.getBusinessByUserId(currentUser.getId());
        Business updated = businessServices.updateBusiness(business.getId(), request);
        return ResponseEntity.ok(updated);
    }
}
