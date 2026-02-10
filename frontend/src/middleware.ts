import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for route protection
 * 
 * Note: We check for session cookie existence here, but actual role validation
 * happens in layout components (which run in Node.js runtime and can use better-auth).
 * 
 * This approach avoids Edge Runtime limitations while still providing basic authentication checks.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check for better-auth session cookie
  // better-auth uses "better-auth.session_token" by default
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // If no session cookie, allow browsing but block protected routes
  if (!sessionCookie) {
    // Allow access to public routes (browsing, login, register)
    const isPublicRoute =
      pathname.startsWith("/users/login") ||
      pathname.startsWith("/users/register") ||
      pathname.startsWith("/users/petServices") || // Allow browsing services
      pathname.startsWith("/api/auth") ||
      pathname === "/" ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon");

    if (isPublicRoute) {
      return NextResponse.next();
    }
    
    // Block access to protected routes (admin, superAdmin, profile)
    const isProtectedRoute =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/superAdmin") ||
      pathname.startsWith("/users/profile") ||
      pathname.startsWith("/users/companyregistration");

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/users/login", request.url));
    }
    
    // Allow all other routes (browsing)
    return NextResponse.next();
  }

  // For protected routes, let the layout components handle role-based access
  // They run in Node.js runtime and can properly use better-auth's getSession
  // This middleware just ensures user is authenticated (has session cookie)

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
