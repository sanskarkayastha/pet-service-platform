import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#e74c3c" }}>
        403
      </h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Access Denied
      </h2>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        You don't have permission to access this page.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link
          href="/users"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#3498db",
            color: "white",
            textDecoration: "none",
            borderRadius: "0.5rem",
          }}
        >
          Go Home
        </Link>
        <Link
          href="/users/login"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#95a5a6",
            color: "white",
            textDecoration: "none",
            borderRadius: "0.5rem",
          }}
        >
          Login
        </Link>
      </div>
    </div>
  );
}
