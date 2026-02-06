"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./ProfileTabs.module.css";

export default function ProfileTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Account Settings", path: "/users/profile" },
    { label: "Your Bookings", path: "/users/profile/bookings" },
    { label: "Booking History", path: "/users/profile/history" },
    { label: "Register Your Business", path: "/users/profile/business" },
  ];

  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <div
          key={tab.path}
          className={`${styles.tabItem} ${
            pathname === tab.path ? styles.tabActive : ""
          }`}
          onClick={() => router.push(tab.path)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
