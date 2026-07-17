import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "picnic_session";
const secretKey = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "insecure-dev-secret"
);

const ROLE_HOME: Record<string, string> = {
  VISITOR: "/",
  HOTEL_STAFF: "/staff/hotel",
  FERRY_STAFF: "/staff/ferry",
  PARK_STAFF: "/staff/park",
  ADMIN: "/admin",
};

async function readSession(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

function isAuthorized(path: string, role: string) {
  if (path.startsWith("/staff/hotel")) return role === "HOTEL_STAFF" || role === "ADMIN";
  if (path.startsWith("/staff/ferry")) return role === "FERRY_STAFF" || role === "ADMIN";
  if (path.startsWith("/staff/park")) return role === "PARK_STAFF" || role === "ADMIN";
  if (path.startsWith("/admin")) return role === "ADMIN";
  return true;
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const authRoutes = ["/login", "/register"];
  const protectedPrefixes = ["/staff", "/admin", "/bookings"];

  const isProtected = protectedPrefixes.some((p) => path.startsWith(p));
  const isAuthRoute = authRoutes.includes(path);

  const session = await readSession(req);

  if (isProtected && !session) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isProtected && session && !isAuthorized(path, session.role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role] ?? "/", req.nextUrl));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role] ?? "/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|svg|ico)$).*)"],
};
