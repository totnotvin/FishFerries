import { prisma } from "@/lib/prisma";
import {
  createRoomAction,
  updateRoomAction,
  deleteRoomAction,
  setHotelBookingStatusAction,
  createHotelPromotionAction,
  togglePromotionActiveAction,
} from "@/lib/actions/hotel";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "CONFIRMED" ? "badge-confirmed" : status === "PENDING" ? "badge-pending" : "badge-cancelled";
  return <span className={cls}>{status}</span>;
}

export default async function HotelStaffDashboard() {
  const [hotels, rooms, bookings, promotions] = await Promise.all([
    prisma.hotel.findMany(),
    prisma.room.findMany({ include: { hotel: true }, orderBy: { type: "asc" } }),
    prisma.hotelBooking.findMany({
      include: { user: true, room: { include: { hotel: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.promotion.findMany({ where: { scope: "HOTEL" }, orderBy: { createdAt: "desc" } }),
  ]);

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const revenue = confirmed.reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Hotel Staff Dashboard</h1>
        <p className="text-neutral-500">Manage rooms, bookings, promotions, and reports.</p>
      </div>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-neutral-500">Total bookings</p>
          <p className="text-2xl font-semibold">{bookings.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-500">Confirmed bookings</p>
          <p className="text-2xl font-semibold">{confirmed.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-500">Revenue (confirmed)</p>
          <p className="text-2xl font-semibold">${revenue.toFixed(2)}</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Rooms</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-3">Hotel</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Price/night</th>
                <th className="py-2 pr-3">Capacity</th>
                <th className="py-2 pr-3">Units</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2 pr-3">
                    {room.hotel.name}
                    <form action={updateRoomAction} id={`room-form-${room.id}`} />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="input !py-1 !w-28"
                      form={`room-form-${room.id}`}
                      name="type"
                      defaultValue={room.type}
                    />
                    <input type="hidden" form={`room-form-${room.id}`} name="roomId" value={room.id} />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="input !py-1 !w-20"
                      form={`room-form-${room.id}`}
                      name="pricePerNight"
                      type="number"
                      step="0.01"
                      defaultValue={room.pricePerNight}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="input !py-1 !w-16"
                      form={`room-form-${room.id}`}
                      name="capacity"
                      type="number"
                      defaultValue={room.capacity}
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      className="input !py-1 !w-16"
                      form={`room-form-${room.id}`}
                      name="totalUnits"
                      type="number"
                      defaultValue={room.totalUnits}
                    />
                  </td>
                  <td className="py-2 pr-3 flex gap-2">
                    <button className="btn-secondary text-xs" form={`room-form-${room.id}`} type="submit">
                      Save
                    </button>
                    <form action={deleteRoomAction}>
                      <input type="hidden" name="roomId" value={room.id} />
                      <button className="btn-danger text-xs" type="submit">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <form action={createRoomAction} className="mt-4 grid sm:grid-cols-6 gap-2 items-end">
            <div className="sm:col-span-2">
              <label className="label">Hotel</label>
              <select className="input" name="hotelId" required>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Type</label>
              <input className="input" name="type" placeholder="Ocean Suite" required />
            </div>
            <div>
              <label className="label">Price/night</label>
              <input className="input" name="pricePerNight" type="number" step="0.01" required />
            </div>
            <div>
              <label className="label">Capacity</label>
              <input className="input" name="capacity" type="number" defaultValue={2} required />
            </div>
            <div>
              <label className="label">Units</label>
              <input className="input" name="totalUnits" type="number" defaultValue={5} required />
            </div>
            <div className="sm:col-span-6">
              <button className="btn-primary" type="submit">
                Add room
              </button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Bookings</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-3">Guest</th>
                <th className="py-2 pr-3">Room</th>
                <th className="py-2 pr-3">Dates</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2 pr-3">{b.user.name}</td>
                  <td className="py-2 pr-3">
                    {b.room.hotel.name} · {b.room.type}
                  </td>
                  <td className="py-2 pr-3">
                    {b.checkIn.toDateString()} – {b.checkOut.toDateString()}
                  </td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-2 pr-3">
                    <div className="flex gap-2">
                      {b.status !== "CONFIRMED" && (
                        <form action={setHotelBookingStatusAction}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <input type="hidden" name="status" value="CONFIRMED" />
                          <button className="btn-secondary text-xs" type="submit">
                            Confirm
                          </button>
                        </form>
                      )}
                      {b.status !== "CANCELLED" && (
                        <form action={setHotelBookingStatusAction}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <input type="hidden" name="status" value="CANCELLED" />
                          <button className="btn-danger text-xs" type="submit">
                            Cancel
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Promotions</h2>
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
          <form action={createHotelPromotionAction} className="grid sm:grid-cols-4 gap-2 items-end">
            <div>
              <label className="label">Emoji</label>
              <input className="input" name="imageEmoji" defaultValue="🏨" maxLength={4} />
            </div>
            <div className="sm:col-span-1">
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
