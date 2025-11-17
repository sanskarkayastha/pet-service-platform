"use client";

import React, { FormEvent, useActionState, useState } from "react";
import "./Login.css";
import {FormState, logUserIn, logUserInWithGoogle } from "@/actions/login";
import { useRouter } from "next/navigation";

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

  return (
    <div className="login-page">
      <div className="modal-overlay">
          <div className="login-modal">
              <h2>Login</h2>
              {state.error.cred && <p className="error-message">{state.error.cred}</p>}
              <form action={formAction}>
              <div className="input-group">
                  {state.error.email && <p className="error-message">{state.error.email}</p>}
                  <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  defaultValue={state.prevData.email}
                  />  
              </div>
              <div className="input-group">
                  {state.error.password && <p className="error-message">{state.error.password}</p>}   
                  <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  defaultValue={state.prevData.password}
                  />
              </div>

              <div className="options">
                  <label className="remember">
                  <input type="checkbox" /> Remember me
                  </label>
                  <a href="#" className="forgot">
                  Forgot Password?
                  </a>
              </div>

              <button type="submit" className="login-submit" disabled={isPending}>
                  Login
              </button>

              <button  className="login-submit" onClick={googleLogin}>
                  Login from google
              </button>

              <div className="register-link">
                  Don’t have an account? <a href="#">Register</a>
              </div>
              </form>
          </div>
      </div>
      
    </div>
  );
}
