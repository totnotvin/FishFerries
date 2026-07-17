import { prisma } from "@/lib/prisma";
import { createScheduleAction, deleteScheduleAction, cancelFerryTicketAction } from "@/lib/actions/ferry";
import { TicketValidator } from "@/components/TicketValidator";
import { CalendarIcon, TicketIcon, UsersIcon } from "@/components/icons";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "CONFIRMED" ? "badge-confirmed" : status === "PENDING" ? "badge-pending" : "badge-cancelled";
  return <span className={cls}>{status}</span>;
}

export default async function FerryStaffDashboard() {
  const [schedules, tickets] = await Promise.all([
    prisma.ferrySchedule.findMany({
      orderBy: { departureTime: "asc" },
      include: { tickets: { where: { status: { not: "CANCELLED" } } } },
    }),
    prisma.ferryTicket.findMany({
      include: { user: true, schedule: true },
      orderBy: { issuedAt: "desc" },
      take: 50,
    }),
  ]);

  const totalPassengers = tickets
    .filter((t) => t.status !== "CANCELLED")
    .reduce((s, t) => s + t.passengers, 0);

  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-10 space-y-10">
      <div>
        <h1 className="font-display text-2xl font-medium text-lagoon-900 dark:text-sand-50">
          Ferry Staff Dashboard
        </h1>
        <p className="text-neutral-500">Validate tickets, manage sailings, and view trip reports.</p>
      </div>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card flex items-start gap-3">
          <CalendarIcon className="w-5 h-5 text-lagoon-600 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500">Sailings scheduled</p>
            <p className="text-2xl font-semibold">{schedules.length}</p>
          </div>
        </div>
        <div className="card flex items-start gap-3">
          <TicketIcon className="w-5 h-5 text-lagoon-600 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500">Tickets issued</p>
            <p className="text-2xl font-semibold">{tickets.length}</p>
          </div>
        </div>
        <div className="card flex items-start gap-3">
          <UsersIcon className="w-5 h-5 text-lagoon-600 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500">Total passengers</p>
            <p className="text-2xl font-semibold">{totalPassengers}</p>
          </div>
        </div>
      </section>

      <TicketValidator />

      <section>
        <h2 className="text-lg font-semibold mb-3">Schedules</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-3">Route</th>
                <th className="py-2 pr-3">Departure</th>
                <th className="py-2 pr-3">Capacity</th>
                <th className="py-2 pr-3">Booked</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => {
                const booked = s.tickets.reduce((sum, t) => sum + t.passengers, 0);
                return (
                  <tr key={s.id} className="border-b border-black/5 dark:border-white/5">
                    <td className="py-2 pr-3">
                      {s.origin} → {s.destination}
                    </td>
                    <td className="py-2 pr-3">{s.departureTime.toLocaleString()}</td>
                    <td className="py-2 pr-3">{s.capacity}</td>
                    <td className="py-2 pr-3">{booked}</td>
                    <td className="py-2 pr-3">
                      <form action={deleteScheduleAction}>
                        <input type="hidden" name="scheduleId" value={s.id} />
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

          <form action={createScheduleAction} className="grid sm:grid-cols-5 gap-2 items-end">
            <div>
              <label className="label">Origin</label>
              <input className="input" name="origin" placeholder="Mainland Pier" required />
            </div>
            <div>
              <label className="label">Destination</label>
              <input className="input" name="destination" placeholder="Picnic Island" required />
            </div>
            <div>
              <label className="label">Departure</label>
              <input className="input" name="departureTime" type="datetime-local" required />
            </div>
            <div>
              <label className="label">Capacity</label>
              <input className="input" name="capacity" type="number" defaultValue={50} required />
            </div>
            <div>
              <button className="btn-primary" type="submit">
                Add sailing
              </button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Passenger list & trip reports</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-3">Passenger</th>
                <th className="py-2 pr-3">Route</th>
                <th className="py-2 pr-3">Departure</th>
                <th className="py-2 pr-3">Pax</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2 pr-3">{t.user.name}</td>
                  <td className="py-2 pr-3">
                    {t.schedule.origin} → {t.schedule.destination}
                  </td>
                  <td className="py-2 pr-3">{t.schedule.departureTime.toLocaleString()}</td>
                  <td className="py-2 pr-3">{t.passengers}</td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-2 pr-3">
                    {t.status !== "CANCELLED" && (
                      <form action={cancelFerryTicketAction}>
                        <input type="hidden" name="ticketId" value={t.id} />
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
    </div>
  );
}
