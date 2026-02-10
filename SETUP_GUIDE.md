# Complete JWT Authentication Setup Guide

This guide will help you set up JWT authentication between your Next.js frontend (better-auth) and Spring Boot backend.

## Quick Start

### Step 1: Generate JWT Secret

Generate a secure JWT secret that will be shared between frontend and backend:

```bash
# Generate a 32-byte (256-bit) secret
openssl rand -base64 32
```

Copy this secret - you'll need it for both frontend and backend.

### Step 2: Configure Frontend (.env.local)

Add to `frontend/.env.local`:

```env
# Use the secret you generated above
JWT_SECRET=your-generated-secret-here

# Your existing better-auth secret
BETTER_AUTH_SECRET=uNNZTwFstv4Nu5InGKp2zKm3AXm6xFqI
BETTER_AUTH_URL=http://localhost:3000

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Step 3: Configure Backend (.env)

Add to `backend/demo/.env`:

```env
# Use the SAME secret as frontend
JWT_SECRET=your-generated-secret-here

# Your existing database config
DB_URL=jdbc:postgresql://ep-noisy-sea-a1y4pt6x-pooler.ap-southeast-1.aws.neon.tech/neondb
DB_USER=neondb_owner
DB_PASS=npg_swkr5jyM2SCG
```

**CRITICAL**: The `JWT_SECRET` must be **exactly the same** in both frontend and backend!

### Step 4: Restart Both Servers

1. Restart your Next.js dev server
2. Restart your Spring Boot application

## How It Works

### Authentication Flow

1. **User logs in** → better-auth creates a session
2. **Frontend requests JWT** → `authClient.token()` gets JWT from better-auth
3. **API request made** → JWT token automatically added to `Authorization: Bearer <token>` header
4. **Backend validates** → Spring Security validates token and extracts user info
5. **Role-based access** → Backend checks user role and allows/denies access

### Token Structure

Better-auth JWT tokens include:
- `sub`: User ID (used by backend to identify user)
- `exp`: Expiration time (24 hours)
- Other claims as configured

## Testing

### Test Public Endpoint (No Auth Required)

```bash
curl http://localhost:8080/api/users/testUser/123
```

### Test Authenticated Endpoint

1. Log in through your frontend
2. Open browser DevTools → Network tab
3. Make an API request (e.g., view businesses)
4. Check the `Authorization` header contains `Bearer <token>`

### Test Admin Endpoint

1. Ensure your user has `admin` or `superAdmin` role in database
2. Log in
3. Access admin endpoints (e.g., `/api/business/getPendingBusiness`)

## Troubleshooting

### "401 Unauthorized" Errors

**Check:**
1. ✅ JWT_SECRET matches in both frontend and backend
2. ✅ User is logged in (session exists)
3. ✅ Token hasn't expired (24 hours)
4. ✅ Backend is running and accessible

**Debug:**
```typescript
// In browser console
import { authClient } from '@/lib/auth-client';
const token = await authClient.token();
console.log('Token:', token);
```

### "403 Forbidden" Errors

**Check:**
1. ✅ User role in database matches required role
2. ✅ Role is lowercase (e.g., "admin", not "ADMIN")
3. ✅ `@PreAuthorize` annotation matches role name

### Token Not Being Sent

**Check:**
1. ✅ Using `apiClient` or `api-fetch` utilities (not raw fetch/axios)
2. ✅ `jwtClient()` plugin is added to `authClient`
3. ✅ User has an active session

## API Usage Examples

### Using Axios Client (Recommended for existing axios code)

```typescript
import apiClient from "@/lib/api-client";

// GET request
const response = await apiClient.get("/api/business/getPendingBusiness");
const data = response.data;

// POST request
const response = await apiClient.post("/api/business/addBusiness", formData);
```

### Using Fetch Wrappers (Recommended for new code)

```typescript
import { apiGet, apiPost } from "@/lib/api-fetch";

// GET request
const businesses = await apiGet("/api/business/allBusinesses");

// POST request
const result = await apiPost("/api/business/addBusiness", formData);
```

## Role-Based Access Control

### Available Roles

- `user` - Default role for regular users
- `business` - Business owners/service providers
- `admin` - Administrators
- `superAdmin` - Super administrators

### Backend Endpoint Protection

```java
// Admin only
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
public List<Business> getPendingBusiness() { ... }

// Business or Admin
@PreAuthorize("hasRole('BUSINESS') or hasRole('ADMIN')")
public ResponseEntity<?> createService() { ... }

// Any authenticated user
@PreAuthorize("isAuthenticated()")
public ResponseEntity<?> addBusiness() { ... }
```

### Accessing Current User

```java
@GetMapping("/profile")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<User> getProfile(@CurrentUser User currentUser) {
    return ResponseEntity.ok(currentUser);
}
```

## Files Created/Modified

### Frontend
- ✅ `frontend/src/lib/auth.ts` - Added JWT plugin
- ✅ `frontend/src/lib/auth-client.ts` - Added jwtClient plugin
- ✅ `frontend/src/lib/api-client.ts` - Axios client with token injection
- ✅ `frontend/src/lib/api-fetch.ts` - Fetch wrappers with token injection
- ✅ `frontend/src/actions/business.ts` - Updated to use authenticated API
- ✅ `frontend/src/app/superAdmin/businessRequest/page.tsx` - Updated to use authenticated API
- ✅ `frontend/src/app/users/petServices/grooming/page.tsx` - Updated to use authenticated API

### Backend
- ✅ `backend/demo/pom.xml` - Added Spring Security and JWT dependencies
- ✅ `backend/demo/src/main/java/.../security/*` - All security components
- ✅ `backend/demo/src/main/java/.../config/WebConfig.java` - Current user resolver
- ✅ `backend/demo/src/main/resources/application.properties` - JWT configuration

## Next Steps

1. ✅ Set `JWT_SECRET` in both frontend and backend
2. ✅ Restart both servers
3. ✅ Test authentication flow
4. ✅ Update remaining API calls to use authenticated utilities
5. ✅ Test role-based access control

## Additional Resources

- [Frontend JWT Setup Guide](./frontend/JWT_SETUP.md)
- [Backend RBAC Setup Guide](./backend/demo/RBAC_SETUP.md)
- [Better Auth JWT Plugin Docs](https://better-auth.com/docs/plugins/jwt)
