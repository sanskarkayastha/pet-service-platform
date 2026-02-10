package com.example.demo.services;

import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponseDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceAddonRepository serviceAddonRepository;

    @Transactional
    public BookingResponseDTO createBooking(BookingRequest request, String userId) {
        BusinessService service = serviceRepository.findById(request.serviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Business business = service.getBusiness();

        // Calculate end time based on service duration
        LocalDateTime endDateTime = request.bookingDateTime()
                .plusMinutes(service.getDurationMinutes());

        // Calculate total price
        double totalPrice = service.getPrice();
        List<BookingAddon> bookingAddons = new ArrayList<>();

        if (request.addonIds() != null && !request.addonIds().isEmpty()) {
            for (Long addonId : request.addonIds()) {
                ServiceAddon addon = serviceAddonRepository.findById(addonId)
                        .orElseThrow(() -> new ResourceNotFoundException("Addon not found"));
                totalPrice += addon.getPrice();

                BookingAddon bookingAddon = new BookingAddon();
                bookingAddon.setAddon(addon);
                bookingAddon.setPrice(addon.getPrice());
                bookingAddons.add(bookingAddon);
            }
        }

        // Create booking
        Booking booking = new Booking();
        booking.setBusiness(business);
        booking.setService(service);
        booking.setUser(user);
        booking.setBookingDateTime(request.bookingDateTime());
        booking.setEndDateTime(endDateTime);
        booking.setStatus(BookingStatus.PENDING);
        booking.setCustomerName(request.customerName());
        booking.setCustomerEmail(request.customerEmail());
        booking.setCustomerPhone(request.customerPhone());
        booking.setPetName(request.petName());
        booking.setPetBreed(request.petBreed());
        booking.setNotes(request.notes());
        booking.setTotalPrice(totalPrice);

        // Set addons
        for (BookingAddon bookingAddon : bookingAddons) {
            bookingAddon.setBooking(booking);
        }
        booking.setSelectedAddons(bookingAddons);

        Booking savedBooking = bookingRepository.save(booking);
        return toResponseDTO(savedBooking);
    }

    public List<BookingResponseDTO> getBookingsByBusiness(Business business) {
        List<Booking> bookings = bookingRepository.findByBusinessWithDetails(business);
        return bookings.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getBookingsByBusinessAndStatus(Business business, BookingStatus status) {
        List<Booking> bookings = bookingRepository.findByBusinessAndStatus(business, status);
        return bookings.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);
        return toResponseDTO(updated);
    }

    public BookingResponseDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return toResponseDTO(booking);
    }

    private BookingResponseDTO toResponseDTO(Booking booking) {
        List<BookingResponseDTO.AddonResponse> addons = booking.getSelectedAddons() != null
                ? booking.getSelectedAddons().stream()
                        .map(ba -> new BookingResponseDTO.AddonResponse(
                                ba.getAddon().getId(),
                                ba.getAddon().getName(),
                                ba.getAddon().getDescription(),
                                ba.getPrice()))
                        .collect(Collectors.toList())
                : new ArrayList<>();

        return new BookingResponseDTO(
                booking.getId(),
                booking.getBusiness().getId(),
                booking.getBusiness().getBusinessName(),
                booking.getService().getId(),
                booking.getService().getTitle(),
                booking.getUser().getId(),
                booking.getCustomerName(),
                booking.getBookingDateTime(),
                booking.getEndDateTime(),
                booking.getStatus(),
                booking.getCustomerEmail(),
                booking.getCustomerPhone(),
                booking.getPetName(),
                booking.getPetBreed(),
                booking.getNotes(),
                booking.getTotalPrice(),
                addons,
                booking.getCreatedAt()
        );
    }
}
