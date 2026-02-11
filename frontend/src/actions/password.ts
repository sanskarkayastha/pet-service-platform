"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";

export type PasswordResetState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  "http://localhost:3000";

export async function requestPasswordReset(
  _prevState: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const email = formData.get("email")?.toString().trim() ?? "";

  if (!email) {
    return {
      status: "error",
      fieldErrors: {
        email: "Email is required",
      },
    };
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${appUrl}/users/reset-password`,
      },
    });

    return {
      status: "success",
      message:
        "If an account exists for that email, we sent a reset link to your inbox.",
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
      message: "Unable to send reset email. Please try again later.",
    };
  }
}

export async function resetPassword(
  _prevState: PasswordResetState,
  formData: FormData,
): Promise<PasswordResetState> {
  const token = formData.get("token")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  const fieldErrors: PasswordResetState["fieldErrors"] = {};

  if (!token) {
    return {
      status: "error",
      message: "Reset token is missing or expired.",
    };
  }

  if (password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters.";
  }

  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      fieldErrors,
    };
  }

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    });

    return {
      status: "success",
      message: "Password updated! You can now sign in with your new password.",
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
      message: "Unable to reset password. The link may have expired.",
    };
  }
}

export type ChangePasswordState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
};

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const currentPassword = formData.get("currentPassword")?.toString() ?? "";
  const newPassword = formData.get("newPassword")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  const fieldErrors: ChangePasswordState["fieldErrors"] = {};

  if (!currentPassword) {
    fieldErrors.currentPassword = "Please enter your current password.";
  }

  if (newPassword.length < 8) {
    fieldErrors.newPassword = "New password must be at least 8 characters.";
  }

  if (newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      fieldErrors,
    };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    return {
      status: "success",
      message: "Password updated successfully.",
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
      message: "Unable to update password. Please try again later.",
    };
  }
}
