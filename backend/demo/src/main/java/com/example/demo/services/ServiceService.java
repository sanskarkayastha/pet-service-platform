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

        //  Validate category if it matches to business or not
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

        // Handle add-ons
        if (request.getAddons() != null) {
            var addons = new ArrayList<ServiceAddon>();

            for (var addonReq : request.getAddons()) {
                ServiceAddon addon = new ServiceAddon();
                addon.setService(service);
                addon.setName(addonReq.getName());
                addon.setDescription(addonReq.getDescription());
                addon.setPrice(addonReq.getPrice());

                addons.add(addon);
            }
            service.setAddons(addons);
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

        // Update add-ons
        if (request.getAddons() != null) {
            // Remove existing addons
            if (service.getAddons() != null) {
                service.getAddons().clear();
            }

            // Add new addons
            var addons = new ArrayList<ServiceAddon>();
            for (var addonReq : request.getAddons()) {
                ServiceAddon addon = new ServiceAddon();
                addon.setService(service);
                addon.setName(addonReq.getName());
                addon.setDescription(addonReq.getDescription());
                addon.setPrice(addonReq.getPrice());
                addons.add(addon);
            }
            service.setAddons(addons);
        }

        BusinessService updated = serviceRepository.save(service);
        return toResponseDTO(updated);
    }

    @Transactional
    public void deleteService(Long serviceId) {
        BusinessService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        serviceRepository.delete(service);
    }

    private ServiceResponseDTO toResponseDTO(BusinessService service) {
        List<ServiceResponseDTO.AddonResponseDTO> addons = service.getAddons() != null
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
                addons
        );
    }
}
