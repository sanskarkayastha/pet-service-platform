import { notFound } from "next/navigation";
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
