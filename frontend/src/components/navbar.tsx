"use client";

import Link from "next/link";
import "../styles/Navbar.css";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";


type Session = typeof auth.$Infer.Session


export default function Navbar( {session}: {session: Session | null}) {
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
              <button onClick={()=>redirect("/users/register")}>Sign Up</button>
              <button onClick={()=>redirect("/users/login")}>Log in</button>
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
