package com.example.demo.dto;

import java.util.List;
import com.example.demo.model.CategoryType;

public class ServiceCreateRequest {

    private Long businessId;
    private CategoryType category;
    private String title;
    private Integer durationMinutes;
    private String description;
    private Double price;
    // Maximum customers per slot for this service
    private Integer capacityPerSlot;
    private List<AddonRequest> addons;

    public static class AddonRequest {
        private String name;
        private String description;
        private Double price;

        // getters & setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }
    }

    // getters & setters
    public Long getBusinessId() {
        return businessId;
    }

    public void setBusinessId(Long businessId) {
        this.businessId = businessId;
    }

    public CategoryType getCategory() {
        return category;
    }

    public void setCategory(CategoryType category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getCapacityPerSlot() {
        return capacityPerSlot;
    }

    public void setCapacityPerSlot(Integer capacityPerSlot) {
        this.capacityPerSlot = capacityPerSlot;
    }

    public List<AddonRequest> getAddons() {
        return addons;
    }

    public void setAddons(List<AddonRequest> addons) {
        this.addons = addons;
    }
}
