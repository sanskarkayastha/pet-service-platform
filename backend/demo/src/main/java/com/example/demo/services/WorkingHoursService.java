package com.example.demo.services;

import com.example.demo.dto.WorkingHoursRequest;
import com.example.demo.dto.WorkingHoursResponseDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.WorkingHoursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkingHoursService {

    @Autowired
    private WorkingHoursRepository workingHoursRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Transactional
    public List<WorkingHoursResponseDTO> updateWorkingHours(Long businessId, WorkingHoursRequest request) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        // Delete existing working hours
        workingHoursRepository.deleteByBusiness(business);

        // Create new working hours
        List<WorkingHours> workingHoursList = request.days().stream()
                .map(dayHours -> {
                    WorkingHours wh = new WorkingHours();
                    wh.setBusiness(business);
                    wh.setDayOfWeek(DayOfWeek.valueOf(dayHours.dayOfWeek().toUpperCase()));
                    wh.setStartTime(dayHours.startTime());
                    wh.setEndTime(dayHours.endTime());
                    wh.setIsAvailable(dayHours.isAvailable());
                    wh.setBreakStartTime(dayHours.breakStartTime());
                    wh.setBreakEndTime(dayHours.breakEndTime());
                    return wh;
                })
                .collect(Collectors.toList());

        List<WorkingHours> saved = workingHoursRepository.saveAll(workingHoursList);
        return saved.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<WorkingHoursResponseDTO> getWorkingHours(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        List<WorkingHours> workingHours = workingHoursRepository.findByBusiness(business);
        return workingHours.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private WorkingHoursResponseDTO toResponseDTO(WorkingHours wh) {
        return new WorkingHoursResponseDTO(
                wh.getId(),
                wh.getDayOfWeek().name(),
                wh.getStartTime(),
                wh.getEndTime(),
                wh.getIsAvailable(),
                wh.getBreakStartTime(),
                wh.getBreakEndTime()
        );
    }
}
