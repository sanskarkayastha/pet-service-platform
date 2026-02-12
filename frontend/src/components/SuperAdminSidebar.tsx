"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { logOut } from "@/actions/logout";
import { Briefcase, Wrench, LogOut } from "lucide-react";

const SuperAdminSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  async function logUserOut() {
    let result = await logOut();
    if (result) {
      router.refresh();
      router.replace("/");
    }
  }

  const menuItems = [
    {
      name: "Business Requests",
      badge: 12,
      path: "/superAdmin/businessRequest",
      icon: <Briefcase size={18} />,
    },
    // {
    //   name: "Service Requests",
    //   badge: 7,
    //   path: "/superAdmin/serviceRequest",
    //   icon: <Wrench size={18} />,
    // },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Furrever Admin</h2>
        <p>Super Admin Dashboard</p>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <div
              key={item.name}
              className={`menu-item ${isActive ? "active" : ""}`}
              onClick={() => router.push(item.path)}
            >
              <div className="menu-icon">{item.icon}</div>

              <span>{item.name}</span>

              {item.badge && <span className="badge">{item.badge}</span>}
            </div>
          );
        })}

        <button className="logout-btn" onClick={logUserOut}>
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
