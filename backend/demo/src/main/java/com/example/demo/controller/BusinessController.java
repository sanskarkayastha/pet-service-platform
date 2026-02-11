package com.example.demo.controller;

import static com.example.demo.mapper.BusinessMapper.toResponseDTO;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.BusinessDTO;
import com.example.demo.dto.BusinessResponseDTO;
import com.example.demo.model.Business;
import com.example.demo.model.BusinessStatus;
import com.example.demo.security.CurrentUser;
import com.example.demo.model.User;
import com.example.demo.services.BusinessServices;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/business")
public class BusinessController {

    @Autowired
    private BusinessServices businessServices;

    @GetMapping("/allBusinesses")
    public ResponseEntity<List<BusinessResponseDTO>> getBusiness() {
        List<BusinessResponseDTO> response = businessServices.getAllBusinesses();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/addBusiness")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addBusiness(
            @RequestPart("businessInfo") BusinessDTO businessDTO,
            @RequestPart("logo-upload") MultipartFile logo, 
            @RequestPart("license-upload") MultipartFile license,
            @RequestPart("verification-upload") MultipartFile verificationDoc) {
        try {
            Business business = businessServices.addBusiness(businessDTO, logo, license, verificationDoc);
            if (business != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                        "message", "Business added Successfully",
                        "status", "success"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                        "message", "User not registered",
                        "status", "failed"));
            }

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload business documents");
        }

    }

    @GetMapping("/getPendingBusiness")
    @PreAuthorize("hasRole('ADMIN')")
    List<BusinessResponseDTO> pendingBusiness() {
        List<Business> allPendingBusiness = businessServices.getAllPendingBusiness();
        return allPendingBusiness.stream().map((Business business) -> {
            return toResponseDTO(business);
        }).toList();
    }

    @GetMapping("/getBusinessStatus/{id}")
    public ResponseEntity<?> getBusinessStatus(@PathVariable String id) {

        BusinessStatus status = businessServices.getBusinessStatus(id);

        return ResponseEntity.ok(Map.of(
                "status", status.name()));
    }

    @PutMapping("/{businessId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveBusiness(@PathVariable Long businessId, @CurrentUser User currentUser) {
        businessServices.approveBusiness(businessId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{businessId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rejectBusiness(@PathVariable Long businessId, @RequestBody Map<String, String> body) {
        String rejectMsg = body != null && body.containsKey("message") ? body.get("message") : "";
        businessServices.rejectBusiness(businessId, rejectMsg);
        return ResponseEntity.ok().build();
    }

    // Get business by user ID (for detail pages)
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<BusinessResponseDTO> getBusinessByUserId(@PathVariable String userId) {
        Business business = businessServices.getBusinessByUserId(userId);
        return ResponseEntity.ok(toResponseDTO(business));
    }

    // Get business by business ID (for detail pages - preferred)
    @GetMapping("/{businessId}")
    public ResponseEntity<BusinessResponseDTO> getBusinessById(@PathVariable Long businessId) {
        Business business = businessServices.getBusinessById(businessId);
        return ResponseEntity.ok(toResponseDTO(business));
    }
}
