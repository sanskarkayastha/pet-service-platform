import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Sidebar from "../groomingAdmin/components/Sidebar";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "PetCare Admin Dashboard",
  description: "Manage grooming appointments and services",
};

export default async function AdminLayout({
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

  // Check if user has business role
  const userRole = session.user.role?.toLowerCase();
  if (userRole !== "business") {
    redirect("/unauthorized");
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
