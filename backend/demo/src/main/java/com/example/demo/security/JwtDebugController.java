package com.example.demo.security;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Debug controller to help troubleshoot JWT authentication issues
 * Remove this in production
 */
@RestController
@RequestMapping("/api/debug")
public class JwtDebugController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/auth-info")
    public ResponseEntity<Map<String, Object>> getAuthInfo() {
        Map<String, Object> info = new HashMap<>();
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            info.put("authenticated", true);
            info.put("principal", authentication.getPrincipal().getClass().getName());
            info.put("authorities", authentication.getAuthorities().toString());
            
            if (authentication.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                info.put("userId", userPrincipal.getId());
                info.put("username", userPrincipal.getUsername());
                info.put("role", userPrincipal.getRole());
                
                // Get user from database
                Optional<User> userOptional = userRepository.findById(userPrincipal.getId());
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    info.put("dbUser", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                    ));
                }
            }
        } else {
            info.put("authenticated", false);
        }
        
        return ResponseEntity.ok(info);
    }
}
