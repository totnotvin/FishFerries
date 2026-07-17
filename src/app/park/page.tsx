import Link from "next/link";
import { prisma } from "@/lib/prisma";

const TYPE_LABELS: Record<string, string> = {
  RIDE: "Rides",
  SHOW: "Shows",
  BEACH_EVENT: "Beach Events",
};

const TYPE_EMOJI: Record<string, string> = {
  RIDE: "🎢",
  SHOW: "🎭",
  BEACH_EVENT: "🏖️",
};

export default async function ParkPage() {
  const events = await prisma.parkEvent.findMany({
    orderBy: { date: "asc" },
    include: { bookings: { where: { status: { not: "CANCELLED" } } } },
  });

  const grouped = events.reduce<Record<string, typeof events>>((acc, e) => {
    (acc[e.type] ??= []).push(e);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 w-full">
      <h1 className="text-2xl font-semibold mb-1">Theme Park Activities & Beach Events</h1>
      <p className="text-neutral-500 mb-8">
        Book rides, shows, and beach events inside the theme park.
      </p>

      <div className="space-y-10">
        {Object.entries(grouped).map(([type, list]) => (
          <section key={type}>
            <h2 className="text-lg font-semibold mb-4">
              {TYPE_EMOJI[type]} {TYPE_LABELS[type]}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((event) => {
                const taken = event.bookings.reduce((s, b) => s + b.ticketCount, 0);
                const remaining = event.capacity - taken;
                return (
                  <div key={event.id} className="card flex flex-col">
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{event.description}</p>
                    <p className="text-sm mt-2">
                      {event.date.toDateString()} · {event.time}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {remaining > 0 ? `${remaining} spots left` : "Sold out"}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-teal-700">
                      {event.price === 0 ? "Free" : `$${event.price.toFixed(0)}`}
                    </p>
                    <Link
                      href={`/park/book/${event.id}`}
                      className={`btn-primary mt-4 ${remaining <= 0 ? "pointer-events-none opacity-50" : ""}`}
                    >
                      {remaining > 0 ? "Book now" : "Sold out"}
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        {events.length === 0 && (
          <p className="text-neutral-500">No events scheduled yet — check back soon.</p>
        )}
      </div>
    </div>
  );
}
