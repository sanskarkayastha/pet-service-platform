import Navbar from "@/components/navbar";
import VerifyEmailReminder from "@/components/VerifyEmailReminder";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isUnverified = session?.user && !session.user.emailVerified;

  return (
    <>
      <Navbar session={session} />
      {isUnverified && session?.user?.email ? (
        <VerifyEmailReminder email={session.user.email} />
      ) : null}
      {children}
    </>
  );
}
