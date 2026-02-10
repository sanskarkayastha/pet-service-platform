package com.example.demo.dto;

import java.time.LocalTime;

public record WorkingHoursResponseDTO(
    Long id,
    String dayOfWeek,
    LocalTime startTime,
    LocalTime endTime,
    Boolean isAvailable,
    LocalTime breakStartTime,
    LocalTime breakEndTime
) {}
