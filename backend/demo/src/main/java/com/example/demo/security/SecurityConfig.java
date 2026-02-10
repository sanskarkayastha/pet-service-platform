package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public read-only endpoints (browsing)
                .requestMatchers("GET", "/api/business/allBusinesses").permitAll()
                .requestMatchers("GET", "/api/business/{businessId}").permitAll()
                .requestMatchers("GET", "/api/business/getBusinessStatus/**").permitAll()
                .requestMatchers("GET", "/api/services/business/**").permitAll()
                .requestMatchers("GET", "/api/services/{serviceId}").permitAll()
                .requestMatchers("GET", "/api/working-hours/business/**").permitAll()
                .requestMatchers("GET", "/api/users/testUser/**").permitAll()
                .requestMatchers("/api/debug/**").permitAll() // Debug endpoint - remove in production
                .requestMatchers("/error").permitAll()
                
                // Admin endpoints (admin is the super admin role)
                .requestMatchers("/api/business/getPendingBusiness").hasRole("ADMIN")
                .requestMatchers("/api/business/{businessId}/approve").hasRole("ADMIN")
                .requestMatchers("GET", "/api/users/getAllUsers").hasRole("ADMIN")
                
                // Business management endpoints (require BUSINESS role)
                .requestMatchers("/api/business/management/**").hasRole("BUSINESS")
                .requestMatchers("/api/services/management/**").hasRole("BUSINESS")
                .requestMatchers("/api/working-hours/my-hours", "/api/working-hours/update").hasRole("BUSINESS")
                .requestMatchers("/api/bookings/my-bookings/**").hasRole("BUSINESS")
                
                // Write operations require authentication
                .requestMatchers("POST", "/api/business/addBusiness").authenticated()
                .requestMatchers("POST", "/api/bookings/create").authenticated()
                .requestMatchers("PUT", "/api/bookings/**").authenticated()
                
                // All other GET requests are public (browsing)
                .requestMatchers("GET", "/api/**").permitAll()
                
                // All other requests
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
