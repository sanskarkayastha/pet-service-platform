package com.example.demo.controller;

import com.example.demo.dto.WorkingHoursRequest;
import com.example.demo.dto.WorkingHoursResponseDTO;
import com.example.demo.model.Business;
import com.example.demo.model.User;
import com.example.demo.security.CurrentUser;
import com.example.demo.services.BusinessServices;
import com.example.demo.services.WorkingHoursService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/working-hours")
@CrossOrigin(origins = "http://localhost:3000")
public class WorkingHoursController {

    @Autowired
    private WorkingHoursService workingHoursService;

    @Autowired
    private BusinessServices businessServices;

    // Get working hours for current business
    @GetMapping("/my-hours")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<List<WorkingHoursResponseDTO>> getMyWorkingHours(@CurrentUser User currentUser) {
        Business business = businessServices.getBusinessByUserId(currentUser.getId());
        List<WorkingHoursResponseDTO> hours = workingHoursService.getWorkingHours(business.getId());
        return ResponseEntity.ok(hours);
    }

    // Update working hours
    @PutMapping("/update")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<List<WorkingHoursResponseDTO>> updateWorkingHours(
            @RequestBody WorkingHoursRequest request,
            @CurrentUser User currentUser) {
        Business business = businessServices.getBusinessByUserId(currentUser.getId());
        List<WorkingHoursResponseDTO> updated = workingHoursService.updateWorkingHours(business.getId(), request);
        return ResponseEntity.ok(updated);
    }

    // Get working hours for a business (public - for booking)
    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<WorkingHoursResponseDTO>> getBusinessWorkingHours(@PathVariable Long businessId) {
        List<WorkingHoursResponseDTO> hours = workingHoursService.getWorkingHours(businessId);
        return ResponseEntity.ok(hours);
    }
}
