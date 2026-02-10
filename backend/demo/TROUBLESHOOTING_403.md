# Troubleshooting 403 Forbidden Errors

## Problem

Getting 403 Forbidden when accessing protected endpoints like `/api/business/getPendingBusiness`.

## Debug Steps

### 1. Check Debug Endpoint

First, check if authentication is working at all:

```bash
curl http://localhost:8080/api/debug/auth-info \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Or in browser console (after logging in):
```javascript
const token = await authClient.token();
fetch('http://localhost:8080/api/debug/auth-info', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

This will show:
- If user is authenticated
- What authorities/roles are assigned
- What role is in the database

### 2. Check JWT Secret Match

**CRITICAL**: The `JWT_SECRET` must match exactly in both frontend and backend.

**Frontend** (`frontend/.env.local`):
```env
JWT_SECRET=your-secret-here
```

**Backend** (`backend/demo/.env`):
```env
JWT_SECRET=your-secret-here  # MUST BE THE SAME!
```

### 3. Check User Role in Database

The role in your database must match what Spring Security expects:

| Database Role | Description | Spring Security Expects | Authority Created |
|--------------|------------|------------------------|-------------------|
| `user` | Normal users with no business | `ROLE_USER` | ✅ `ROLE_USER` |
| `business` | Users who have registered a business | `ROLE_BUSINESS` | ✅ `ROLE_BUSINESS` |
| `admin` | Super admin that verifies stuff | `ROLE_ADMIN` | ✅ `ROLE_ADMIN` |

Check your database:
```sql
SELECT id, email, role FROM users WHERE email = 'your-email@example.com';
```

### 4. Check Backend Logs

Enable debug logging in `application.properties`:
```properties
logging.level.com.example.demo.security=DEBUG
```

Look for:
- "Extracted user ID from token: ..."
- "User found: ... Role: ..."
- "User authorities: ..."

### 5. Verify Token is Being Sent

Check browser Network tab:
1. Open DevTools → Network
2. Make API request
3. Check Request Headers
4. Should see: `Authorization: Bearer <token>`

### 6. Common Issues

#### Issue: Token not being sent
**Solution**: Check `api-client.ts` - ensure `authClient.token()` is working

#### Issue: User not found in database
**Solution**: Ensure user exists with the ID from JWT token's `sub` claim

#### Issue: Role mismatch
**Solution**: Update user role in database to match expected format:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

#### Issue: JWT secret mismatch
**Solution**: Ensure `JWT_SECRET` is identical in both `.env` files

## Expected Behavior

For `/api/business/getPendingBusiness`:
- Requires: `ROLE_ADMIN`
- Database role should be: `admin` (admin is the super admin role)
- User must exist in database
- JWT token must be valid

## Quick Fix Checklist

- [ ] `JWT_SECRET` matches in frontend and backend `.env` files
- [ ] User exists in database
- [ ] User role is `admin` (lowercase in DB - admin is the super admin role)
- [ ] JWT token is being sent in Authorization header
- [ ] Backend server is running and accessible
- [ ] Check debug endpoint output
