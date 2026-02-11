package com.example.demo.dto;

import com.example.demo.model.CategoryType;
import java.util.List;

public record ServiceResponseDTO(
    Long id,
    Long businessId,
    CategoryType category,
    String title,
    Integer durationMinutes,
    String description,
    Double price,
    Integer capacityPerSlot,
    List<AddonResponseDTO> addons
) {
    public record AddonResponseDTO(
        Long id,
        String name,
        String description,
        Double price
    ) {}
}
