// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { LogOut, Home, Scissors, Hotel, Stethoscope, Calendar } from 'lucide-react';
// import styles from './sidebar.module.css';

// interface MenuItem {
//   label: string;
//   href: string;
//   icon: React.ReactNode;
//   active?: boolean;
// }

// // Dummy menu data
// const menuItems: MenuItem[] = [
//   {
//     label: 'Dashboard',
//     href: '/dashboard',
//     icon: <Home size={20} />,
//   },
//   {
//     label: 'Grooming',
//     href: '/grooming',
//     icon: <Scissors size={20} />,
//     active: true,
//   },
//   {
//     label: 'Pet Hostel',
//     href: '/hostel',
//     icon: <Hotel size={20} />,
//   },
//   {
//     label: 'Vet',
//     href: '/vet',
//     icon: <Stethoscope size={20} />,
//   },
//   {
//     label: 'Calendar',
//     href: '/calendar',
//     icon: <Calendar size={20} />,
//   },
// ];

// export default function Sidebar() {
//   const [menuData] = useState<MenuItem[]>(menuItems);

//   return (
//     <aside className={styles.sidebar}>
//       {/* Logo */}
//       <div className={styles.logo}>
//         <div className={styles.logoIcon}>🐾</div>
//         <div className={styles.logoText}>
//           <h2>PetCare</h2>
//           <p>Admin Dashboard</p>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <p className={styles.menuTitle}>Menu Items</p>
//       <ul className={styles.menuItems}>
//         {menuData.map((item, index) => (
//           <li key={index}>
//             <Link
//               href={item.href}
//               className={`${styles.menuLink} ${item.active ? styles.active : ''}`}
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </Link>
//           </li>
//         ))}
//       </ul>

//       {/* Logout */}
//       <div className={styles.logout}>
//         <LogOut size={18} />
//         <span>Log out</span>
//       </div>
//     </aside>
//   );
// }
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Home,
  Scissors,
  Hotel,
  Stethoscope,
  Calendar,
} from "lucide-react";
import styles from "./sidebar.module.css";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home size={20} />,
  },
  {
    label: "Grooming",
    href: "/admin/groomingAdmin",
    icon: <Scissors size={20} />,
  },
  {
    label: "Pet Hostel",
    href: "/hostel",
    icon: <Hotel size={20} />,
  },
  {
    label: "Vet",
    href: "/vet",
    icon: <Stethoscope size={20} />,
  },
  {
    label: "Calendar",
    href: "/admin/bookingCalendar", // 👈 matches your folder
    icon: <Calendar size={20} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🐾</div>
        <div className={styles.logoText}>
          <h2>PetCare</h2>
          <p>Admin Dashboard</p>
        </div>
      </div>

      {/* Menu */}
      <p className={styles.menuTitle}>Menu Items</p>
      <ul className={styles.menuItems}>
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${styles.menuLink} ${
                isActive(item.href) ? styles.active : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className={styles.logout}>
        <LogOut size={18} />
        <span>Log out</span>
      </div>
    </aside>
  );
}
