import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HotelsPage() {
  const hotels = await prisma.hotel.findMany({
    include: { rooms: { orderBy: { pricePerNight: "asc" } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 w-full">
      <h1 className="text-2xl font-semibold mb-1">Hotel Stays</h1>
      <p className="text-neutral-500 mb-8">
        Choose your room and dates. A confirmed hotel booking unlocks ferry ticket purchases.
      </p>

      <div className="space-y-10">
        {hotels.map((hotel) => (
          <section key={hotel.id}>
            <h2 className="text-lg font-semibold">{hotel.name}</h2>
            <p className="text-sm text-neutral-500 mb-4">
              {hotel.location} — {hotel.description}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotel.rooms.map((room) => (
                <div key={room.id} className="card flex flex-col">
                  <h3 className="font-semibold">{room.type}</h3>
                  <p className="text-sm text-neutral-500 mt-1">Sleeps up to {room.capacity}</p>
                  <p className="mt-3 text-xl font-semibold text-teal-700">
                    ${room.pricePerNight.toFixed(0)}
                    <span className="text-sm font-normal text-neutral-500"> / night</span>
                  </p>
                  <Link href={`/hotels/book/${room.id}`} className="btn-primary mt-4">
                    Book this room
                  </Link>
                </div>
              ))}
              {hotel.rooms.length === 0 && (
                <p className="text-sm text-neutral-500">No rooms configured yet.</p>
              )}
            </div>
          </section>
        ))}
        {hotels.length === 0 && (
          <p className="text-neutral-500">No hotels available yet — check back soon.</p>
        )}
      </div>
    </div>
  );
}
