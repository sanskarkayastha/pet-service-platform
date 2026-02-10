package com.example.demo.model;

public enum Role {
    USER("user"),           // Normal users with no business
    BUSINESS("business"),    // Users who have registered a business
    ADMIN("admin");         // Super admin that verifies stuff

    private final String value;

    Role(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Role fromString(String role) {
        if (role == null) {
            return USER;
        }
        for (Role r : Role.values()) {
            if (r.value.equalsIgnoreCase(role)) {
                return r;
            }
        }
        return USER; // Default role
    }
}
