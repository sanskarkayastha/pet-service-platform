import ProfileTabs from "@/components/ProfileTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "30px 40px", background: "#f5f7fa", minHeight: "100vh" }}>
      <ProfileTabs />
      {children}
    </div>
  );
}
