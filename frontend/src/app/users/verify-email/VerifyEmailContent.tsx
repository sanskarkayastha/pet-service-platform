"use client";

import Link from "next/link";
import { useActionState } from "react";
import "../login/Login.css";
import {
  resendVerificationEmail,
  VerificationFormState,
  VerifyEmailResult,
} from "@/actions/emailVerification";

type VerifyEmailContentProps = {
  result: VerifyEmailResult;
  defaultEmail?: string;
};

const initialState: VerificationFormState = {
  status: "idle",
};

export default function VerifyEmailContent({
  result,
  defaultEmail = "",
}: VerifyEmailContentProps) {
  const [state, resendAction, isPending] = useActionState(
    resendVerificationEmail,
    initialState,
  );

  const showResendForm = result.status === "error";

  return (
    <div className="login-page">
      <div className="modal-overlay">
        <div className="login-modal">
          <h2>Email Verification</h2>

          <div
            className={
              result.status === "success"
                ? "success-message"
                : "error-message"
            }
          >
            {result.message}
          </div>

          {showResendForm ? (
            <form action={resendAction}>
              <p className="helper-text">
                Enter your email to receive a new verification link.
              </p>
              <div className="input-group">
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
                    placeholder="Email"
                    defaultValue={defaultEmail}
                    required
                  />
                </div>
              </div>

              {state.message && (
                <p
                  className={
                    state.status === "success"
                      ? "success-message"
                      : "error-message"
                  }
                >
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Send verification email"}
              </button>
            </form>
          ) : (
            <Link href="/users/login" className="login-submit">
              Go to login
            </Link>
          )}

          <div className="register-link">
            Need help?{" "}
            <Link href="/users/contact" className="forgot">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
