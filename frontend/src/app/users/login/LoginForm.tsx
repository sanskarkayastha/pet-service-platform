"use client";

import React, { FormEvent, useActionState } from "react";
import "./Login.css";
import {FormState, logUserIn, logUserInWithGoogle } from "@/actions/login";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  resendVerificationEmail,
  VerificationFormState,
} from "@/actions/emailVerification";

export default function LoginForm() {

  const router = useRouter()

  async function googleLogin(e:FormEvent){
    e.preventDefault()
    await logUserInWithGoogle()
    router.refresh()
  }

  const initialState: FormState = {
    error: {},
    prevData: {
      email: "",
      password: ""
    }
  }

 const [state, formAction, isPending] =  useActionState(logUserIn, initialState)
 const [resendState, resendAction, resendPending] = useActionState(
  resendVerificationEmail,
  {
    status: "idle",
  } as VerificationFormState,
);

  return (
    <div className="login-page">
      <div className="modal-overlay">
          <div className="login-modal">
              <h2>Login</h2>
              {state.error.cred && <p className="error-message">{state.error.cred}</p>}
              <form action={formAction}>
              <div className="input-group">
                {state.error.email && <p className="error-message">{state.error.email}</p>}
                <div className="input-wrapper"> 
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    defaultValue={state.prevData.email}
                  />
                </div>      
              </div>
              <div className="input-group">
                  {state.error.password && <p className="error-message">{state.error.password}</p>}   
                  <div className="input-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      defaultValue={state.prevData.password}
                    />
                  </div>
                  
              </div>

              <div className="options">
                  <label className="remember">
                  <input type="checkbox" /> Remember me
                  </label>
                  <Link href="/users/forgot-password" className="forgot">
                  Forgot Password?
                  </Link>
              </div>

              <button type="submit" className="login-submit" disabled={isPending}>
                  Login
              </button>

              <div className="divider">
                    <span>Or continue with</span>
              </div>

              <button type="button" className="google-btn" onClick={googleLogin}>
                  <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" fill="#4285F4"/>
                        <path d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" fill="#34A853"/>
                        <path d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" fill="#FBBC05"/>
                        <path d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" fill="#EA4335"/>
                    </svg>
                    <span>Continue with Google</span>
              </button>

              <div className="register-link">
                  Don’t have an account? <Link href="/users/register">Register</Link>
              </div>
              </form>

              {state.error.verification && (
                <div className="resend-wrapper">
                  <p className="error-message">{state.error.verification}</p>
                  <form action={resendAction} className="resend-form">
                    <input type="hidden" name="email" value={state.prevData.email} />
                    <button
                      type="submit"
                      className="resend-button"
                      disabled={resendPending}
                    >
                      {resendPending ? "Resending..." : "Resend verification email"}
                    </button>
                  </form>
                  {resendState.message && (
                    <p
                      className={
                        resendState.status === "success"
                          ? "success-message"
                          : "error-message"
                      }
                    >
                      {resendState.message}
                    </p>
                  )}
                </div>
              )}
          </div>
      </div>
      
    </div>
  );
}
