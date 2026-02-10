# Role Structure

## Roles

The system has three roles:

1. **`user`** - Normal users with no business
   - Default role for new users
   - Can browse services
   - Cannot access admin or business dashboards

2. **`business`** - Users who have registered a business
   - Users who have completed business registration
   - Can access `/admin/*` routes
   - Can manage their business services

3. **`admin`** - Super admin that verifies stuff
   - Super admin role (there is no separate "superAdmin" role)
   - Can access `/superAdmin/*` routes
   - Can approve/reject business registrations
   - Can manage all businesses

## Role Mapping

| Database Role | Frontend Route Access | Backend Authority | Description |
|--------------|----------------------|-------------------|-------------|
| `user` | `/users/*` | `ROLE_USER` | Normal users |
| `business` | `/admin/*` | `ROLE_BUSINESS` | Business owners |
| `admin` | `/superAdmin/*` | `ROLE_ADMIN` | Super admin |

## Important Notes

- **There is NO `superAdmin` role** - `admin` is the super admin role
- Roles are stored in lowercase in the database (`user`, `business`, `admin`)
- Spring Security converts them to uppercase with `ROLE_` prefix (`ROLE_USER`, `ROLE_BUSINESS`, `ROLE_ADMIN`)
- The frontend route `/superAdmin` is accessible only to users with `admin` role

## Setting User Roles

To set a user as admin in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

To set a user as business:
```sql
UPDATE users SET role = 'business' WHERE email = 'business@example.com';
```
