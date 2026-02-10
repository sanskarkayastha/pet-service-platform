package com.example.demo.mapper;

import java.util.List;

import com.example.demo.dto.BusinessResponseDTO;
import com.example.demo.model.Business;

public class BusinessMapper {

    private BusinessMapper() {

    }

    public static BusinessResponseDTO toResponseDTO(Business business) {
        // Safely get user ID - user should be eagerly fetched
        String userId = business.getUser() != null ? business.getUser().getId() : null;
        
        List<String> category = business.getCategory() != null 
            ? business.getCategory().stream().map(oldCategory -> String.valueOf(oldCategory)).toList()
            : List.of();
            
        return new BusinessResponseDTO(
                userId,
                business.getBusinessName(),
                business.getOwnerName(),
                business.getEmail(),
                business.getContactNumber(),
                business.getBusinessAddress(),
                business.getDescription(),
                business.getCity(),
                business.getPanNumber(),
                category,
                business.getBusinessLogo() != null ? business.getBusinessLogo() : business.getVerificationDoc());
    }
}
