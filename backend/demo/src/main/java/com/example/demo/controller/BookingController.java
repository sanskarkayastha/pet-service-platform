package com.example.demo.controller;

import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponseDTO;
import com.example.demo.model.BookingStatus;
import com.example.demo.model.Business;
import com.example.demo.model.User;
import com.example.demo.security.CurrentUser;
import com.example.demo.services.BookingService;
import com.example.demo.services.BusinessServices;
import com.example.demo.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserService userService;

    @Autowired
    private BusinessServices businessServices;

    private String extractUserIdFromJwt(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            Jwt jwt = jwtAuth.getToken();
            
            // Try userId claim
            Object userIdClaim = jwt.getClaim("userId");
            if (userIdClaim == null) {
                userIdClaim = jwt.getClaim("sub"); // standard JWT subject claim
            }
            
            return userIdClaim != null ? userIdClaim.toString() : null;
        }
        return null;
    }

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
    public ResponseEntity<?> getMyBookings(Authentication authentication) {

        String userId = extractUserIdFromJwt(authentication);

        if(userId == null){
            return ResponseEntity.badRequest().body("unable to find user");
        }
        User user = userService.findById(userId);

        Business business = businessServices.getBusinessByUserId(user.getId());
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
        List<BookingResponseDTO> bookings = bookingService.getBookingsByUser(currentUser.getId());
        return ResponseEntity.ok(bookings);
    }

    public record BookingStatusUpdateRequest(BookingStatus status) {}
}
