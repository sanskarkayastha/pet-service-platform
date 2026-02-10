# Role-Based Access Control (RBAC) Setup Guide

This guide explains how to set up and use Role-Based Access Control (RBAC) in your Spring Boot backend that integrates with better-auth.

## Overview

The RBAC system has been implemented with the following components:

- **Role Enum**: Defines user roles (USER, BUSINESS, ADMIN, SUPER_ADMIN)
- **JWT Authentication Filter**: Validates tokens from better-auth
- **Security Configuration**: Configures Spring Security with role-based access
- **Role-based Annotations**: `@PreAuthorize` for method-level security

## Configuration

### 1. JWT Secret Configuration

You need to configure the JWT secret to match your better-auth configuration. Add this to your `.env` file or environment variables:

```properties
JWT_SECRET=your-better-auth-jwt-secret-key-here
```

**Important**: The JWT secret must match the secret used by better-auth to sign tokens. This is typically configured in your better-auth setup.

### 2. Application Properties

The following properties are already configured in `application.properties`:

```properties
jwt.secret=${JWT_SECRET:your-secret-key-change-this-in-production-min-256-bits-required-for-security}
jwt.expiration=86400000
```

## Roles

The system supports the following roles:

- **USER**: Regular users (default role)
- **BUSINESS**: Business owners/service providers
- **ADMIN**: Administrators with elevated permissions
- **SUPER_ADMIN**: Super administrators with full access

## Usage

### 1. Securing Endpoints

Use `@PreAuthorize` annotation to secure controller methods:

```java
@GetMapping("/admin-only")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> adminOnlyEndpoint() {
    // Only ADMIN and SUPER_ADMIN can access
    return ResponseEntity.ok("Admin access");
}

@GetMapping("/business-or-admin")
@PreAuthorize("hasRole('BUSINESS') or hasRole('ADMIN')")
public ResponseEntity<?> businessOrAdminEndpoint() {
    // BUSINESS, ADMIN, and SUPER_ADMIN can access
    return ResponseEntity.ok("Business or Admin access");
}

@PostMapping("/authenticated")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<?> authenticatedEndpoint(@CurrentUser User currentUser) {
    // Any authenticated user can access
    return ResponseEntity.ok("Authenticated access");
}
```

### 2. Accessing Current User

Use the `@CurrentUser` annotation to inject the current authenticated user:

```java
@GetMapping("/profile")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<User> getProfile(@CurrentUser User currentUser) {
    return ResponseEntity.ok(currentUser);
}
```

### 3. Role Checking in Code

Use `RoleUtils` for programmatic role checking:

```java
import com.example.demo.security.RoleUtils;

if (RoleUtils.hasRole("ADMIN")) {
    // Admin-specific logic
}

UserPrincipal currentUser = RoleUtils.getCurrentUser();
if (currentUser != null) {
    String userId = currentUser.getId();
    String role = currentUser.getRole();
}
```

## Security Configuration

The security configuration (`SecurityConfig.java`) defines:

- **Public endpoints**: `/api/users/testUser/**`, `/error`
- **Admin endpoints**: `/api/business/getPendingBusiness`, `/api/business/{businessId}/approve`
- **Super Admin endpoints**: `/api/**/superAdmin/**`
- **Authenticated endpoints**: All other `/api/**` endpoints require authentication

## Frontend Integration

### Sending JWT Token

Your frontend (better-auth) should send the JWT token in the Authorization header:

```typescript
// Example: Using fetch
const response = await fetch('http://localhost:8080/api/business/allBusinesses', {
  headers: {
    'Authorization': `Bearer ${session.token}`, // or however better-auth provides the token
    'Content-Type': 'application/json'
  }
});
```

### Getting Token from better-auth

Better-auth typically stores tokens in cookies or session. You'll need to extract the token and include it in API requests. Check your better-auth configuration for how tokens are stored and accessed.

## Testing

### Test Endpoints

1. **Public Endpoint** (no auth required):
   ```
   GET /api/users/testUser/{id}
   ```

2. **Authenticated Endpoint** (any logged-in user):
   ```
   GET /api/business/allBusinesses
   ```

3. **Admin Endpoint** (ADMIN or SUPER_ADMIN):
   ```
   GET /api/business/getPendingBusiness
   ```

4. **Super Admin Endpoint** (SUPER_ADMIN only):
   ```
   GET /api/**/superAdmin/**
   ```

## Troubleshooting

### Token Validation Fails

1. Ensure `JWT_SECRET` matches your better-auth secret
2. Check that tokens are being sent in the `Authorization: Bearer <token>` header
3. Verify token hasn't expired

### Access Denied (403)

1. Check user role in database matches expected role
2. Verify role format matches (case-insensitive, but stored as lowercase in DB)
3. Ensure `@PreAuthorize` annotation is correctly configured

### CORS Issues

CORS is configured to allow `http://localhost:3000`. Update `SecurityConfig.java` if your frontend runs on a different port/domain.

## Notes

- Roles are stored as strings in the database (e.g., "user", "business", "admin", "superAdmin")
- Spring Security automatically prefixes roles with "ROLE_" internally
- The JWT filter validates tokens on every request
- Unauthenticated requests to protected endpoints will return 401 Unauthorized
- Authenticated users without required roles will return 403 Forbidden
