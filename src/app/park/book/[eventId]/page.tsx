import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ParkBookingForm } from "@/components/ParkBookingForm";

export default async function BookEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await prisma.parkEvent.findUnique({
    where: { id: eventId },
    include: { bookings: { where: { status: { not: "CANCELLED" } } } },
  });
  if (!event) notFound();

  const taken = event.bookings.reduce((s, b) => s + b.ticketCount, 0);
  const remaining = event.capacity - taken;

  return (
    <div className="mx-auto max-w-lg w-full px-4 py-10">
      <div className="card">
        <h1 className="text-xl font-semibold">{event.name}</h1>
        <p className="text-sm text-neutral-500 mb-6">
          {event.date.toDateString()} · {event.time}
        </p>
        <ParkBookingForm eventId={event.id} price={event.price} remaining={remaining} />
      </div>
    </div>
  );
}
