"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";

export type VerificationFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const defaultState: VerificationFormState = {
  status: "idle",
};

export async function resendVerificationEmail(
  _prevState: VerificationFormState = defaultState,
  formData: FormData,
): Promise<VerificationFormState> {
  const email = formData.get("email")?.toString().trim() ?? "";

  if (!email) {
    return {
      status: "error",
      message: "Please provide the email you used to register.",
    };
  }

  try {
    const callbackURL =
      process.env.NEXT_PUBLIC_APP_URL?.concat("/users/login") ??
      "/users/login";

    await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL,
      },
    });

    return {
      status: "success",
      message: "Verification email sent. Please check your inbox.",
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        status: "error",
        message: error.message,
      };
    }

    return {
      status: "error",
      message: "Unable to send verification email. Please try again later.",
    };
  }
}

export type VerifyEmailResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function verifyEmailToken(
  token?: string,
  callbackURL?: string,
): Promise<VerifyEmailResult> {
  if (!token) {
    return {
      status: "error",
      message: "Verification token is missing or invalid.",
    };
  }

  try {
    const query = {
      token,
      callbackURL:
        callbackURL ??
        process.env.NEXT_PUBLIC_APP_URL?.concat("/users/login") ??
        "/users/login",
    };

    await auth.api.verifyEmail({
      query,
      headers: await headers(),
    });

    return {
      status: "success",
      message: "Email verified! You can sign in to your account now.",
    };
  } catch (error) {
    if (error instanceof APIError) {
      return {
        status: "error",
        message: error.message,
      };
    }

    return {
      status: "error",
      message: "Verification failed. The link may have expired.",
    };
  }
}
