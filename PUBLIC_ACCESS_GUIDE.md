# Public Access Configuration

## Overview

Unauthenticated users can now browse and view content, but cannot perform actions that require authentication.

## Public Access (No Login Required)

### Frontend Routes
- `/` - Home page
- `/users/petServices/*` - Browse grooming, vet, hostel services
- `/users/login` - Login page
- `/users/register` - Registration page

### Backend Endpoints (GET - Read Only)
- `GET /api/business/allBusinesses` - Browse all businesses
- `GET /api/business/getBusinessStatus/{id}` - Check business status
- `GET /api/users/testUser/{id}` - Test endpoint
- All other `GET /api/**` endpoints are public for browsing

## Protected Access (Login Required)

### Frontend Routes
- `/admin/*` - Business admin dashboard (requires `business` role)
- `/superAdmin/*` - Super admin dashboard (requires `admin` role)
- `/users/profile/*` - User profile pages
- `/users/companyregistration` - Business registration

### Backend Endpoints (Write Operations)
- `POST /api/business/addBusiness` - Register business (requires login)
- `POST /api/services/**` - Create services (requires `business` or `admin` role)
- `PUT /api/**` - Update operations (requires authentication)
- `DELETE /api/**` - Delete operations (requires authentication)

### Backend Endpoints (Admin Only)
- `GET /api/business/getPendingBusiness` - View pending businesses (requires `admin` role)
- `PUT /api/business/{businessId}/approve` - Approve business (requires `admin` role)
- `GET /api/users/getAllUsers` - View all users (requires `admin` role)

## How It Works

### Backend Security
1. **Public GET endpoints** - Allow unauthenticated access
2. **Write operations** - Require authentication (`@PreAuthorize("isAuthenticated()")`)
3. **Admin operations** - Require `admin` role (`@PreAuthorize("hasRole('ADMIN')")`)
4. **Business operations** - Require `business` or `admin` role

### Frontend Middleware
1. **Public routes** - Allow access without session
2. **Protected routes** - Redirect to login if no session
3. **Role-based routes** - Layout components check roles

### API Utilities
- `apiGet`, `apiPost`, etc. - Automatically add JWT token if available
- If no session, requests proceed without token (for public endpoints)
- Backend handles authorization based on endpoint configuration

## Testing

### Test Public Access
```bash
# Should work without authentication
curl http://localhost:8080/api/business/allBusinesses
```

### Test Protected Access
```bash
# Should return 401/403 without token
curl -X POST http://localhost:8080/api/business/addBusiness
```

## Notes

- Users can browse services without logging in
- Users must log in to register a business or access admin features
- JWT tokens are optional for public endpoints
- Backend validates tokens when present, but allows unauthenticated access for public endpoints
