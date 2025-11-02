alter table "session" add column "userId" text not null references "users" ("id") on delete cascade;

alter table "account" add column "accountId" text not null;

alter table "account" add column "providerId" text not null;

alter table "account" add column "userId" text not null references "users" ("id") on delete cascade;

alter table "account" add column "accessToken" text;

alter table "account" add column "refreshToken" text;

alter table "account" add column "idToken" text;

alter table "account" add column "accessTokenExpiresAt" timestamptz;

alter table "account" add column "refreshTokenExpiresAt" timestamptz;

alter table "account" add column "createdAt" timestamptz default CURRENT_TIMESTAMP not null;

alter table "account" add column "updatedAt" timestamptz not null;

create table "verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" timestamptz not null, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);