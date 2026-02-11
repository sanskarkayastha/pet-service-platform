package com.example.demo.services;

import com.example.demo.dto.TimeSlotDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TimeSlotService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    /**
     * Get time slots for a given business, date and (optionally) service.
     * Slots are explicitly created by the business owner via the admin UI.
     */
    public List<TimeSlotDTO> getSlotsForDate(Long businessId,
                                             Long serviceId,
                                             LocalDate date) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        // Preload bookings for that day for this business (all services share slot capacity)
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
        List<Booking> bookings = bookingRepository.findByBusinessAndDateRange(business, dayStart, dayEnd)
                .stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .toList();

        // Group bookings by slot start time (aligned to their own bookingDateTime)
        Map<LocalDateTime, Long> bookingsPerSlot = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::getBookingDateTime,
                        Collectors.counting()
                ));

        List<TimeSlotDTO> result = new ArrayList<>();

        // Fetch explicit time slots created for this business & date
        List<TimeSlot> slots = timeSlotRepository.findByBusinessAndDateOrderByStartTimeAsc(business, date);

        for (TimeSlot slot : slots) {
            LocalDateTime slotStart = date.atTime(slot.getStartTime());
            LocalDateTime slotEnd = date.atTime(slot.getEndTime());

            int capacity = slot.getCapacity() != null ? slot.getCapacity() : 1;
            int bookedCount = bookingsPerSlot.getOrDefault(slotStart, 0L).intValue();
            boolean full = bookedCount >= capacity;

            result.add(new TimeSlotDTO(
                    slot.getId(),
                    slotStart,
                    slotEnd,
                    capacity,
                    bookedCount,
                    false,
                    full
            ));
        }

        return result;
    }

    /**
     * Admin: get slots for the current business and date.
     */
    public List<TimeSlotDTO> getSlotsForBusinessAndDate(Long businessId, LocalDate date) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();

        List<Booking> bookings = bookingRepository.findByBusinessAndDateRange(business, dayStart, dayEnd)
                .stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .toList();

        Map<LocalDateTime, Long> bookingsPerSlot = bookings.stream()
                .collect(Collectors.groupingBy(
                        Booking::getBookingDateTime,
                        Collectors.counting()
                ));

        List<TimeSlotDTO> result = new ArrayList<>();
        List<TimeSlot> slots = timeSlotRepository.findByBusinessAndDateOrderByStartTimeAsc(business, date);

        for (TimeSlot slot : slots) {
            LocalDateTime slotStart = date.atTime(slot.getStartTime());
            LocalDateTime slotEnd = date.atTime(slot.getEndTime());
            int capacity = slot.getCapacity() != null ? slot.getCapacity() : 1;
            int bookedCount = bookingsPerSlot.getOrDefault(slotStart, 0L).intValue();
            boolean full = bookedCount >= capacity;

            result.add(new TimeSlotDTO(
                    slot.getId(),
                    slotStart,
                    slotEnd,
                    capacity,
                    bookedCount,
                    false,
                    full
            ));
        }

        return result;
    }
}

