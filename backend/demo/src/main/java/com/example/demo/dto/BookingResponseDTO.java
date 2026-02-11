package com.example.demo.dto;

import com.example.demo.model.BookingStatus;
import java.time.LocalDateTime;
import java.util.List;

public record BookingResponseDTO(
    Long id,
    Long businessId,
    String businessName,
    Long serviceId,
    String serviceTitle,
    String userId,
    String customerName,
    LocalDateTime bookingDateTime,
    LocalDateTime endDateTime,
    BookingStatus status,
    String customerEmail,
    String customerPhone,
    String petName,
    String petBreed,
    String notes,
    Double totalPrice,
    List<AddonResponse> addons,
    LocalDateTime createdAt,
    String statusMessage
) {
    public record AddonResponse(
        Long id,
        String name,
        String description,
        Double price
    ) {}
}
