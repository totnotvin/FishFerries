"use client";

import { useState } from "react";
import Link from "next/link";
import { RideIcon, ShowIcon, BeachIcon } from "@/components/icons";

type ParkEvent = {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  price: number;
  remaining: number;
};

type Group = {
  type: string;
  label: string;
  events: ParkEvent[];
};

const TYPE_ICON: Record<string, typeof RideIcon> = {
  RIDE: RideIcon,
  SHOW: ShowIcon,
  BEACH_EVENT: BeachIcon,
};

export function ParkTabs({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState(groups[0]?.type);
  const current = groups.find((g) => g.type === active) ?? groups[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 border-b border-lagoon-900/10 dark:border-white/10 pb-3">
        {groups.map((g) => {
          const Icon = TYPE_ICON[g.type] ?? RideIcon;
          const isActive = g.type === current?.type;
          return (
            <button
              key={g.type}
              type="button"
              onClick={() => setActive(g.type)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-lagoon-600 text-white"
                  : "bg-sand-100 text-lagoon-900/70 hover:bg-sand-200 dark:bg-lagoon-800/40 dark:text-sand-100/70"
              }`}
            >
              <Icon className="w-4 h-4" />
              {g.label}
              <span className="text-xs opacity-70">({g.events.length})</span>
            </button>
          );
        })}
      </div>

      {current && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {current.events.map((event) => (
            <div key={event.id} className="card flex flex-col">
              <h3 className="font-semibold">{event.name}</h3>
              <p className="text-sm text-neutral-500 mt-1">{event.description}</p>
              <p className="text-sm mt-2">
                {event.date} · {event.time}
              </p>
              <p className="text-sm text-neutral-500">
                {event.remaining > 0 ? `${event.remaining} spots left` : "Sold out"}
              </p>
              <p className="mt-2 text-xl font-semibold text-lagoon-700 dark:text-lagoon-300">
                {event.price === 0 ? "Free" : `$${event.price.toFixed(0)}`}
              </p>
              <Link
                href={`/park/book/${event.id}`}
                className={`btn-primary mt-4 ${event.remaining <= 0 ? "pointer-events-none opacity-50" : ""}`}
              >
                {event.remaining > 0 ? "Book now" : "Sold out"}
              </Link>
            </div>
          ))}
          {current.events.length === 0 && (
            <p className="text-sm text-neutral-500">No events in this category yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
