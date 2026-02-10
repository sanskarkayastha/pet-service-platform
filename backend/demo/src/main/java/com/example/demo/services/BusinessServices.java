package com.example.demo.services;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.BusinessDTO;
import com.example.demo.dto.BusinessResponseDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.BusinessAlreadyExistsException;
import com.example.demo.model.Business;
import com.example.demo.model.BusinessStatus;
import com.example.demo.model.CategoryType;
import com.example.demo.model.User;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.UserRepository;

import static com.example.demo.mapper.BusinessMapper.toResponseDTO;

@Service
public class BusinessServices {

    @Autowired
    private BusinessRepository bRepo;

    @Autowired
    private UserRepository uRepo;

    @Autowired
    private ImageUploadService imgService;

    // add business function
    public Business addBusiness(BusinessDTO dto, MultipartFile logo, MultipartFile licenseFile,
            MultipartFile verificationDoc) throws IOException {

        Optional<User> user = uRepo.findById(dto.userId());
        if (user.isEmpty()) {
            return null;

        } else {
            User existingUser = user.get();

            // If this user already has a business, prevent creating another one
            if (bRepo.findByUser(existingUser).isPresent()) {
                throw new BusinessAlreadyExistsException("Business already exists for this user");
            }

            Business business = new Business();

            // adding values to the busineess object
            business.setUser(existingUser);
            business.setBusinessName(dto.businessName());
            business.setOwnerName(dto.ownerName());
            business.setEmail(dto.email());
            business.setContactNumber(dto.contactNumber());
            business.setBusinessAddress(dto.businessAddress());
            business.setDescription(dto.description());
            business.setCity(dto.city());
            business.setPanNumber(dto.panNumber());
            // set location (may be null if not provided)
            if (dto.latitude() != null) {
                business.setLatitude(dto.latitude());
            }
            if (dto.longitude() != null) {
                business.setLongitude(dto.longitude());
            }

            // setting category type
            CategoryType category = CategoryType.valueOf(dto.category());
            Set<CategoryType> categorySet = Set.of(category);
            business.setCategory(categorySet);

            // conducting image upload
            String logoUrl = imgService.imageUpload(logo);
            String licenseUrl = imgService.imageUpload(licenseFile);
            String verificationDocUrl = imgService.imageUpload(verificationDoc);

            // assign the generated link to our object
            business.setBusinessLogo(logoUrl);
            business.setLicenseFile(licenseUrl);
            business.setVerificationDoc(verificationDocUrl);

            // update users role to business
            existingUser.setRole("business");

            uRepo.save(existingUser);
            bRepo.save(business);
            return business;
        }
    }

    // get all business function
    // this is to display cards so we don't need everything but only few things and
    // the main image
    public List<BusinessResponseDTO> getAllBusinesses() {
        return bRepo.findAllWithUser()
                .stream()
                .map(business -> toResponseDTO(business))
                .toList();

    }

    // get pending business for admin
    public List<Business> getAllPendingBusiness() {

        return bRepo.findByStatus(BusinessStatus.PENDING);
    }

    // get business status
    public BusinessStatus getBusinessStatus(String userId) {

        User user = uRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Business business = bRepo.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found for user: " + userId));

        return business.getStatus();
    }

    public Business approveBusiness(String userId) {
        User user = uRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Business business = bRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Business not found"));
        return approveBusiness(business.getId());
    }

    public Business approveBusiness(Long businessId) {
        Business business = bRepo.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));
        if (business.getStatus() == BusinessStatus.APPROVED) {
            return business;
        }
        business.setStatus(BusinessStatus.APPROVED);
        return bRepo.save(business);
    }

    public Business rejectBusiness(String userId, String rejectMsg) {
        User user = uRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Business business = bRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Business not found"));
        return rejectBusiness(business.getId(), rejectMsg);
    }

    public Business rejectBusiness(Long businessId, String rejectMsg) {
        Business business = bRepo.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));
        if (business.getStatus() == BusinessStatus.APPROVED) {
            return business;
        }
        business.setStatus(BusinessStatus.REJECTED);
        business.setRejectionMessage(rejectMsg);
        return bRepo.save(business);
    }
    // Update business information
    public Business updateBusiness(Long businessId, com.example.demo.dto.BusinessUpdateRequest request) {
        Business business = bRepo.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found"));

        if (request.businessName() != null) business.setBusinessName(request.businessName());
        if (request.ownerName() != null) business.setOwnerName(request.ownerName());
        if (request.email() != null) business.setEmail(request.email());
        if (request.contactNumber() != null) business.setContactNumber(request.contactNumber());
        if (request.businessAddress() != null) business.setBusinessAddress(request.businessAddress());
        if (request.description() != null) business.setDescription(request.description());
        if (request.city() != null) business.setCity(request.city());
        if (request.panNumber() != null) business.setPanNumber(request.panNumber());

        return bRepo.save(business);
    }

    // Get business by user ID
    public Business getBusinessByUserId(String userId) {
        User user = uRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bRepo.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found for user"));
    }

    // Get business by business ID
    public Business getBusinessById(Long businessId) {
        return bRepo.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));
    }

}
