import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: Replace with real auth (e.g. NextAuth, Clerk)
const ADMIN_PROTECTED = ["/admin"];
const isAdminRoute = (path: string) =>
  ADMIN_PROTECTED.some((p) => path.startsWith(p));

export function middleware(request: NextRequest) {
  if (isAdminRoute(request.nextUrl.pathname)) {
    // Placeholder: allow all. Add: if (!session) return NextResponse.redirect(new URL("/login", request.url))
    return NextResponse.next();
  }
  return NextResponse.next();
}
