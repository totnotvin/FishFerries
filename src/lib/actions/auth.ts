"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, ROLE_HOME } from "@/lib/auth";
import type { Role } from "@/generated/prisma/client";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type FormState = { error?: string } | undefined;

export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "VISITOR" },
  });

  await createSession({ userId: user.id, role: user.role });
  redirect(ROLE_HOME[user.role]);
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  await createSession({ userId: user.id, role: user.role });
  redirect(ROLE_HOME[user.role]);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function quickLoginAction(formData: FormData) {
  // Used only by the demo "quick login" buttons on the login page.
  const role = formData.get("role") as Role | null;
  if (!role) return;
  const user = await prisma.user.findFirst({ where: { role } });
  if (!user) return;
  await createSession({ userId: user.id, role: user.role });
  redirect(ROLE_HOME[user.role]);
}
