"use client";

import Link from "next/link";
import "../styles/Navbar.css";


export default function Navbar( {session}: {session: any}) {
  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <div className="logo-icon">🌍</div>
          FurrEver
        </div>

        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/">Services</Link></li>
          <li><Link href="/">Pet Shop</Link></li>
          <li><Link href="/">Contact Us</Link></li>
          <li><Link href="/">Cart</Link></li>
        </ul>

        <div className="nav-icons">
          <span>🔍</span>
          <span>👤</span>
          {
            !session &&
            <>
              <Link href="/users/register"><button>Sign Up</button></Link>
              <Link href="/users/login"><button>Log In</button></Link> 
            </>
          }
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
