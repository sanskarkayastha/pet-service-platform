import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  user: {
    modelName: "users",
    fields: {
      id: "id",
      name: "name",
      email: "email",
      password: "password",
    },
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "change-this-secret-in-production",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  autoMigrate: true,
  plugins: [
    nextCookies(),
    jwt({
      secret: process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || "change-this-jwt-secret-in-production-min-256-bits",
      expiresIn: 60 * 60 * 24, // 24 hours
      // Use symmetric key (HS256) - doesn't require JWKS table
      algorithm: "HS256",
    }),
  ],
});
