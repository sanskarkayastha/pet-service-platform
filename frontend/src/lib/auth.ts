import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import { sendTemplatedEmail } from "./mailer";

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
        defaultValue: "USER", // Change to uppercase
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.BETTER_AUTH_URL ||
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        "http://localhost:3000";

      await sendTemplatedEmail({
        to: user.email,
        subject: "Verify your Furrever account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #1f2937;">Welcome to Furrever!</h2>
            <p style="color: #374151;">Hi ${user.name || "there"},</p>
            <p style="color: #4b5563;">Thanks for signing up. Please confirm your email address to access your account and start booking pet services.</p>
            <a href="${url}" style="display: inline-block; background: #f97316; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0;">
              Verify email
            </a>
            <p style="color: #6b7280; font-size: 14px;">If the button doesn’t work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb; font-size: 14px;">${url}</p>
            <p style="color: #9ca3af; font-size: 12px;">This link expires in 1 hour. If you didn’t create a Furrever account, you can safely ignore this email.</p>
            <p style="color: #374151;">– The Furrever Team</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">Need help? Visit <a href="${appUrl}/users/contact" style="color: #2563eb;">our help center</a>.</p>
          </div>
        `,
      });
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "change-this-secret-in-production",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  autoMigrate: true,
  plugins: [
    nextCookies(),
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "RS256",
        }
      },
      jwt: {
        // Use definePayload to add role to JWT
        definePayload: (session) => {
          return {
            role: session.user.role || "USER",
          };
        },
      },
    })
  ],
});