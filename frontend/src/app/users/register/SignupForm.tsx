"use client";

import { useActionState } from "react";
import "../login/Login.css";
import Link from "next/link";
import { registerUser, FormState } from "@/actions/register";

export default function SignupForm() {

  const initialState:FormState = {
    errors:{},
    prevData: {
      name: "",
      email: "", 
      password: ""
    }
  }
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <div className="login-page">
        <div className="modal-overlay">
          <div className="login-modal">
            <h2>Sign Up</h2>
            {state.errors.general && <p className="error-message">{state.errors.general}</p>}
            <form action={formAction}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  defaultValue={state.prevData.name ?? ""}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  defaultValue={state.prevData.email ?? ""}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  defaultValue={state.prevData.password ?? ""}
                  required
                />
              </div>

              <button type="submit" className="login-submit" disabled={isPending}>
                Register
              </button>

              <div className="register-link">
                Already have an account? <Link href="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}
