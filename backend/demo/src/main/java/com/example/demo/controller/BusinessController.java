package com.example.demo.controller;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Business;
import com.example.demo.repository.BusinessRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/business")
public class BusinessController {

    @Autowired
    private BusinessRepository bRepo;

    @Autowired
    private UserRepository uRepo;

    @GetMapping("/testBusiness")
    public ResponseEntity<?> getBusiness() {
        return ResponseEntity.ok("GET Business called with param: ");
    }

    @PostMapping("/addBusiness")
    public ResponseEntity<?> addBusiness(@ModelAttribute Business business,
            @RequestParam("userId") String userId,
            @RequestParam("category-select") String category,
            @RequestParam("logo-upload") MultipartFile logo,
            @RequestParam("license-upload") MultipartFile license,
            @RequestParam("verification-upload") MultipartFile verification) {
        try {
            if (uRepo.existsById(userId)) {
                System.out.println("here:" + userId);
                uRepo.findById(userId).ifPresent(user -> business.setUser(user));
                byte logoBytes[] = logo.getBytes();
                byte licenseBytes[] = license.getBytes();
                byte verificationBytes[] = verification.getBytes();

                List<String> oldList = business.getCategory();
                if (oldList == null) {
                    oldList = new ArrayList<>();
                }
                oldList.add(category);
                business.setCategory(oldList);

                business.setBusinessLogo(Base64.getEncoder().encodeToString(logoBytes));
                business.setLicenseFile(Base64.getEncoder().encodeToString(licenseBytes));
                business.setVerificationDoc(Base64.getEncoder().encodeToString(verificationBytes));
                bRepo.save(business);
                return ResponseEntity.ok("Business registered successfully");
            } else {
                return ResponseEntity.status(400).body("Error: User with given ID does not exist");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/allBusinesses")
    public ResponseEntity<?> getAllBusinesses() {
        try {
            List<Business> businesses = bRepo.findAll();
            return ResponseEntity.ok(businesses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

}
