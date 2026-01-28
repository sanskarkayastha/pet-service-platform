package com.example.demo.services;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.BusinessDTO;
import com.example.demo.dto.BusinessResponseDTO;
import com.example.demo.model.Business;
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
            Business business = new Business();

            // adding values to the busineess object
            business.setUser(user.get());
            business.setBusinessName(dto.businessName());
            business.setOwnerName(dto.ownerName());
            business.setEmail(dto.email());
            business.setContactNumber(dto.contactNumber());
            business.setBusinessAddress(dto.businessAddress());
            business.setDescription(dto.description());
            business.setCity(dto.city());
            business.setPanNumber(dto.panNumber());

            // conducting image upload
            String logoUrl = imgService.imageUpload(logo);
            String licenseUrl = imgService.imageUpload(licenseFile);
            String verificationDocUrl = imgService.imageUpload(verificationDoc);

            // assign the generated link to our object
            business.setBusinessLogo(logoUrl);
            business.setLicenseFile(licenseUrl);
            business.setVerificationDoc(verificationDocUrl);

            bRepo.save(business);
            return business;
        }
    }

    // get all business function
    // this is to display cards so we don't need everything but only few things and
    // the main image
    public List<BusinessResponseDTO> getAllBusinesses() {
        return bRepo.findAll()
                .stream()
                .map(business -> toResponseDTO(business))
                .toList();

    }

}
