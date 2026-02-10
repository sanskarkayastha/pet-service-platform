package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public record BookingRequest(
    Long serviceId,
    LocalDateTime bookingDateTime,
    String customerName,
    String customerEmail,
    String customerPhone,
    String petName,
    String petBreed,
    String notes,
    List<Long> addonIds
) {}
