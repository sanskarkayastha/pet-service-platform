package com.example.demo.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Debug controller to verify JWT token parsing and role conversion
 * REMOVE THIS IN PRODUCTION!
 */
@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/token")
    public Map<String, Object> debugToken() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "This endpoint is public - use /api/debug/auth to test authentication");
        response.put("jwksEndpoint", "http://localhost:3000/api/auth/jwks");
        return response;
    }

    @GetMapping("/auth")
    public Map<String, Object> debugAuth(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        
        if (authentication == null) {
            response.put("error", "No authentication found");
            return response;
        }

        // Basic auth info
        response.put("authenticated", authentication.isAuthenticated());
        response.put("principal", authentication.getPrincipal().toString());
        response.put("name", authentication.getName());
        
        // Authorities (roles)
        response.put("authorities", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        // If it's a JWT token, get all claims
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            Jwt jwt = jwtAuth.getToken();
            
            response.put("jwtClaims", jwt.getClaims());
            response.put("jwtHeaders", jwt.getHeaders());
            response.put("tokenValue", jwt.getTokenValue().substring(0, 50) + "...");
            
            // Specific role claim
            response.put("roleClaim", jwt.getClaim("role"));
            response.put("userId", jwt.getClaim("userId"));
            response.put("email", jwt.getClaim("email"));
        }

        return response;
    }

    @GetMapping("/admin-test")
    public Map<String, Object> adminTest(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        
        boolean hasAdminRole = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        response.put("hasAdminRole", hasAdminRole);
        response.put("authorities", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        
        return response;
    }

    @GetMapping("/business-test")
    public Map<String, Object> businessTest(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        
        boolean hasBusinessRole = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_BUSINESS"));
        
        response.put("hasBusinessRole", hasBusinessRole);
        response.put("authorities", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        
        return response;
    }
}