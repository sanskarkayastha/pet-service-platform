package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.CurrentUser;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/getAllUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers(@CurrentUser User currentUser) {
        return userRepository.findAll();
    }

    @GetMapping("/testUser/{id}")
    public User testUser(@PathVariable("id") String id) {
        if (userRepository.existsById(id)) {
            System.out.println("User exists with id: " + id);
            User user = userRepository.findById(id).get();
            return user;
        }
        return null;
    }

}
