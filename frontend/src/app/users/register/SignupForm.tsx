"use client";

import { useActionState } from "react";
import "../login/Login.css";
import Link from "next/link";
import { registerUser, FormState } from "@/actions/register";

export default function SignupForm() {

  const initialState: FormState = {
    errors: {},
    prevData: {
      name: "",
      email: "",
      password: ""
    }
  };

  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <div className="login-page">
      <div className="modal-overlay">
        <div className="login-modal">
          <h2>Sign Up</h2>
          <p className="helper-text">
            Create your Furrever account. We&apos;ll email you a verification link
            before you can sign in.
          </p>

          {state.errors.general && (
            <p className="error-message">{state.errors.general}</p>
          )}

          <form action={formAction}>
            {/* Name */}
            <div className="input-group">
              {state.errors.name && (
                <p className="error-message">{state.errors.name}</p>
              )}
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  defaultValue={state.prevData.name ?? ""}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              {state.errors.email && (
                <p className="error-message">{state.errors.email}</p>
              )}
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  defaultValue={state.prevData.email ?? ""}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              {state.errors.password && (
                <p className="error-message">{state.errors.password}</p>
              )}
              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  defaultValue={state.prevData.password ?? ""}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={isPending}
            >
              Register
            </button>

            <div className="divider">
                    <span>Or continue with</span>
              </div>

              <button  className="google-btn">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"/>
                        <path d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" fill="#34A853"/>
                        <path d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" fill="#FBBC05"/>
                        <path d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" fill="#EA4335"/>
                    </svg>
                    <span>Continue with Google</span>
              </button>

            <div className="register-link">
              Already have an account? <Link href="/users/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
