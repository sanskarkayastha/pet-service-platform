package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "businesses")
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ================= USER ================= */
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /* ================= BASIC INFO ================= */
    private String businessName;
    private String ownerName;
    private String email;
    private String contactNumber;
    private String businessAddress;
    private String description;
    private String city;
    private String panNumber;

    /* ================= FILES (byte[]) ================= */

    // -------- Business Logo --------
    @Lob
    @Column(columnDefinition = "TEXT")
    private String businessLogo;

    // -------- License --------
    @Lob
    @Column(columnDefinition = "TEXT")
    private String licenseFile;

    // -------- Verification Document --------
    @Lob
    @Column(columnDefinition = "TEXT")
    private String verificationDoc;

    /* ================= CATEGORY ================= */
    @Enumerated(EnumType.STRING)
    @Column(name = "category_type") // Use a regular column mapping
    private CategoryType category;

    /* ================= STATUS ================= */
    @Enumerated(EnumType.STRING)
    private BusinessStatus status = BusinessStatus.PENDING;

    /* ================= GETTERS & SETTERS ================= */

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getBusinessAddress() {
        return businessAddress;
    }

    public void setBusinessAddress(String businessAddress) {
        this.businessAddress = businessAddress;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    /* ===== FILE GETTERS / SETTERS ===== */

    public String getBusinessLogo() {
        return businessLogo;
    }

    public void setBusinessLogo(String businessLogo) {
        this.businessLogo = businessLogo;
    }

    public String getLicenseFile() {
        return licenseFile;
    }

    public void setLicenseFile(String licenseFile) {
        this.licenseFile = licenseFile;
    }

    public String getVerificationDoc() {
        return verificationDoc;
    }

    public void setVerificationDoc(String verificationDoc) {
        this.verificationDoc = verificationDoc;
    }

    public CategoryType getCategory() {
        return category;
    }

    public void setCategory(CategoryType category) {
        this.category = category;
    }

    public BusinessStatus getStatus() {
        return status;
    }

    public void setStatus(BusinessStatus status) {
        this.status = status;
    }
}
