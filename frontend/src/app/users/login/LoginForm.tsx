"use client";

import React, { useActionState, useState } from "react";
import "./Login.css";
import Link from "next/link";
import {FormState, logUserIn } from "@/app/actions/login";

export default function LoginForm() {

  const initialState: FormState = {
    error: {},
    prevData: {
      email: "",
      password: ""
    }
  }

 const [state, formAction, isPending] =  useActionState(logUserIn, initialState)

  const [showModal, setShowModal] = useState(true);
  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className="login-page">
      

        {/* Modal Overlay */}
        {showModal && (
            <div className="modal-overlay">
            <div className="login-modal">
                <button className="close-btn" onClick={toggleModal}>
                ×
                </button>
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
                    required
                    />  
                </div>
                <div className="input-group">
                    {state.error.password && <p className="error-message">{state.error.password}</p>}   
                    <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    defaultValue={state.prevData.password}
                    required
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

                <div className="register-link">
                    Don’t have an account? <a href="#">Register</a>
                </div>
                </form>
            </div>
            </div>
        )}
    </div>
  );
}
