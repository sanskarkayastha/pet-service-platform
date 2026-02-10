# Quick Fix for "relation jwks does not exist" Error

## Immediate Fix

Run this command in your terminal:

```bash
cd frontend
npx @better-auth/cli migrate
```

When prompted, type `y` and press Enter.

Then restart your Next.js dev server.

## What This Does

This creates the `jwks` table that the better-auth JWT plugin requires. The table stores JSON Web Key Sets used for JWT token management.

## Alternative: Manual SQL

If the migration command doesn't work, connect to your database and run:

```sql
CREATE TABLE IF NOT EXISTS "jwks" (
    "id" TEXT PRIMARY KEY,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Why This Happened

The JWT plugin was added to better-auth, but the required database table wasn't created yet. The `autoMigrate: true` setting should handle this, but sometimes you need to run the migration manually the first time.

## After Fixing

- ✅ Sessions will continue to work as before
- ✅ JWT tokens will now be available for API calls
- ✅ All existing `auth.api.getSession()` calls will work normally
- ✅ New JWT-based API authentication will work
