package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record BusinessDTO(
                @NotBlank String userId,
                @NotBlank String businessName,
                @NotBlank String ownerName,
                @Email String email,
                @NotBlank String contactNumber,
                String businessAddress,
                String description,
                String city,
                String panNumber) {

}
