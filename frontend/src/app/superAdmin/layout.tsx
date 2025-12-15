"use client";

import React from "react";
import SuperAdminSidebar from "../../components/SuperAdminSidebar";
import "../../styles/superadminDash.css";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SuperAdminSidebar />
      {children}
    </>
  );
}
