import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "PetCare Admin Dashboard",
  description: "Manage grooming appointments and services",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
