package com.example.demo.controller;

import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponseDTO;
import com.example.demo.model.BookingStatus;
import com.example.demo.model.Business;
import com.example.demo.model.User;
import com.example.demo.security.CurrentUser;
import com.example.demo.services.BookingService;
import com.example.demo.services.BusinessServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BusinessServices businessServices;

    // Create booking (user)
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody BookingRequest request,
            @CurrentUser User currentUser) {
        BookingResponseDTO booking = bookingService.createBooking(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    // Get bookings for current business (business owner)
    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(@CurrentUser User currentUser) {
        Business business = businessServices.getBusinessByUserId(currentUser.getId());
        List<BookingResponseDTO> bookings = bookingService.getBookingsByBusiness(business);
        return ResponseEntity.ok(bookings);
    }

    // Get bookings by status (business owner)
    @GetMapping("/my-bookings/status/{status}")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByStatus(
            @PathVariable String status,
            @CurrentUser User currentUser) {
        Business business = businessServices.getBusinessByUserId(currentUser.getId());
        BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        List<BookingResponseDTO> bookings = bookingService.getBookingsByBusinessAndStatus(business, bookingStatus);
        return ResponseEntity.ok(bookings);
    }

    // Update booking status (business owner)
    @PutMapping("/{bookingId}/status")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody BookingStatusUpdateRequest request) {
        BookingResponseDTO updated = bookingService.updateBookingStatus(bookingId, request.status());
        return ResponseEntity.ok(updated);
    }

    // Get booking by ID
    @GetMapping("/{bookingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingResponseDTO> getBooking(@PathVariable Long bookingId) {
        BookingResponseDTO booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }

    // Get user's bookings
    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookingResponseDTO>> getMyOrders(@CurrentUser User currentUser) {
        // This would need a method in BookingService to get by user
        // For now, returning empty list - can be implemented later
        return ResponseEntity.ok(List.of());
    }

    public record BookingStatusUpdateRequest(BookingStatus status) {}
}
