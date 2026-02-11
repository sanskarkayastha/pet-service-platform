package com.example.demo.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "services")
public class BusinessService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /* ================= BUSINESS ================= */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    /* ================= SERVICE INFO ================= */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType category;

    private String title;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double price;

    /**
     * Maximum number of customers/pets that can be handled
     * concurrently for this service in a single time slot.
     * If null, defaults to 1 in business logic.
     */
    @Column(name = "capacity_per_slot")
    private Integer capacityPerSlot;

    /* ================= ADD-ONS ================= */
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ServiceAddon> addons;

    /* ================= GETTERS & SETTERS ================= */

    public Long getId() {
        return id;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
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

    public List<ServiceAddon> getAddons() {
        return addons;
    }

    public void setAddons(List<ServiceAddon> addons) {
        this.addons = addons;
    }

}
