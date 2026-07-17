import { prisma } from "@/lib/prisma";
import { ParkTabs } from "@/components/ParkTabs";

const TYPE_LABELS: Record<string, string> = {
  RIDE: "Rides",
  SHOW: "Shows",
  BEACH_EVENT: "Beach Events",
};

const TYPE_ORDER = ["RIDE", "SHOW", "BEACH_EVENT"];

export default async function ParkPage() {
  const events = await prisma.parkEvent.findMany({
    orderBy: { date: "asc" },
    include: { bookings: { where: { status: { not: "CANCELLED" } } } },
  });

  const groups = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    events: events
      .filter((e) => e.type === type)
      .map((e) => {
        const taken = e.bookings.reduce((s, b) => s + b.ticketCount, 0);
        return {
          id: e.id,
          name: e.name,
          description: e.description,
          date: e.date.toDateString(),
          time: e.time,
          price: e.price,
          remaining: e.capacity - taken,
        };
      }),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 w-full">
      <h1 className="font-display text-2xl font-medium mb-1 text-lagoon-900 dark:text-sand-50">
        Theme park activities &amp; beach events
      </h1>
      <p className="text-neutral-500 mb-8">
        Book rides, shows, and beach events inside the theme park.
      </p>

      {events.length > 0 ? (
        <ParkTabs groups={groups} />
      ) : (
        <p className="text-neutral-500">No events scheduled yet — check back soon.</p>
      )}
    </div>
  );
}
