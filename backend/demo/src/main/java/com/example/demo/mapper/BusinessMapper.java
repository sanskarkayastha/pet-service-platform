package com.example.demo.mapper;

import java.util.List;

import com.example.demo.dto.BusinessResponseDTO;
import com.example.demo.model.Business;

public class BusinessMapper {

    private BusinessMapper() {

    }

    public static BusinessResponseDTO toResponseDTO(Business business) {

        List<String> category = business.getCategory().stream().map(oldCategory -> String.valueOf(oldCategory))
                .toList();
        return new BusinessResponseDTO(
                business.getUser().getId(),
                business.getBusinessName(),
                business.getOwnerName(),
                business.getEmail(),
                business.getContactNumber(),
                business.getBusinessAddress(),
                business.getDescription(),
                business.getCity(),
                business.getPanNumber(),
                category,
                business.getVerificationDoc());
    }
}
