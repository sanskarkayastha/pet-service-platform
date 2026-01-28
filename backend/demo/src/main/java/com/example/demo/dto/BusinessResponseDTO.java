package com.example.demo.dto;

public record BusinessResponseDTO(
        String userId,
        String businessName,
        String ownerName,
        String email,
        String contactNumber,
        String businessAddress,
        String description,
        String city,
        String panNumber,
        String imageUrl) {

}
