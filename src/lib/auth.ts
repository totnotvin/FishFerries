import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import type { Role, User } from "@/generated/prisma/client";

const SESSION_COOKIE = "picnic_session";
const secretKey = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "insecure-dev-secret"
);

export type SessionPayload = {
  userId: string;
  role: Role;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (typeof payload.userId !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return { userId: payload.userId, role: payload.role as Role };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSessionPayload();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

export const ROLE_LABELS: Record<Role, string> = {
  VISITOR: "Visitor",
  HOTEL_STAFF: "Hotel Staff",
  FERRY_STAFF: "Ferry Staff",
  PARK_STAFF: "Theme Park Staff",
  ADMIN: "Administrator",
};

export const ROLE_HOME: Record<Role, string> = {
  VISITOR: "/",
  HOTEL_STAFF: "/staff/hotel",
  FERRY_STAFF: "/staff/ferry",
  PARK_STAFF: "/staff/park",
  ADMIN: "/admin",
};
