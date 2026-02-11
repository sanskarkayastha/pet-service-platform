package com.example.demo.controller;

import com.example.demo.dto.ReviewDTO;
import com.example.demo.services.ReviewService;
import com.example.demo.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<ReviewDTO>> getReviews(@PathVariable Long businessId) {
        return ResponseEntity.ok(reviewService.getReviewsForBusiness(businessId));
    }

    public record CreateReviewRequest(int rating, String comment) {}

    @PostMapping("/business/{businessId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createReview(
            @PathVariable Long businessId,
            @RequestBody CreateReviewRequest request,
            Authentication authentication
    ) {
        String userId = JwtUtils.extractUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not available");
        }

        try {
            ReviewDTO dto = reviewService.addReview(businessId, userId, request.rating(), request.comment());
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}

