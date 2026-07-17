import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; id?: string }>;
}) {
  const { type, id } = await searchParams;
  if (!type || !id) notFound();

  let title = "";
  let details: { label: string; value: string }[] = [];

  if (type === "hotel") {
    const b = await prisma.hotelBooking.findUnique({
      where: { id },
      include: { room: { include: { hotel: true } } },
    });
    if (!b) notFound();
    title = "Hotel booking confirmed";
    details = [
      { label: "Hotel", value: b.room.hotel.name },
      { label: "Room", value: b.room.type },
      { label: "Check-in", value: b.checkIn.toDateString() },
      { label: "Check-out", value: b.checkOut.toDateString() },
      { label: "Guests", value: String(b.guests) },
      { label: "Total paid", value: `$${b.totalPrice.toFixed(2)}` },
    ];
  } else if (type === "ferry") {
    const t = await prisma.ferryTicket.findUnique({
      where: { id },
      include: { schedule: true },
    });
    if (!t) notFound();
    title = "Ferry ticket issued";
    details = [
      { label: "Route", value: `${t.schedule.origin} → ${t.schedule.destination}` },
      { label: "Departure", value: t.schedule.departureTime.toLocaleString() },
      { label: "Passengers", value: String(t.passengers) },
    ];
  } else if (type === "park") {
    const b = await prisma.parkBooking.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!b) notFound();
    title = "Theme park booking confirmed";
    details = [
      { label: "Event", value: b.event.name },
      { label: "Type", value: b.event.type.replace("_", " ") },
      { label: "Date", value: b.event.date.toDateString() },
      { label: "Time", value: b.event.time },
      { label: "Tickets", value: String(b.ticketCount) },
      { label: "Total paid", value: `$${(b.event.price * b.ticketCount).toFixed(2)}` },
    ];
  } else {
    notFound();
  }

  return (
    <div className="mx-auto max-w-lg w-full px-4 py-16">
      <div className="card text-center">
        <div className="text-4xl mb-3">✅</div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <dl className="mt-6 text-left space-y-2">
          {details.map((d) => (
            <div key={d.label} className="flex justify-between text-sm border-b border-black/5 dark:border-white/10 pb-2">
              <dt className="text-neutral-500">{d.label}</dt>
              <dd className="font-medium">{d.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex gap-3">
          <Link href="/bookings" className="btn-primary flex-1">
            View my bookings
          </Link>
          <Link href="/" className="btn-secondary flex-1">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
