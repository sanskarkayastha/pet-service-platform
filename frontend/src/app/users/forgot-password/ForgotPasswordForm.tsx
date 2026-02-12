"use client";

import Link from "next/link";
import { useActionState } from "react";
import "../login/Login.css";
import {
  PasswordResetState,
  requestPasswordReset,
} from "@/actions/password";

const initialState: PasswordResetState = {
  status: "idle",
};

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <div className="login-page">
      <div className="modal-overlay">
        <div className="login-modal">
          <h2>Reset your password</h2>
          <p className="helper-text">
            Enter the email associated with your account and we&apos;ll send you
            a link to reset your password.
          </p>

          <form action={formAction}>
            <div className="input-group">
              {state.fieldErrors?.email && (
                <p className="error-message">{state.fieldErrors.email}</p>
              )}
              <div className="input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                />
              </div>
            </div>

            {state.message && (
              <p
                className={
                  state.status === "success" ? "success-message" : "error-message"
                }
              >
                {state.message}
              </p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={isPending || state.status === "success"}
            >
              {isPending ? "Sending link..." : "Send reset link"}
            </button>
          </form>

          <div className="register-link">
            Remembered your password?{" "}
            <Link href="/users/login" className="forgot">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
