package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository uRepo;

    public User findById(String id) {
        return uRepo.findById(id).orElse(null);
    }


    public User save(User user) {
        return uRepo.save(user);
    }

    

    
}
