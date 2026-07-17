"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export type FormState = { error?: string } | undefined;

const bookFerrySchema = z.object({
  scheduleId: z.string().min(1),
  hotelBookingId: z.string().min(1),
  passengers: z.coerce.number().int().min(1).max(20),
});

export async function bookFerryAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be logged in to book a ferry ticket." };

  const parsed = bookFerrySchema.safeParse({
    scheduleId: formData.get("scheduleId"),
    hotelBookingId: formData.get("hotelBookingId"),
    passengers: formData.get("passengers"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid ticket request" };
  }

  const hotelBooking = await prisma.hotelBooking.findUnique({
    where: { id: parsed.data.hotelBookingId },
  });
  if (
    !hotelBooking ||
    hotelBooking.userId !== user.id ||
    hotelBooking.status !== "CONFIRMED"
  ) {
    return { error: "A confirmed hotel booking is required to purchase a ferry ticket." };
  }

  const schedule = await prisma.ferrySchedule.findUnique({
    where: { id: parsed.data.scheduleId },
  });
  if (!schedule) return { error: "Ferry schedule not found" };

  const existingPassengers = await prisma.ferryTicket.aggregate({
    where: { scheduleId: schedule.id, status: { not: "CANCELLED" } },
    _sum: { passengers: true },
  });
  const taken = existingPassengers._sum.passengers ?? 0;
  if (taken + parsed.data.passengers > schedule.capacity) {
    return { error: "Not enough seats left on this sailing" };
  }

  const ticket = await prisma.ferryTicket.create({
    data: {
      userId: user.id,
      scheduleId: schedule.id,
      hotelBookingId: hotelBooking.id,
      passengers: parsed.data.passengers,
      status: "CONFIRMED",
    },
  });

  revalidatePath("/bookings");
  redirect(`/bookings/confirmation?type=ferry&id=${ticket.id}`);
}

export async function cancelFerryTicketAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const id = formData.get("ticketId") as string;
  const ticket = await prisma.ferryTicket.findUnique({ where: { id } });
  if (!ticket) return;

  const isOwner = ticket.userId === user.id;
  const isStaff = user.role === "FERRY_STAFF" || user.role === "ADMIN";
  if (!isOwner && !isStaff) return;

  await prisma.ferryTicket.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/bookings");
  revalidatePath("/staff/ferry");
}

// --- Ferry staff actions ---

async function requireFerryStaff() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "FERRY_STAFF" && user.role !== "ADMIN")) {
    throw new Error("Forbidden");
  }
  return user;
}

const scheduleSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  departureTime: z.string().min(1),
  capacity: z.coerce.number().int().min(1).max(500),
});

export async function createScheduleAction(formData: FormData) {
  await requireFerryStaff();
  const parsed = scheduleSchema.safeParse({
    origin: formData.get("origin"),
    destination: formData.get("destination"),
    departureTime: formData.get("departureTime"),
    capacity: formData.get("capacity"),
  });
  if (!parsed.success) return;

  await prisma.ferrySchedule.create({
    data: { ...parsed.data, departureTime: new Date(parsed.data.departureTime) },
  });
  revalidatePath("/staff/ferry");
  revalidatePath("/ferry");
}

export async function deleteScheduleAction(formData: FormData) {
  await requireFerryStaff();
  const id = formData.get("scheduleId") as string;
  if (!id) return;
  await prisma.ferrySchedule.delete({ where: { id } }).catch(() => null);
  revalidatePath("/staff/ferry");
  revalidatePath("/ferry");
}

export type ValidateState =
  | { error: string; ticket?: undefined }
  | {
      error?: undefined;
      ticket: {
        id: string;
        passengerName: string;
        passengers: number;
        route: string;
        departureTime: string;
      };
    }
  | undefined;

export async function validateTicketAction(
  _prevState: ValidateState,
  formData: FormData
): Promise<ValidateState> {
  await requireFerryStaff();
  const code = (formData.get("ticketId") as string)?.trim();
  if (!code) return { error: "Enter a ticket ID" };

  const ticket = await prisma.ferryTicket.findUnique({
    where: { id: code },
    include: { user: true, hotelBooking: true, schedule: true },
  });

  if (!ticket) return { error: "Ticket not found" };
  if (ticket.status === "CANCELLED") return { error: "This ticket has been cancelled" };
  if (ticket.hotelBooking.status !== "CONFIRMED") {
    return { error: "Linked hotel booking is no longer valid" };
  }

  return {
    ticket: {
      id: ticket.id,
      passengerName: ticket.user.name,
      passengers: ticket.passengers,
      route: `${ticket.schedule.origin} → ${ticket.schedule.destination}`,
      departureTime: ticket.schedule.departureTime.toLocaleString(),
    },
  };
}
