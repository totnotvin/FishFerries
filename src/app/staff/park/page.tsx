import { prisma } from "@/lib/prisma";
import {
  createParkEventAction,
  updateParkEventAction,
  deleteParkEventAction,
  cancelParkBookingAction,
  createParkPromotionAction,
  togglePromotionActiveAction,
} from "@/lib/actions/park";
import { OnSiteValidator } from "@/components/OnSiteValidator";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "CONFIRMED" ? "badge-confirmed" : status === "PENDING" ? "badge-pending" : "badge-cancelled";
  return <span className={cls}>{status}</span>;
}

export default async function ParkStaffDashboard() {
  const [events, bookings, promotions] = await Promise.all([
    prisma.parkEvent.findMany({
      orderBy: { date: "asc" },
      include: { bookings: { where: { status: { not: "CANCELLED" } } } },
    }),
    prisma.parkBooking.findMany({
      include: { user: true, event: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.promotion.findMany({ where: { scope: "PARK" }, orderBy: { createdAt: "desc" } }),
  ]);

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const ticketsSold = confirmed.reduce((s, b) => s + b.ticketCount, 0);
  const revenue = confirmed.reduce((s, b) => s + b.ticketCount * b.event.price, 0);

  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Theme Park Staff Dashboard</h1>
        <p className="text-neutral-500">
          Manage events, capacity, ticket sales, and on-site validation.
        </p>
      </div>

      <section className="grid sm:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-neutral-500">Events scheduled</p>
          <p className="text-2xl font-semibold">{events.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-500">Bookings</p>
          <p className="text-2xl font-semibold">{bookings.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-500">Tickets sold</p>
          <p className="text-2xl font-semibold">{ticketsSold}</p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-500">Revenue</p>
          <p className="text-2xl font-semibold">${revenue.toFixed(2)}</p>
        </div>
      </section>

      <OnSiteValidator />

      <section>
        <h2 className="text-lg font-semibold mb-3">Events, rides, shows &amp; beach events</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Date / Time</th>
                <th className="py-2 pr-3">Capacity</th>
                <th className="py-2 pr-3">Booked</th>
                <th className="py-2 pr-3">Price</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const booked = e.bookings.reduce((s, b) => s + b.ticketCount, 0);
                return (
                  <tr key={e.id} className="border-b border-black/5 dark:border-white/5">
                    <td className="py-2 pr-3">{e.name}</td>
                    <td className="py-2 pr-3">{e.type.replace("_", " ")}</td>
                    <td className="py-2 pr-3">
                      {e.date.toDateString()} {e.time}
                    </td>
                    <td className="py-2 pr-3">{e.capacity}</td>
                    <td className="py-2 pr-3">{booked}</td>
                    <td className="py-2 pr-3">${e.price.toFixed(0)}</td>
                    <td className="py-2 pr-3">
                      <form action={deleteParkEventAction}>
                        <input type="hidden" name="eventId" value={e.id} />
                        <button className="btn-danger text-xs" type="submit">
                          Remove
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <form action={createParkEventAction} className="grid sm:grid-cols-6 gap-2 items-end">
            <div>
              <label className="label">Type</label>
              <select className="input" name="type" required>
                <option value="RIDE">Ride</option>
                <option value="SHOW">Show</option>
                <option value="BEACH_EVENT">Beach Event</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Name</label>
              <input className="input" name="name" required />
            </div>
            <div className="sm:col-span-3">
              <label className="label">Description</label>
              <input className="input" name="description" required />
            </div>
            <div>
              <label className="label">Date</label>
              <input className="input" name="date" type="date" required />
            </div>
            <div>
              <label className="label">Time</label>
              <input className="input" name="time" placeholder="14:00" required />
            </div>
            <div>
              <label className="label">Capacity</label>
              <input className="input" name="capacity" type="number" defaultValue={30} required />
            </div>
            <div>
              <label className="label">Price ($)</label>
              <input className="input" name="price" type="number" step="0.01" defaultValue={0} required />
            </div>
            <div className="sm:col-span-6">
              <button className="btn-primary" type="submit">
                Add event
              </button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Ticket sales &amp; visitor reports</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-3">Visitor</th>
                <th className="py-2 pr-3">Event</th>
                <th className="py-2 pr-3">Tickets</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2 pr-3">{b.user.name}</td>
                  <td className="py-2 pr-3">{b.event.name}</td>
                  <td className="py-2 pr-3">{b.ticketCount}</td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-2 pr-3">
                    {b.status !== "CANCELLED" && (
                      <form action={cancelParkBookingAction}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <button className="btn-danger text-xs" type="submit">
                          Cancel
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Promotions for activities</h2>
        <div className="card">
          <div className="grid gap-2 mb-4">
            {promotions.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 py-2">
                <div>
                  <p className="font-medium">
                    {p.imageEmoji} {p.title}
                  </p>
                  <p className="text-sm text-neutral-500">{p.description}</p>
                </div>
                <form action={togglePromotionActiveAction}>
                  <input type="hidden" name="promotionId" value={p.id} />
                  <button className="btn-secondary text-xs" type="submit">
                    {p.active ? "Deactivate" : "Activate"}
                  </button>
                </form>
              </div>
            ))}
            {promotions.length === 0 && (
              <p className="text-sm text-neutral-500">No promotions yet.</p>
            )}
          </div>
          <form action={createParkPromotionAction} className="grid sm:grid-cols-4 gap-2 items-end">
            <div>
              <label className="label">Emoji</label>
              <input className="input" name="imageEmoji" defaultValue="🎢" maxLength={4} />
            </div>
            <div>
              <label className="label">Title</label>
              <input className="input" name="title" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <input className="input" name="description" required />
            </div>
            <div className="sm:col-span-4">
              <button className="btn-primary" type="submit">
                Add promotion
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
