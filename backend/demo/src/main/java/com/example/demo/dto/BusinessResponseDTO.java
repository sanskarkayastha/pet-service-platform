package com.example.demo.dto;

import java.util.List;

public record BusinessResponseDTO(
                Long id,
                String userId,
                String businessName,
                String ownerName,
                String email,
                String contactNumber,
                String businessAddress,
                String description,
                String city,
                String panNumber,
                List<String> category,
                String imageUrl) {

}
