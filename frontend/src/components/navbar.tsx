"use client";

import Link from "next/link";
import "../styles/Navbar.css";
import { logOut } from "@/actions/logout";
import { useRouter } from "next/navigation";

export default function Navbar( {session}: {session: any}) {

  const router = useRouter()

  async function logUserOut(){
    let result = await logOut()
    if(result){
      router.refresh()
      router.replace("/")
    }
  }

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
          {
            session &&
            <button onClick={logUserOut}>Log Out</button>
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
