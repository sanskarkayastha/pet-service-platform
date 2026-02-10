package com.example.demo.security;

import com.example.demo.repository.UserRepository;
import com.example.demo.model.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String jwt = getJwtFromRequest(request);
            
            // Only process JWT if token is present
            // If no token, let request continue as unauthenticated (for public endpoints)
            if (jwt != null && tokenProvider.validateToken(jwt)) {
                String userId = tokenProvider.getUserIdFromToken(jwt);
                logger.debug("Extracted user ID from token: " + userId);
                
                Optional<User> userOptional = userRepository.findById(userId);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    logger.debug("User found: " + user.getEmail() + ", Role: " + user.getRole());
                    
                    UserPrincipal userPrincipal = new UserPrincipal(user);
                    logger.debug("User authorities: " + userPrincipal.getAuthorities());
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            userPrincipal, 
                            null, 
                            userPrincipal.getAuthorities()
                        );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    logger.warn("User not found in database for ID: " + userId);
                    // Don't set authentication - user will be treated as unauthenticated
                }
            } else {
                if (jwt == null) {
                    logger.debug("No JWT token found in request - allowing as unauthenticated");
                } else {
                    logger.warn("JWT token validation failed - allowing as unauthenticated");
                }
                // Continue without authentication - Spring Security will handle authorization
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
            // Continue filter chain - let Spring Security handle unauthenticated requests
        }
        
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
