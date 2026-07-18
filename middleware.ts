import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/login",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
