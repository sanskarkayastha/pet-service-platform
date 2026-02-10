import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AdminSidebar from "./components/AdminSidebar";
import styles from "./layout.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/users/login");
  }

  const userRole = session.user.role?.toLowerCase();
  if (userRole !== "business") {
    redirect("/unauthorized");
  }

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
