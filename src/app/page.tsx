import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const promotions = await prisma.promotion.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-600 to-cyan-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Welcome to Picnic Island
          </h1>
          <p className="mt-4 text-teal-50 text-lg max-w-2xl mx-auto">
            Sun, sand, and a brand-new theme park just a ferry ride away. Book your hotel
            stay, ferry crossing, and theme park adventures all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/hotels" className="btn-primary bg-white text-teal-700 hover:bg-teal-50">
              Book a Hotel
            </Link>
            <Link href="/park" className="btn-primary bg-teal-800 hover:bg-teal-900">
              Explore the Theme Park
            </Link>
            <Link href="/map" className="btn-primary bg-teal-800 hover:bg-teal-900">
              View Island Map
            </Link>
          </div>
        </div>
      </section>

      {promotions.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-xl font-semibold mb-5">Promotions &amp; What&apos;s On</h2>
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
        <h2 className="text-xl font-semibold mb-5">Plan your visit</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/hotels", emoji: "🏨", title: "Hotel Stays", desc: "Pick your dates and room." },
            { href: "/ferry", emoji: "⛴️", title: "Ferry Tickets", desc: "Requires a hotel booking." },
            { href: "/park", emoji: "🎢", title: "Rides & Shows", desc: "Book theme park activities." },
            { href: "/park", emoji: "🏖️", title: "Beach Events", desc: "Sunset yoga, bonfires & more." },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="card hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
