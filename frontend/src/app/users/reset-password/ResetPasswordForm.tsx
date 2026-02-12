"use client";

import Link from "next/link";
import { useActionState } from "react";
import "../login/Login.css";
import { PasswordResetState, resetPassword } from "@/actions/password";

type ResetPasswordFormProps = {
  token?: string;
};

const initialState: PasswordResetState = {
  status: "idle",
};

export default function ResetPasswordForm({ token = "" }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(
    resetPassword,
    initialState,
  );

  const isSuccessful = state.status === "success";

  return (
    <div className="login-page">
      <div className="modal-overlay">
        <div className="login-modal">
          <h2>Create a new password</h2>
          <p className="helper-text">
            Choose a strong password with at least 8 characters. You&apos;ll use
            this to sign in next time.
          </p>

          <form action={formAction}>
            <input type="hidden" name="token" value={token} />

            <div className="input-group">
              {state.fieldErrors?.password && (
                <p className="error-message">{state.fieldErrors.password}</p>
              )}
              <div className="input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="New password"
                  required
                  minLength={8}
                  disabled={isSuccessful}
                />
              </div>
            </div>

            <div className="input-group">
              {state.fieldErrors?.confirmPassword && (
                <p className="error-message">
                  {state.fieldErrors.confirmPassword}
                </p>
              )}
              <div className="input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                  minLength={8}
                  disabled={isSuccessful}
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
              disabled={isPending || isSuccessful}
            >
              {isPending ? "Updating..." : "Update password"}
            </button>
          </form>

          <div className="register-link">
            {isSuccessful ? (
              <>
                Ready to continue?{" "}
                <Link href="/users/login" className="forgot">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Need a new link?{" "}
                <Link href="/users/forgot-password" className="forgot">
                  Request again
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
