# Fix for "relation jwks does not exist" Error

## Problem

The better-auth JWT plugin requires a `jwks` table in your database. This table needs to be created via migration.

## Solution

### Option 1: Run Automatic Migration (Recommended)

Run this command in your `frontend` directory:

```bash
cd frontend
npx @better-auth/cli migrate
```

When prompted, type `y` to confirm the migration.

### Option 2: Manual SQL Migration

If the automatic migration doesn't work, you can run the SQL manually:

1. Connect to your PostgreSQL database
2. Run the SQL from `scripts/create-jwks-table.sql`:

```sql
CREATE TABLE IF NOT EXISTS "jwks" (
    "id" TEXT PRIMARY KEY,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "jwks_createdAt_idx" ON "jwks" ("createdAt");
```

### Option 3: Use npm script

You can also use the npm script:

```bash
cd frontend
npm run auth:migrate
```

## After Migration

1. Restart your Next.js dev server
2. The error should be resolved
3. JWT tokens will work correctly with your Spring Boot backend

## Why This Happens

The better-auth JWT plugin creates a `jwks` (JSON Web Key Set) table to store encryption keys. Even though we're using symmetric keys (HS256), the plugin still requires this table for key management and rotation.

## Verification

After running the migration, you can verify the table exists:

```sql
SELECT * FROM jwks;
```

The table should exist (it may be empty initially, which is fine).
