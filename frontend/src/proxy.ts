import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession(
      {
        headers: await headers()
      }
    )

  const pathname = request.nextUrl.pathname;
  console.log("Proxy Middleware Session:", session);

  // If user is NOT logged in
  if (!session) {
    return NextResponse.redirect(new URL("/users/login", request.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (session.user.role !== "business") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
