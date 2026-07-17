"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function nightsBetween(checkIn: Date, checkOut: Date) {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

async function roomsBookedForRange(roomId: string, checkIn: Date, checkOut: Date) {
  const overlapping = await prisma.hotelBooking.findMany({
    where: {
      roomId,
      status: { not: "CANCELLED" },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
  });
  return overlapping.length;
}

const bookHotelSchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.coerce.number().int().min(1).max(20),
});

export type FormState = { error?: string } | undefined;

export async function bookHotelAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be logged in to book a hotel." };

  const parsed = bookHotelSchema.safeParse({
    roomId: formData.get("roomId"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    guests: formData.get("guests"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid booking details" };
  }

  const checkIn = new Date(parsed.data.checkIn);
  const checkOut = new Date(parsed.data.checkOut);
  if (checkOut <= checkIn) {
    return { error: "Check-out date must be after check-in date" };
  }

  const room = await prisma.room.findUnique({ where: { id: parsed.data.roomId } });
  if (!room) return { error: "Room not found" };
  if (parsed.data.guests > room.capacity) {
    return { error: `This room fits up to ${room.capacity} guests` };
  }

  const bookedCount = await roomsBookedForRange(room.id, checkIn, checkOut);
  if (bookedCount >= room.totalUnits) {
    return { error: "No units of this room are available for the selected dates" };
  }

  const nights = nightsBetween(checkIn, checkOut);
  const totalPrice = nights * room.pricePerNight;

  const booking = await prisma.hotelBooking.create({
    data: {
      userId: user.id,
      roomId: room.id,
      checkIn,
      checkOut,
      guests: parsed.data.guests,
      totalPrice,
      status: "CONFIRMED",
    },
  });

  revalidatePath("/bookings");
  redirect(`/bookings/confirmation?type=hotel&id=${booking.id}`);
}

export async function cancelHotelBookingAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const id = formData.get("bookingId") as string;
  const booking = await prisma.hotelBooking.findUnique({ where: { id } });
  if (!booking) return;

  const isOwner = booking.userId === user.id;
  const isStaff = user.role === "HOTEL_STAFF" || user.role === "ADMIN";
  if (!isOwner && !isStaff) return;

  await prisma.hotelBooking.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/bookings");
  revalidatePath("/staff/hotel");
}

// --- Hotel staff management actions ---

async function requireHotelStaff() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "HOTEL_STAFF" && user.role !== "ADMIN")) {
    throw new Error("Forbidden");
  }
  return user;
}

const roomSchema = z.object({
  hotelId: z.string().min(1),
  type: z.string().min(2),
  pricePerNight: z.coerce.number().positive(),
  capacity: z.coerce.number().int().min(1).max(20),
  totalUnits: z.coerce.number().int().min(1).max(200),
});

export async function createRoomAction(formData: FormData) {
  await requireHotelStaff();
  const parsed = roomSchema.safeParse({
    hotelId: formData.get("hotelId"),
    type: formData.get("type"),
    pricePerNight: formData.get("pricePerNight"),
    capacity: formData.get("capacity"),
    totalUnits: formData.get("totalUnits"),
  });
  if (!parsed.success) return;

  await prisma.room.create({ data: parsed.data });
  revalidatePath("/staff/hotel");
  revalidatePath("/hotels");
}

export async function updateRoomAction(formData: FormData) {
  await requireHotelStaff();
  const id = formData.get("roomId") as string;
  const parsed = roomSchema.omit({ hotelId: true }).safeParse({
    type: formData.get("type"),
    pricePerNight: formData.get("pricePerNight"),
    capacity: formData.get("capacity"),
    totalUnits: formData.get("totalUnits"),
  });
  if (!parsed.success || !id) return;

  await prisma.room.update({ where: { id }, data: parsed.data });
  revalidatePath("/staff/hotel");
  revalidatePath("/hotels");
}

export async function deleteRoomAction(formData: FormData) {
  await requireHotelStaff();
  const id = formData.get("roomId") as string;
  if (!id) return;
  await prisma.room.delete({ where: { id } }).catch(() => null);
  revalidatePath("/staff/hotel");
  revalidatePath("/hotels");
}

export async function setHotelBookingStatusAction(formData: FormData) {
  await requireHotelStaff();
  const id = formData.get("bookingId") as string;
  const status = formData.get("status") as "PENDING" | "CONFIRMED" | "CANCELLED";
  if (!id || !status) return;
  await prisma.hotelBooking.update({ where: { id }, data: { status } });
  revalidatePath("/staff/hotel");
  revalidatePath("/bookings");
}

const promotionSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  imageEmoji: z.string().min(1).max(4),
});

export async function createHotelPromotionAction(formData: FormData) {
  const user = await requireHotelStaff();
  const parsed = promotionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageEmoji: formData.get("imageEmoji") || "🏨",
  });
  if (!parsed.success) return;

  await prisma.promotion.create({
    data: { ...parsed.data, scope: "HOTEL", createdById: user.id },
  });
  revalidatePath("/staff/hotel");
  revalidatePath("/");
}

export async function togglePromotionActiveAction(formData: FormData) {
  await getCurrentUser();
  const id = formData.get("promotionId") as string;
  const promo = await prisma.promotion.findUnique({ where: { id } });
  if (!promo) return;
  await prisma.promotion.update({ where: { id }, data: { active: !promo.active } });
  revalidatePath("/staff/hotel");
  revalidatePath("/staff/park");
  revalidatePath("/admin");
  revalidatePath("/");
}
