package com.example.demo.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

/**
 * Utility class for extracting information from JWT tokens
 */
public class JwtUtils {

    /**
     * Extract user ID from JWT authentication
     * 
     * @param authentication Spring Security Authentication object
     * @return User ID as String, or null if not found
     */
    public static String extractUserId(Authentication authentication) {
        if (authentication == null) {
            System.err.println("[JwtUtils] Authentication is null");
            return null;
        }

        System.out.println("[JwtUtils] Authentication type: " + authentication.getClass().getName());
        System.out.println("[JwtUtils] Principal type: " + authentication.getPrincipal().getClass().getName());

        // Handle JWT authentication
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            Jwt jwt = jwtAuth.getToken();
            
            System.out.println("[JwtUtils] JWT Claims: " + jwt.getClaims());
            
            // Try to get userId from different possible claim names
            Object userIdClaim = jwt.getClaim("userId");
            if (userIdClaim == null) {
                userIdClaim = jwt.getClaim("sub"); // subject claim (standard JWT claim)
            }
            if (userIdClaim == null) {
                userIdClaim = jwt.getClaim("user_id");
            }
            
            if (userIdClaim != null) {
                String userId = userIdClaim.toString();
                System.out.println("[JwtUtils] Extracted userId: " + userId);
                return userId;
            }
            
            System.err.println("[JwtUtils] No userId claim found in JWT. Available claims: " + jwt.getClaims().keySet());
            return null;
        }
        
        // Fallback to principal name
        String principalName = authentication.getName();
        System.out.println("[JwtUtils] Using principal name as fallback: " + principalName);
        return principalName;
    }

    /**
     * Extract email from JWT authentication
     * 
     * @param authentication Spring Security Authentication object
     * @return Email as String, or null if not found
     */
    public static String extractEmail(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            Jwt jwt = jwtAuth.getToken();
            
            Object emailClaim = jwt.getClaim("email");
            return emailClaim != null ? emailClaim.toString() : null;
        }
        return null;
    }

    /**
     * Extract role from JWT authentication
     * 
     * @param authentication Spring Security Authentication object
     * @return Role as String, or null if not found
     */
    public static String extractRole(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            Jwt jwt = jwtAuth.getToken();
            
            Object roleClaim = jwt.getClaim("role");
            return roleClaim != null ? roleClaim.toString() : null;
        }
        return null;
    }

    /**
     * Extract any custom claim from JWT
     * 
     * @param authentication Spring Security Authentication object
     * @param claimName Name of the claim to extract
     * @return Claim value as String, or null if not found
     */
    public static String extractClaim(Authentication authentication, String claimName) {
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            Jwt jwt = jwtAuth.getToken();
            
            Object claim = jwt.getClaim(claimName);
            return claim != null ? claim.toString() : null;
        }
        return null;
    }

    /**
     * Get the full JWT token
     * 
     * @param authentication Spring Security Authentication object
     * @return Jwt object, or null if not JWT authentication
     */
    public static Jwt getJwt(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
            return jwtAuth.getToken();
        }
        return null;
    }
}