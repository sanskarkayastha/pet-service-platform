"use client";

import Link from "next/link";
import "../styles/Navbar.css";
import { logOut } from "@/actions/logout";
import { useRouter } from "next/navigation";


export default function Navbar( {session}: {session: any}) {
  const logo = new URL("../image/furreverLogo2.png", import.meta.url).href;
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
          {/* <div className="logo-icon">
            <img src={logo} alt="FurrEver Logo" />
          </div> */}
          <span>FurrEver</span>
        </div>

        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li className="dropdown">
            <span className="dropdown-toggle ">Services ▾</span>
            <ul className="dropdown-menu">
              <li>
                <Link href="/users/petServices/grooming">Grooming</Link>
              </li>
              <li>
                <Link href="/users/petServices/vet">Vet</Link>
              </li>
              <li>
                <Link href="/users/petServices/hostel">Pet Hostel</Link>
              </li>
            </ul>
          </li>
          <li><Link href="/">About Us</Link></li>
          <li><Link href="/">Contact Us</Link></li>
          
        </ul>

        <div className="nav-icons">
           {/* Search Bar */}
          {/* <div className="search-box">
            <input type="text" placeholder="Search services..." />
          </div>
          <span>👤</span> */}
          {
            !session &&
            <>
              <Link href="/users/register"><button>Sign Up</button></Link>
              <Link href="/users/login"><button>Log In</button></Link> 
            </>
          }
          {
            session &&(
              <div className="profile-wrapper">
                <Link href="/profile" className="profile-link" title="Profile">
                <div className="profile-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                </Link>

                <button onClick={logUserOut}>Log Out</button>
              </div>
            )
            
          }
        </div>

        
      </div>
    </nav>
  );
}
