package com.example.demo.dto;

import java.time.LocalDateTime;

/**
 * Represents a single time slot with capacity and booking info.
 */
public record TimeSlotDTO(
        Long id,
        LocalDateTime start,
        LocalDateTime end,
        int capacity,
        int bookedCount,
        boolean blocked,
        boolean full
) {
}

