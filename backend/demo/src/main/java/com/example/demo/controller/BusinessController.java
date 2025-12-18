package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Business;
import com.example.demo.model.BusinessStatus;
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

    /* ================= TEST ================= */

    @GetMapping("/testBusiness")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("Business API working");
    }

    /* ================= ADD BUSINESS ================= */

    @PostMapping(value = "/addBusiness", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addBusiness(
            @ModelAttribute Business business,
            @RequestParam("userId") String userId,
            @RequestParam("category-select") String category,
            @RequestParam("logo-upload") MultipartFile logo,
            @RequestParam("license-upload") MultipartFile license,
            @RequestParam("verification-upload") MultipartFile verification) {

        try {
            var userOpt = uRepo.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User does not exist");
            }

            business.setUser(userOpt.get());

            /* ===== CATEGORY ===== */
            List<String> categories = business.getCategory();
            if (categories == null) {
                categories = new ArrayList<>();
            }
            categories.add(category);
            business.setCategory(categories);

            /* ===== FILES (byte[]) ===== */
            business.setBusinessLogo(logo.getBytes());
            business.setLicenseFile(license.getBytes());
            business.setVerificationDoc(verification.getBytes());

            business.setStatus(BusinessStatus.PENDING);

            bRepo.save(business);

            return ResponseEntity.ok("Business registered successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /* ================= LIST (SAFE, NO LOBS) ================= */

    @GetMapping("/allBusinesses")
    public ResponseEntity<?> getAllBusinesses() {

        try {
            List<BusinessSummary> list = bRepo.findAll()
                    .stream()
                    .map(b -> new BusinessSummary(
                            b.getId(),
                            b.getBusinessName(),
                            b.getCity(),
                            b.getStatus()
                    ))
                    .toList();

            return ResponseEntity.ok(list);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/pendingBusinesses")
    public ResponseEntity<?> getPendingBusinesses() {

        try {
            List<BusinessSummary> list = bRepo.findByStatus(BusinessStatus.PENDING)
                    .stream()
                    .map(b -> new BusinessSummary(
                            b.getId(),
                            b.getBusinessName(),
                            b.getCity(),
                            b.getStatus()
                    ))
                    .toList();

            return ResponseEntity.ok(list);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    /* ================= IMAGE STREAMING ================= */

    @GetMapping(value = "/logo/{id}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getBusinessLogo(@PathVariable Long id) {

        Business business = bRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        return ResponseEntity.ok(business.getBusinessLogo());
    }

    @GetMapping(value = "/license/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getLicense(@PathVariable Long id) {

        Business business = bRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        return ResponseEntity.ok(business.getLicenseFile());
    }

    @GetMapping(value = "/verification/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getVerification(@PathVariable Long id) {

        Business business = bRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        return ResponseEntity.ok(business.getVerificationDoc());
    }

    /* ================= DTO ================= */

    private record BusinessSummary(
            Long id,
            String businessName,
            String city,
            BusinessStatus status
    ) {}
}
