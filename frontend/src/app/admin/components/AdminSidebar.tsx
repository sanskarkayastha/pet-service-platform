"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, Settings, Package, Clock, ShoppingBag, Calendar, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./sidebar.module.css";
import { logOut } from "@/actions/logout";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Services", href: "/admin/services", icon: Package },
  { label: "Calendar", href: "/admin/bookingCalendar", icon: Calendar },
  { label: "Working Hours", href: "/admin/working-hours", icon: Clock },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Messages", href: "/admin/messages", icon: MessageCircle },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  const handleLogout = async () => {
    const result = await logOut();
    if (result) {
      router.refresh();
      router.replace("/");
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div>
          <h2>FURREVER</h2>
          <p>Business Dashboard</p>
        </div>
      </div>

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

      <div className={styles.logout} onClick={handleLogout}>
        <LogOut size={18} />
        <span>Log out</span>
      </div>
    </aside>
  );
}
