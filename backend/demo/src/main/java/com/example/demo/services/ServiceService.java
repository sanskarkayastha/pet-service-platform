package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.ServiceCreateRequest;
import com.example.demo.dto.ServiceResponseDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.*;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BusinessRepository businessRepository;

    public Long createService(ServiceCreateRequest request) {

        Business business = businessRepository.findById(request.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found"));

        if (!business.getCategory().contains(request.getCategory())) {
            throw new IllegalArgumentException(
                    "Business does not support this service category");
        }

        BusinessService service = new BusinessService();
        service.setBusiness(business);
        service.setCategory(request.getCategory());
        service.setTitle(request.getTitle());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setCapacityPerSlot(request.getCapacityPerSlot());

        // ✅ Ensure collection is initialized
        service.setAddons(new ArrayList<>());

        if (request.getAddons() != null) {
            for (var addonReq : request.getAddons()) {
                ServiceAddon addon = new ServiceAddon();
                addon.setService(service);
                addon.setName(addonReq.getName());
                addon.setDescription(addonReq.getDescription());
                addon.setPrice(addonReq.getPrice());

                service.getAddons().add(addon); // ✅ add to existing list
            }
        }

        return serviceRepository.save(service).getId();
    }

    public List<ServiceResponseDTO> getServicesByBusiness(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        List<BusinessService> services = serviceRepository.findByBusinessWithDetails(business);
        return services.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public ServiceResponseDTO getServiceById(Long serviceId) {
        BusinessService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return toResponseDTO(service);
    }

    @Transactional
    public ServiceResponseDTO updateService(Long serviceId, ServiceCreateRequest request) {

        BusinessService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        Business business = businessRepository.findById(request.getBusinessId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        if (!business.getCategory().contains(request.getCategory())) {
            throw new IllegalArgumentException("Business does not support this service category");
        }

        service.setCategory(request.getCategory());
        service.setTitle(request.getTitle());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setCapacityPerSlot(request.getCapacityPerSlot());

        // ✅ Correct way to update addons with orphanRemoval=true
        if (request.getAddons() != null) {

            // Ensure collection exists
            if (service.getAddons() == null) {
                service.setAddons(new ArrayList<>());
            }

            // Clear existing addons (orphanRemoval will delete them)
            service.getAddons().clear();

            // Add new addons to SAME collection instance
            for (var addonReq : request.getAddons()) {
                ServiceAddon addon = new ServiceAddon();
                addon.setService(service);
                addon.setName(addonReq.getName());
                addon.setDescription(addonReq.getDescription());
                addon.setPrice(addonReq.getPrice());

                service.getAddons().add(addon); // ✅ DO NOT replace list
            }
        }

        return toResponseDTO(service); // no need to save explicitly (managed entity)
    }

    @Transactional
    public void deleteService(Long serviceId) {
        BusinessService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        serviceRepository.delete(service);
    }

    private ServiceResponseDTO toResponseDTO(BusinessService service) {

        List<ServiceResponseDTO.AddonResponseDTO> addons =
                service.getAddons() != null
                        ? service.getAddons().stream()
                        .map(addon -> new ServiceResponseDTO.AddonResponseDTO(
                                addon.getId(),
                                addon.getName(),
                                addon.getDescription(),
                                addon.getPrice()))
                        .toList()
                        : new ArrayList<>();

        return new ServiceResponseDTO(
                service.getId(),
                service.getBusiness().getId(),
                service.getCategory(),
                service.getTitle(),
                service.getDurationMinutes(),
                service.getDescription(),
                service.getPrice(),
                service.getCapacityPerSlot(),
                addons
        );
    }
}
