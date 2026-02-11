package com.example.demo.controller;

import com.example.demo.dto.BlockSlotRequest;
import com.example.demo.dto.TimeSlotDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.model.BlockedSlot;
import com.example.demo.model.Business;
import com.example.demo.model.BusinessService;
import com.example.demo.model.TimeSlot;
import com.example.demo.repository.TimeSlotRepository;
import com.example.demo.services.BusinessServices;
import com.example.demo.services.TimeSlotService;
import com.example.demo.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/time-slots")
@CrossOrigin(origins = "http://localhost:3000")
public class TimeSlotController {

    @Autowired
    private TimeSlotService timeSlotService;

    @Autowired
    private BusinessServices businessServices;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    /**
     * Public endpoint to view available slots for a service on a given date.
     */
    @GetMapping("/business/{businessId}/service/{serviceId}")
    public ResponseEntity<List<TimeSlotDTO>> getSlots(
            @PathVariable Long businessId,
            @PathVariable Long serviceId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<TimeSlotDTO> slots = timeSlotService.getSlotsForDate(businessId, serviceId, date);
        return ResponseEntity.ok(slots);
    }

    /**
     * Business owner view: same data, but restricted to their own business
     * using current authentication.
     */
    @GetMapping("/my/service/{serviceId}")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<List<TimeSlotDTO>> getMySlotsForService(
            @PathVariable Long serviceId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication
    ) {
        String userId = JwtUtils.extractUserId(authentication);
        Business business = businessServices.getBusinessByUserId(userId);
        List<TimeSlotDTO> slots = timeSlotService.getSlotsForDate(business.getId(), serviceId, date);
        return ResponseEntity.ok(slots);
    }

    /**
     * Business owner: get slots for a given date (all services share these slots).
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<List<TimeSlotDTO>> getMySlotsForDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication
    ) {
        String userId = JwtUtils.extractUserId(authentication);
        Business business = businessServices.getBusinessByUserId(userId);
        List<TimeSlotDTO> slots = timeSlotService.getSlotsForBusinessAndDate(business.getId(), date);
        return ResponseEntity.ok(slots);
    }

    /**
     * Business owner: create a new slot for a given date and time range.
     */
    @PostMapping("/my")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<Long> createMySlot(
            @RequestBody BlockSlotRequest request, // reuse basic fields: date, startTime, endTime, reason
            Authentication authentication
    ) {
        String userId = JwtUtils.extractUserId(authentication);
        Business business = businessServices.getBusinessByUserId(userId);

        TimeSlot slot = new TimeSlot();
        slot.setBusiness(business);
        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        // Use reason field to accept capacity from frontend for now
        int capacity;
        try {
            capacity = Integer.parseInt(request.getReason());
        } catch (NumberFormatException e) {
            capacity = 1;
        }
        slot.setCapacity(capacity);

        Long id = timeSlotRepository.save(slot).getId();
        return ResponseEntity.ok(id);
    }

    /**
     * Business owner: delete a slot.
     */
    @DeleteMapping("/my/{id}")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<Void> deleteMySlot(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String userId = JwtUtils.extractUserId(authentication);
        Business business = businessServices.getBusinessByUserId(userId);

        TimeSlot slot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found"));

        if (!slot.getBusiness().getId().equals(business.getId())) {
            return ResponseEntity.status(403).build();
        }

        timeSlotRepository.delete(slot);
        return ResponseEntity.noContent().build();
    }
}

