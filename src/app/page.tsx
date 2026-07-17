import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { IslandHero } from "@/components/IslandHero";
import { HotelIcon, FerryIcon, RideIcon, BeachIcon } from "@/components/icons";

export default async function HomePage() {
  const promotions = await prisma.promotion.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div>
      <section className="bg-sand-100 dark:bg-lagoon-800/40 border-b border-lagoon-900/10 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-coral-600 dark:text-coral-400 text-sm font-semibold tracking-wide uppercase mb-3">
              Now open for booking
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-lagoon-900 dark:text-sand-50">
              Picnic Island has been a weekend escape for three generations.
              This year, we&apos;re opening a theme park next door.
            </h1>
            <p className="mt-4 text-lagoon-900/70 dark:text-sand-100/70 text-lg max-w-xl">
              Book a hotel stay, catch the ferry across, and spend your days on
              rides, shows, and beach events — all from one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/hotels" className="btn-primary">
                Book a hotel
              </Link>
              <Link href="/park" className="btn-secondary">
                Explore the theme park
              </Link>
              <Link href="/map" className="btn-secondary">
                View the map
              </Link>
            </div>
          </div>
          <IslandHero className="w-full h-auto rounded-2xl border border-lagoon-900/10 dark:border-white/10" />
        </div>
      </section>

      {promotions.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-2xl font-medium mb-5 text-lagoon-900 dark:text-sand-50">
            Promotions &amp; what&apos;s on
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <div key={promo.id} className="card">
                <div className="text-3xl mb-2">{promo.imageEmoji}</div>
                <h3 className="font-semibold">{promo.title}</h3>
                <p className="text-sm text-neutral-500 mt-1">{promo.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-2xl font-medium mb-5 text-lagoon-900 dark:text-sand-50">
          Plan your visit
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/hotels", Icon: HotelIcon, title: "Hotel stays", desc: "Pick your dates and room." },
            { href: "/ferry", Icon: FerryIcon, title: "Ferry tickets", desc: "Requires a hotel booking." },
            { href: "/park", Icon: RideIcon, title: "Rides & shows", desc: "Book theme park activities." },
            { href: "/park", Icon: BeachIcon, title: "Beach events", desc: "Sunset yoga, bonfires & more." },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="card hover:shadow-md transition-shadow">
              <item.Icon className="w-7 h-7 mb-2 text-coral-500" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
