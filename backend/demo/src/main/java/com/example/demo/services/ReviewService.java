package com.example.demo.services;

import com.example.demo.dto.ReviewDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<ReviewDTO> getReviewsForBusiness(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        return reviewRepository.findByBusinessOrderByCreatedAtDesc(business)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public ReviewDTO addReview(Long businessId, String userId, int rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean hasCompletedBooking = bookingRepository.existsByBusinessAndUserAndStatus(
                business, user, BookingStatus.COMPLETED);

        if (!hasCompletedBooking) {
            throw new IllegalStateException("You can only review services you have completed.");
        }

        Review review = new Review();
        review.setBusiness(business);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);

        Review saved = reviewRepository.save(review);
        return toDTO(saved);
    }

    private ReviewDTO toDTO(Review review) {
        String userName = review.getUser() != null ? review.getUser().getName() : "Customer";
        return new ReviewDTO(
                review.getId(),
                userName != null && !userName.isBlank() ? userName : "Customer",
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}

