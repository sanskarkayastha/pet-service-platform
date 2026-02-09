"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./sidebar.module.css";
import { SERVICE_CONFIG, CompanyType } from "../config";

interface SidebarProps {
  companyType: CompanyType;
}

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export default function Sidebar({ companyType }: SidebarProps) {
  const pathname = usePathname();
  const service = SERVICE_CONFIG[companyType];

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      href: `/admin/${companyType}`,
      icon: Home,
    },
    {
      label: service.title,
      href: `/admin/${companyType}/overview`, // ✅ UNIQUE
      icon: service.icon,
    },
    {
      label: "Calendar",
      href: `/admin/${companyType}/calendar`,
      icon: Calendar,
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🐾</div>
        <div>
          <h2>PetCare</h2>
          <p>{service.title}</p>
        </div>
      </div>

      {/* Menu */}
      <ul className={styles.menuItems}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.menuLink} ${
                  isActive(item.href) ? styles.active : ""
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      <div className={styles.logout}>
        <LogOut size={18} />
        <span>Log out</span>
      </div>
    </aside>
  );
}
