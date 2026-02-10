import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Sidebar from "./components/sidebar";
import styles from "./layout.module.css";
import { CompanyType, SERVICE_CONFIG } from "./config";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companyType: CompanyType }>;
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

  // ✅ unwrap params
  const { companyType } = await params;

  const service = SERVICE_CONFIG[companyType];

  if (!service) return notFound();

  return (
    <div className={styles.container}>
      <Sidebar companyType={companyType} />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
