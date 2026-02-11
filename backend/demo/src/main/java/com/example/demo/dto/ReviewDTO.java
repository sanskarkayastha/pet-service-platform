package com.example.demo.dto;

import java.time.LocalDateTime;

public record ReviewDTO(
        Long id,
        String userName,
        int rating,
        String comment,
        LocalDateTime createdAt
) {
}

