"use client";

import React, { useState } from "react";
import "./Login.css"; // Import the separate CSS file
import Link from "next/link";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logging in with ${formData.email}`);
    // TODO: connect to backend API
  };

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
                <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="input-group">
                    <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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

                <button type="submit" className="login-submit">
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
