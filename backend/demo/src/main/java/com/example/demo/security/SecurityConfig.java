package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;

import java.lang.System.Logger;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // Public browsing
                .requestMatchers(HttpMethod.GET, "/api/business/allBusinesses").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/business/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/business/getBusinessStatus/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/services/business/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/services/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/working-hours/business/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users/testUser/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/ws").permitAll()

                // Messaging
                .requestMatchers(HttpMethod.GET, "/api/messages/customer").hasRole("USER")
                .requestMatchers(HttpMethod.GET, "/api/messages/business").hasRole("BUSINESS")
                .requestMatchers(HttpMethod.POST, "/api/messages/conversations").hasRole("USER")
                .requestMatchers(HttpMethod.GET, "/api/messages/conversations/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/messages/conversations/*/read").authenticated()

                // ADMIN
                .requestMatchers("/api/business/getPendingBusiness").hasRole("ADMIN")
                .requestMatchers("/api/business/*/approve").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/users/getAllUsers").hasRole("ADMIN")

                // BUSINESS
                .requestMatchers("/api/business/management/**").hasRole("BUSINESS")
                .requestMatchers("/api/services/management/**").hasRole("BUSINESS")
                .requestMatchers("/api/working-hours/my-hours", "/api/working-hours/update").hasRole("BUSINESS")
                .requestMatchers("/api/bookings/my-bookings/**").hasRole("BUSINESS")

                // Authenticated writes
                .requestMatchers(HttpMethod.POST, "/api/business/addBusiness").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/bookings/create").hasRole("USER")
                .requestMatchers(HttpMethod.PUT, "/api/bookings/**").authenticated()

                // Everything else requires login
                .anyRequest().authenticated()
            )

            // JWT validation via Better Auth JWKS
            .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );

        return http.build();
    }

    /**
     * Converts JWT "role": "admin" -> ROLE_ADMIN
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter defaultConverter = new JwtGrantedAuthoritiesConverter();
        defaultConverter.setAuthoritiesClaimName("role");
        defaultConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
        authenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            
            Collection<GrantedAuthority> authorities = defaultConverter.convert(jwt);
            return authorities.stream()
                    .map(auth -> new SimpleGrantedAuthority(auth.getAuthority().toUpperCase()))
                    .collect(Collectors.toList());
        });

        return authenticationConverter;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri("http://localhost:3000/api/auth/jwks").build();

        decoder.setJwtValidator(
            JwtValidators.createDefaultWithIssuer("http://localhost:3000")
        );

        return decoder;
    }

    /**
     * CORS config
     */
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
