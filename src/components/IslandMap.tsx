"use client";

import { useState } from "react";
import {
  HotelIcon,
  FerryIcon,
  RideIcon,
  BeachIcon,
  DiningIcon,
  MapPinIcon,
} from "@/components/icons";

type MapLocation = {
  id: string;
  name: string;
  description: string;
  category: string;
  x: number;
  y: number;
};

const CATEGORY_ICON: Record<string, typeof MapPinIcon> = {
  Hotel: HotelIcon,
  Ferry: FerryIcon,
  "Theme Park": RideIcon,
  Beach: BeachIcon,
  Dining: DiningIcon,
};

export function IslandMap({ locations }: { locations: MapLocation[] }) {
  const [active, setActive] = useState<MapLocation | null>(null);

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-lagoon-900/10 dark:border-white/10">
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="map-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a9e6e2" />
            <stop offset="100%" stopColor="#3fb3ac" />
          </linearGradient>
          <linearGradient id="map-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ecd6a8" />
            <stop offset="100%" stopColor="#d9c084" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#map-sea)" />
        <path
          d="M60 60 C120 20 260 15 330 70 C380 110 370 170 330 210 C290 250 220 280 150 265 C80 250 30 220 25 165 C20 115 25 90 60 60Z"
          fill="url(#map-land)"
          stroke="#4c8c4a"
          strokeWidth="3"
          opacity="0.9"
        />
        <path
          d="M0 30c20 8 40-8 60 0s40 8 60 0 40-8 60 0 40 8 60 0 40-8 60 0 40 8 60 0v20c-20 8-40-8-60 0s-40 8-60 0-40-8-60 0-40 8-60 0-40-8-60 0-40 8-60 0Z"
          fill="#fff"
          opacity="0.15"
        />
      </svg>

      {locations.map((loc) => {
        const Icon = CATEGORY_ICON[loc.category] ?? MapPinIcon;
        return (
          <button
            key={loc.id}
            className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center group"
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            onClick={() => setActive(loc)}
            type="button"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-coral-500 text-white shadow group-hover:scale-110 transition-transform">
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-medium bg-white/90 text-lagoon-900 px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
              {loc.name}
            </span>
          </button>
        );
      })}

      {active && (
        <div className="absolute bottom-3 left-3 right-3 card !p-4 bg-white/95 dark:bg-lagoon-900/95">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-coral-100 text-coral-600 shrink-0">
                {(() => {
                  const Icon = CATEGORY_ICON[active.category] ?? MapPinIcon;
                  return <Icon className="w-4 h-4" />;
                })()}
              </span>
              <div>
                <p className="font-semibold">{active.name}</p>
                <p className="text-sm text-neutral-500 mt-0.5">{active.description}</p>
              </div>
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
