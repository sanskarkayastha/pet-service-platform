"use client";

import Link from "next/link";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <div className="logo-icon">🌍</div>
          FurrEver
        </div>

        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#shop">Pet Shop</a></li>
          <li><a href="#contact">Contact Us</a></li>
          <li><a href="#cart">Cart</a></li>
        </ul>

        <div className="nav-icons">
          <span>🔍</span>
          <span>👤</span>
          <Link href="/users/register">
            <button>Sign Up</button>
          </Link>
          <Link href="/users/login">
            <button>Log in</button>
          </Link>
        </div>

        <div className="hamburger" id="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
