import Navbar from "@/components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth.api.getSession(
    {
      headers: await headers(),
    }
  )
  console.log("User Layout Session:", session);
  return (
    <>
      < Navbar session = { session }/>
      {children}
    </>
  );
}