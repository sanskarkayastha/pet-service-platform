package com.example.demo.dto;

import java.time.LocalTime;
import java.util.List;

public record WorkingHoursRequest(
    List<DayHours> days
) {
    public record DayHours(
        String dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        Boolean isAvailable,
        LocalTime breakStartTime,
        LocalTime breakEndTime
    ) {}
}
