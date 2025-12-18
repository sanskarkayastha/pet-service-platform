"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { logOut } from "@/actions/logout";

const SuperAdminSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  async function logUserOut(){
    let result = await logOut()
    if(result){
      router.refresh()
      router.replace("/")
    }
  }

  const menuItems = [
    {
      name: "Business Requests",
      badge: 12,
      path: "/superAdmin/businessRequest",
    },
    {
      name: "Service Requests",
      badge: 7,
      path: "/superAdmin/serviceRequest",
    },
    {
      name: "All Businesses",
      path: "/superAdmin/businesses",
    },
    {
      name: "Analytics",
      path: "/superAdmin/analytics",
    },
    {
      name: "Settings",
      path: "/superAdmin/settings",
    },
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
              <div className="menu-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>

              <span>{item.name}</span>

              {item.badge && <span className="badge">{item.badge}</span>}
            </div>
          );
        })}
        <button onClick={logUserOut}>Log Out</button>
      </div>

    </div>
  );
};

export default SuperAdminSidebar;
