"use client";
import React, { useState } from 'react'

const Login = () => {
    const [formData, setFormData] = useState({ email: "" , password: ""});
    const [message, setMessage] = useState("");
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const request = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
        const result = await request.text();
        setMessage(result);
    }
  return (
    <>
        <div>
            <h2>Login Page</h2>
            <p>{message}</p>
            <form method='Post' onSubmit={handleSubmit}>
                <input type='email' name='email' value={formData.email} onChange={handleChange}></input>
                <input type='password' name='password' value={formData.password} onChange={handleChange}></input>
                <button type='submit'>Login</button>
            </form>
        </div>
    </>
  )
}

export default Login