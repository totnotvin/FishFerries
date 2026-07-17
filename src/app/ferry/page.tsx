import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { FerryBookingForm } from "@/components/FerryBookingForm";

export default async function FerryPage() {
  const user = await getCurrentUser();

  const schedules = await prisma.ferrySchedule.findMany({
    orderBy: { departureTime: "asc" },
  });

  if (!user) {
    return (
      <div className="mx-auto max-w-lg w-full px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">Ferry Tickets</h1>
        <p className="text-neutral-500 mb-6">Log in to purchase a ferry ticket.</p>
        <Link href="/login" className="btn-primary">
          Log in
        </Link>
      </div>
    );
  }

  const hotelBookings = await prisma.hotelBooking.findMany({
    where: { userId: user.id, status: "CONFIRMED" },
    include: { room: { include: { hotel: true } } },
    orderBy: { checkIn: "asc" },
  });

  if (hotelBookings.length === 0) {
    return (
      <div className="mx-auto max-w-lg w-full px-4 py-16 text-center">
        <div className="card">
          <div className="text-3xl mb-2">🚫</div>
          <h1 className="text-xl font-semibold mb-2">A hotel booking is required</h1>
          <p className="text-neutral-500 mb-6">
            Ferry tickets can only be purchased once you have a confirmed hotel booking on
            Picnic Island.
          </p>
          <Link href="/hotels" className="btn-primary">
            Book a hotel first
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl w-full px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Ferry Tickets</h1>
      <p className="text-neutral-500 mb-8">
        You have a confirmed hotel booking — choose a sailing below.
      </p>
      <div className="card">
        <FerryBookingForm schedules={schedules} hotelBookings={hotelBookings} />
      </div>
    </div>
  );
}
