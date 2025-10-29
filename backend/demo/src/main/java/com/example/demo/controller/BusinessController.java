package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Business;
import com.example.demo.repository.BusinessRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/business")
public class BusinessController {
    
    @Autowired
    private BusinessRepository bRepo;

    @PostMapping("/addBusiness")
    public String addBusinesss(@RequestBody Business business) {
        try {
            bRepo.save(business);
            return "Business Added Successfully";
        } catch (Exception e) {
            return e.toString();
        }
    }
    

}
