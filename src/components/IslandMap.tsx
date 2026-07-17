"use client";

import { useState } from "react";

type MapLocation = {
  id: string;
  name: string;
  description: string;
  category: string;
  x: number;
  y: number;
};

const CATEGORY_EMOJI: Record<string, string> = {
  Hotel: "🏨",
  Ferry: "⛴️",
  "Theme Park": "🎢",
  Beach: "🏖️",
  Dining: "🍽️",
  Other: "📍",
};

export function IslandMap({ locations }: { locations: MapLocation[] }) {
  const [active, setActive] = useState<MapLocation | null>(null);

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-gradient-to-br from-cyan-200 via-emerald-100 to-amber-100">
      <div className="absolute inset-6 rounded-[40%] bg-gradient-to-br from-lime-200 to-emerald-300 opacity-80" />

      {locations.map((loc) => (
        <button
          key={loc.id}
          className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center group"
          style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
          onClick={() => setActive(loc)}
          type="button"
        >
          <span className="text-2xl drop-shadow group-hover:scale-125 transition-transform">
            {CATEGORY_EMOJI[loc.category] ?? "📍"}
          </span>
          <span className="text-[10px] font-medium bg-white/90 px-1.5 py-0.5 rounded shadow -mt-1 whitespace-nowrap">
            {loc.name}
          </span>
        </button>
      ))}

      {active && (
        <div className="absolute bottom-3 left-3 right-3 card !p-4 bg-white/95 dark:bg-neutral-900/95">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">
                {CATEGORY_EMOJI[active.category] ?? "📍"} {active.name}
              </p>
              <p className="text-sm text-neutral-500 mt-0.5">{active.description}</p>
            </div>
            <button
              className="text-neutral-400 hover:text-neutral-700 text-sm"
              onClick={() => setActive(null)}
              type="button"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
