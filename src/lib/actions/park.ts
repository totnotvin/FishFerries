"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export type FormState = { error?: string } | undefined;

const bookEventSchema = z.object({
  eventId: z.string().min(1),
  ticketCount: z.coerce.number().int().min(1).max(20),
});

export async function bookParkEventAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be logged in to book." };

  const parsed = bookEventSchema.safeParse({
    eventId: formData.get("eventId"),
    ticketCount: formData.get("ticketCount"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid booking" };
  }

  const event = await prisma.parkEvent.findUnique({ where: { id: parsed.data.eventId } });
  if (!event) return { error: "Event not found" };

  const existing = await prisma.parkBooking.aggregate({
    where: { eventId: event.id, status: { not: "CANCELLED" } },
    _sum: { ticketCount: true },
  });
  const taken = existing._sum.ticketCount ?? 0;
  if (taken + parsed.data.ticketCount > event.capacity) {
    return { error: "Not enough capacity left for this event" };
  }

  const booking = await prisma.parkBooking.create({
    data: {
      userId: user.id,
      eventId: event.id,
      ticketCount: parsed.data.ticketCount,
      status: "CONFIRMED",
    },
  });

  revalidatePath("/bookings");
  redirect(`/bookings/confirmation?type=park&id=${booking.id}`);
}

export async function cancelParkBookingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const id = formData.get("bookingId") as string;
  const booking = await prisma.parkBooking.findUnique({ where: { id } });
  if (!booking) return;

  const isOwner = booking.userId === user.id;
  const isStaff = user.role === "PARK_STAFF" || user.role === "ADMIN";
  if (!isOwner && !isStaff) return;

  await prisma.parkBooking.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/bookings");
  revalidatePath("/staff/park");
}

// --- Park staff actions ---

async function requireParkStaff() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "PARK_STAFF" && user.role !== "ADMIN")) {
    throw new Error("Forbidden");
  }
  return user;
}

const eventSchema = z.object({
  type: z.enum(["RIDE", "SHOW", "BEACH_EVENT"]),
  name: z.string().min(2),
  description: z.string().min(2),
  date: z.string().min(1),
  time: z.string().min(1),
  capacity: z.coerce.number().int().min(1).max(5000),
  price: z.coerce.number().min(0),
});

export async function createParkEventAction(formData: FormData) {
  await requireParkStaff();
  const parsed = eventSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    date: formData.get("date"),
    time: formData.get("time"),
    capacity: formData.get("capacity"),
    price: formData.get("price"),
  });
  if (!parsed.success) return;

  await prisma.parkEvent.create({
    data: { ...parsed.data, date: new Date(parsed.data.date) },
  });
  revalidatePath("/staff/park");
  revalidatePath("/park");
}

export async function updateParkEventAction(formData: FormData) {
  await requireParkStaff();
  const id = formData.get("eventId") as string;
  const parsed = eventSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    date: formData.get("date"),
    time: formData.get("time"),
    capacity: formData.get("capacity"),
    price: formData.get("price"),
  });
  if (!parsed.success || !id) return;

  await prisma.parkEvent.update({
    where: { id },
    data: { ...parsed.data, date: new Date(parsed.data.date) },
  });
  revalidatePath("/staff/park");
  revalidatePath("/park");
}

export async function deleteParkEventAction(formData: FormData) {
  await requireParkStaff();
  const id = formData.get("eventId") as string;
  if (!id) return;
  await prisma.parkEvent.delete({ where: { id } }).catch(() => null);
  revalidatePath("/staff/park");
  revalidatePath("/park");
}

const promotionSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  imageEmoji: z.string().min(1).max(4),
});

export async function createParkPromotionAction(formData: FormData) {
  const user = await requireParkStaff();
  const parsed = promotionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageEmoji: formData.get("imageEmoji") || "🎢",
  });
  if (!parsed.success) return;

  await prisma.promotion.create({
    data: { ...parsed.data, scope: "PARK", createdById: user.id },
  });
  revalidatePath("/staff/park");
  revalidatePath("/");
}

export async function togglePromotionActiveAction(formData: FormData) {
  await requireParkStaff();
  const id = formData.get("promotionId") as string;
  const promo = await prisma.promotion.findUnique({ where: { id } });
  if (!promo) return;
  await prisma.promotion.update({ where: { id }, data: { active: !promo.active } });
  revalidatePath("/staff/park");
  revalidatePath("/");
}

export async function validateOnSiteTicketAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireParkStaff();
  const id = (formData.get("bookingId") as string)?.trim();
  if (!id) return { error: "Enter a booking ID" };
  const booking = await prisma.parkBooking.findUnique({ where: { id } });
  if (!booking) return { error: "Booking not found" };
  if (booking.status === "CANCELLED") return { error: "This booking has been cancelled" };
  return { error: undefined };
}
