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
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: "", 
      clientSecret: "", 
    },
  },  
  autoMigrate: true, 
  plugins: [nextCookies()],
  
});
