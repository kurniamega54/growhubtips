import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for Route Protection
 * Protects /admin/* routes from unauthenticated users
 */

const PROTECTED_ROUTES = ["/admin"];
const PUBLIC_AUTH_ROUTES = ["/admin/login", "/admin/register"];

function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some((route) => path.startsWith(route));
}

function isPublicAuthRoute(path: string): boolean {
  return PUBLIC_AUTH_ROUTES.some((route) => path === route);
}

function hasValidSession(request: NextRequest): boolean {
  const authUserId = request.cookies.get("auth_user_id")?.value;
  const authSession = request.cookies.get("auth_session")?.value;
  return !!(authUserId && authSession);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  if (isProtectedRoute(pathname)) {
    // Allow public auth routes (login, register)
    if (isPublicAuthRoute(pathname)) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    const isAuthenticated = hasValidSession(request);

    if (!isAuthenticated) {
      // Redirect to login page
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
