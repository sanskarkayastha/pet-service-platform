"use client";

import React, { useState } from "react";
import "../login/Login.css";
import Link from "next/link";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.text();
      setMessage(result);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to register user");
    }
  };

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className="login-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="login-modal">
            <button className="close-btn" onClick={toggleModal}>
              ×
            </button>
            <h2>Sign Up</h2>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

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

              <button type="submit" className="login-submit">
                Register
              </button>

              {message && (
                <p style={{ textAlign: "center", marginTop: "10px", color: "#2d3a3b" }}>
                  {message}
                </p>
              )}

              <div className="register-link">
                Already have an account? <Link href="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
