import type { Metadata } from "next";
import Sidebar from "../groomingAdmin/components/Sidebar";
import "./layout.module.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "PetCare Admin Dashboard",
  description: "Manage grooming appointments and services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={styles.body}>
        <div className={styles.container}>
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
