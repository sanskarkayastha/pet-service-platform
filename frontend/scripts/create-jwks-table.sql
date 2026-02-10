-- Manual SQL migration to create jwks table for better-auth JWT plugin
-- Run this if the automatic migration doesn't work

CREATE TABLE IF NOT EXISTS "jwks" (
    "id" TEXT PRIMARY KEY,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "jwks_createdAt_idx" ON "jwks" ("createdAt");
