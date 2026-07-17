import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/auth";
import {
  updateUserRoleAction,
  deleteUserAction,
  createPromotionAction,
  deletePromotionAction,
  createMapLocationAction,
  deleteMapLocationAction,
} from "@/lib/actions/admin";
import { UsersIcon, HotelIcon, RideIcon, FerryIcon } from "@/components/icons";

const ROLES = ["VISITOR", "HOTEL_STAFF", "FERRY_STAFF", "PARK_STAFF", "ADMIN"] as const;

export default async function AdminDashboard() {
  const [users, promotions, locations, hotelBookings, ferryTickets, parkBookings] =
    await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.promotion.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.mapLocation.findMany({ orderBy: { name: "asc" } }),
      prisma.hotelBooking.findMany({ where: { status: "CONFIRMED" } }),
      prisma.ferryTicket.findMany({ where: { status: "CONFIRMED" } }),
      prisma.parkBooking.findMany({ where: { status: "CONFIRMED" }, include: { event: true } }),
    ]);

  const hotelRevenue = hotelBookings.reduce((s, b) => s + b.totalPrice, 0);
  const parkRevenue = parkBookings.reduce((s, b) => s + b.ticketCount * b.event.price, 0);
  const totalPassengers = ferryTickets.reduce((s, t) => s + t.passengers, 0);

  const roleCounts = ROLES.map((r) => ({
    role: r,
    count: users.filter((u) => u.role === r).length,
  }));

  return (
    <div className="mx-auto max-w-6xl w-full px-4 py-10 space-y-10">
      <div>
        <h1 className="font-display text-2xl font-medium text-lagoon-900 dark:text-sand-50">
          Admin Dashboard
        </h1>
        <p className="text-neutral-500">
          Oversee users, content, and system-wide reports for Picnic Island.
        </p>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-start gap-3">
          <UsersIcon className="w-5 h-5 text-lagoon-600 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500">Total users</p>
            <p className="text-2xl font-semibold">{users.length}</p>
          </div>
        </div>
        <div className="card flex items-start gap-3">
          <HotelIcon className="w-5 h-5 text-lagoon-600 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500">Hotel revenue</p>
            <p className="text-2xl font-semibold">${hotelRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="card flex items-start gap-3">
          <RideIcon className="w-5 h-5 text-lagoon-600 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500">Theme park revenue</p>
            <p className="text-2xl font-semibold">${parkRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="card flex items-start gap-3">
          <FerryIcon className="w-5 h-5 text-lagoon-600 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-500">Ferry passengers</p>
            <p className="text-2xl font-semibold">{totalPassengers}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Users by role</h2>
        <div className="card grid sm:grid-cols-5 gap-4 text-center">
          {roleCounts.map((rc) => (
            <div key={rc.role}>
              <p className="text-xl font-semibold">{rc.count}</p>
              <p className="text-xs text-neutral-500">{ROLE_LABELS[rc.role]}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">User management</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2 pr-3">{u.name}</td>
                  <td className="py-2 pr-3">{u.email}</td>
                  <td className="py-2 pr-3">
                    <form action={updateUserRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <select className="input !py-1" name="role" defaultValue={u.role}>
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                      <button className="btn-secondary text-xs" type="submit">
                        Update
                      </button>
                    </form>
                  </td>
                  <td className="py-2 pr-3">
                    <form action={deleteUserAction}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button className="btn-danger text-xs" type="submit">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Ads &amp; promotional content</h2>
        <div className="card">
          <div className="grid gap-2 mb-4">
            {promotions.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 py-2">
                <div>
                  <p className="font-medium">
                    {p.imageEmoji} {p.title}{" "}
                    <span className="text-xs text-neutral-400">({p.scope})</span>
                  </p>
                  <p className="text-sm text-neutral-500">{p.description}</p>
                </div>
                <form action={deletePromotionAction}>
                  <input type="hidden" name="promotionId" value={p.id} />
                  <button className="btn-danger text-xs" type="submit">
                    Remove
                  </button>
                </form>
              </div>
            ))}
            {promotions.length === 0 && (
              <p className="text-sm text-neutral-500">No promotions yet.</p>
            )}
          </div>
          <form action={createPromotionAction} className="grid sm:grid-cols-5 gap-2 items-end">
            <div>
              <label className="label">Emoji</label>
              <input className="input" name="imageEmoji" defaultValue="🎉" maxLength={4} />
            </div>
            <div>
              <label className="label">Title</label>
              <input className="input" name="title" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <input className="input" name="description" required />
            </div>
            <div>
              <label className="label">Scope</label>
              <select className="input" name="scope">
                <option value="GENERAL">General</option>
                <option value="HOTEL">Hotel</option>
                <option value="PARK">Park</option>
              </select>
            </div>
            <div className="sm:col-span-5">
              <button className="btn-primary" type="submit">
                Add promotion
              </button>
            </div>
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Island map locations</h2>
        <div className="card">
          <div className="grid gap-2 mb-4">
            {locations.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 py-2">
                <div>
                  <p className="font-medium">
                    {l.name} <span className="text-xs text-neutral-400">({l.category})</span>
                  </p>
                  <p className="text-sm text-neutral-500">{l.description}</p>
                </div>
                <form action={deleteMapLocationAction}>
                  <input type="hidden" name="locationId" value={l.id} />
                  <button className="btn-danger text-xs" type="submit">
                    Remove
                  </button>
                </form>
              </div>
            ))}
            {locations.length === 0 && (
              <p className="text-sm text-neutral-500">No locations yet.</p>
            )}
          </div>
          <form action={createMapLocationAction} className="grid sm:grid-cols-6 gap-2 items-end">
            <div className="sm:col-span-2">
              <label className="label">Name</label>
              <input className="input" name="name" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <input className="input" name="description" required />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" name="category">
                <option>Hotel</option>
                <option>Ferry</option>
                <option>Theme Park</option>
                <option>Beach</option>
                <option>Dining</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div>
                <label className="label">X %</label>
                <input className="input !w-16" name="x" type="number" min={0} max={100} defaultValue={50} required />
              </div>
              <div>
                <label className="label">Y %</label>
                <input className="input !w-16" name="y" type="number" min={0} max={100} defaultValue={50} required />
              </div>
            </div>
            <div className="sm:col-span-6">
              <button className="btn-primary" type="submit">
                Add location
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
