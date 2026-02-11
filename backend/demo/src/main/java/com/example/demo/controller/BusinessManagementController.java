package com.example.demo.controller;

import com.example.demo.dto.BusinessUpdateRequest;
import com.example.demo.model.Business;
import com.example.demo.model.User;
import com.example.demo.security.CurrentUser;
import com.example.demo.services.BusinessServices;
import com.example.demo.util.JwtUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business/management")
@CrossOrigin(origins = "http://localhost:3000")
public class BusinessManagementController {

    @Autowired
    private BusinessServices businessServices;

    // Get current user's business
    @GetMapping("/my-business")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<?> getMyBusiness( Authentication authentication) {
        String userId = JwtUtils.extractUserId(authentication);
        if(userId == null){
            return ResponseEntity.badRequest().body("User not found");
        }
        Business business = businessServices.getBusinessByUserId(userId);
        return ResponseEntity.ok(business);
    }

    // Update business information
    @PutMapping("/update")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<?> updateBusiness(
            @RequestBody BusinessUpdateRequest request,
            Authentication authentication) {
        String userId = JwtUtils.extractUserId(authentication);
        if(userId==null){
            return ResponseEntity.badRequest().body("User not found");
        }
        Business business = businessServices.getBusinessByUserId(userId);
        Business updated = businessServices.updateBusiness(business.getId(), request);
        return ResponseEntity.ok(updated);
    }
}
