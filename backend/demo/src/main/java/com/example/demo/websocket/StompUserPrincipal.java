package com.example.demo.websocket;

import java.security.Principal;

public class StompUserPrincipal implements Principal {

    private final String name;
    private final String role;

    public StompUserPrincipal(String name, String role) {
        this.name = name;
        this.role = role != null ? role.toUpperCase() : "USER";
    }

    @Override
    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }
}
