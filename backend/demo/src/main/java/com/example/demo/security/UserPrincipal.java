package com.example.demo.security;

import com.example.demo.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserPrincipal implements UserDetails {
    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = user.getRole() != null ? user.getRole().toUpperCase() : "USER";
        
        // Normalize role: user, business, admin (admin is the super admin)
        String normalizedRole;
        if ("ADMIN".equals(role)) {
            normalizedRole = "ADMIN";
        } else if ("BUSINESS".equals(role)) {
            normalizedRole = "BUSINESS";
        } else {
            normalizedRole = "USER";
        }
        
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + normalizedRole));
    }

    @Override
    public String getPassword() {
        return null; // better-auth handles password
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public User getUser() {
        return user;
    }

    public String getId() {
        return user.getId();
    }

    public String getRole() {
        return user.getRole();
    }
}
