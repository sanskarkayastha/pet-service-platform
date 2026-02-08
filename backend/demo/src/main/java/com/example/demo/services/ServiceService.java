package com.example.demo.services;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ServiceCreateRequest;
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
}
