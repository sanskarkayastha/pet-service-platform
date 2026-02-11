import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect based on role
  if (session?.user) {
    const userRole = session.user.role?.toLowerCase();
    
    // Admin (super admin) goes to superAdmin dashboard
    if (userRole === "admin") {
      redirect("/superAdmin");
    }
    
    // Business users go to admin dashboard
    if (userRole === "business") {
      redirect("/admin");
    }
  }

  // Default redirect for users without specific role or not logged in
  redirect("/users");
}
