import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { cancelHotelBookingAction } from "@/lib/actions/hotel";
import { cancelFerryTicketAction } from "@/lib/actions/ferry";
import { cancelParkBookingAction } from "@/lib/actions/park";
import { HotelIcon, FerryIcon, RideIcon } from "@/components/icons";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "CONFIRMED" ? "badge-confirmed" : status === "PENDING" ? "badge-pending" : "badge-cancelled";
  return <span className={cls}>{status}</span>;
}

export default async function BookingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [hotelBookings, ferryTickets, parkBookings] = await Promise.all([
    prisma.hotelBooking.findMany({
      where: { userId: user.id },
      include: { room: { include: { hotel: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ferryTicket.findMany({
      where: { userId: user.id },
      include: { schedule: true },
      orderBy: { issuedAt: "desc" },
    }),
    prisma.parkBooking.findMany({
      where: { userId: user.id },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl w-full px-4 py-10 space-y-10">
      <h1 className="font-display text-2xl font-medium text-lagoon-900 dark:text-sand-50">My Bookings</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><HotelIcon className="w-5 h-5 text-lagoon-600" /> Hotel Bookings</h2>
        <div className="space-y-3">
          {hotelBookings.map((b) => (
            <div key={b.id} className="card flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">
                  {b.room.hotel.name} · {b.room.type}
                </p>
                <p className="text-sm text-neutral-500">
                  {b.checkIn.toDateString()} – {b.checkOut.toDateString()} · {b.guests} guest(s) ·
                  ${b.totalPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                {b.status !== "CANCELLED" && (
                  <form action={cancelHotelBookingAction}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <button className="btn-danger text-xs" type="submit">
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
          {hotelBookings.length === 0 && (
            <p className="text-sm text-neutral-500">No hotel bookings yet.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><FerryIcon className="w-5 h-5 text-lagoon-600" /> Ferry Tickets</h2>
        <div className="space-y-3">
          {ferryTickets.map((t) => (
            <div key={t.id} className="card flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">
                  {t.schedule.origin} → {t.schedule.destination}
                </p>
                <p className="text-sm text-neutral-500">
                  {t.schedule.departureTime.toLocaleString()} · {t.passengers} passenger(s)
                </p>
                <p className="text-xs text-neutral-400 mt-1">Ticket ID: {t.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={t.status} />
                {t.status !== "CANCELLED" && (
                  <form action={cancelFerryTicketAction}>
                    <input type="hidden" name="ticketId" value={t.id} />
                    <button className="btn-danger text-xs" type="submit">
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
          {ferryTickets.length === 0 && (
            <p className="text-sm text-neutral-500">No ferry tickets yet.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><RideIcon className="w-5 h-5 text-lagoon-600" /> Theme Park &amp; Beach Bookings</h2>
        <div className="space-y-3">
          {parkBookings.map((b) => (
            <div key={b.id} className="card flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium">{b.event.name}</p>
                <p className="text-sm text-neutral-500">
                  {b.event.date.toDateString()} · {b.event.time} · {b.ticketCount} ticket(s)
                </p>
                <p className="text-xs text-neutral-400 mt-1">Booking ID: {b.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                {b.status !== "CANCELLED" && (
                  <form action={cancelParkBookingAction}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <button className="btn-danger text-xs" type="submit">
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
          {parkBookings.length === 0 && (
            <p className="text-sm text-neutral-500">No theme park bookings yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
