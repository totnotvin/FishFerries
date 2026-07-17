"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { Role } from "@/generated/prisma/client";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

const VALID_ROLES: Role[] = ["VISITOR", "HOTEL_STAFF", "FERRY_STAFF", "PARK_STAFF", "ADMIN"];

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as Role;
  if (!userId || !VALID_ROLES.includes(role)) return;
  if (userId === admin.id && role !== "ADMIN") return; // don't let the admin demote themselves by accident

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin");
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = formData.get("userId") as string;
  if (!userId || userId === admin.id) return;
  await prisma.user.delete({ where: { id: userId } }).catch(() => null);
  revalidatePath("/admin");
}

const promotionSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  imageEmoji: z.string().min(1).max(4),
  scope: z.enum(["HOTEL", "PARK", "GENERAL"]),
});

export async function createPromotionAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = promotionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageEmoji: formData.get("imageEmoji") || "🎉",
    scope: formData.get("scope") || "GENERAL",
  });
  if (!parsed.success) return;

  await prisma.promotion.create({ data: { ...parsed.data, createdById: admin.id } });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deletePromotionAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("promotionId") as string;
  if (!id) return;
  await prisma.promotion.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin");
  revalidatePath("/");
}

const locationSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  category: z.string().min(2),
  x: z.coerce.number().min(0).max(100),
  y: z.coerce.number().min(0).max(100),
});

export async function createMapLocationAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = locationSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    x: formData.get("x"),
    y: formData.get("y"),
  });
  if (!parsed.success) return;

  await prisma.mapLocation.create({ data: { ...parsed.data, createdById: admin.id } });
  revalidatePath("/admin");
  revalidatePath("/map");
}

export async function deleteMapLocationAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("locationId") as string;
  if (!id) return;
  await prisma.mapLocation.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin");
  revalidatePath("/map");
}
