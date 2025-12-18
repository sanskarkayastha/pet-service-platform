import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
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
  autoMigrate: true, 
  plugins: [nextCookies()],
  
});
