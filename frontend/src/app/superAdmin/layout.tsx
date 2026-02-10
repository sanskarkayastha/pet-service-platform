import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SuperAdminSidebar from "../../components/SuperAdminSidebar";
import "../../styles/superadminDash.css";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session and role
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If not logged in, redirect to login
  if (!session) {
    redirect("/users/login");
  }

  // Check if user has admin role (admin is the super admin)
  const userRole = session.user.role?.toLowerCase();
  if (userRole !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <>
      <SuperAdminSidebar />
      {children}
    </>
  );
}
