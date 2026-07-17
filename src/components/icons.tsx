type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function HotelIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M7 21v-7h10v7" />
      <path d="M9 21v-4h2v4M13 21v-4h2v4" />
    </svg>
  );
}

export function FerryIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 16h18l-2 5H5l-2-5Z" />
      <path d="M6 16V9h12v7" />
      <path d="M12 9V4h3l2 3" />
      <path d="M2 20c1.2 1 2.4 1 3.6 0s2.4-1 3.6 0 2.4 1 3.6 0 2.4-1 3.6 0 2.4 1 3.6 0" />
    </svg>
  );
}

export function RideIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <path d="M12 3v3M12 18v3M21 12h-3M6 12H3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" />
    </svg>
  );
}

export function ShowIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 5c2 2 2 4 0 6s-2 4 0 6" />
      <path d="M9 5c2 2 2 4 0 6s-2 4 0 6" />
      <path d="M21 5c-2 2-2 4 0 6s2 4 0 6" />
      <path d="M15 5c-2 2-2 4 0 6s2 4 0 6" />
    </svg>
  );
}

export function BeachIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 12c4-6 9-6 10-2-4-1-7 0-10 2Z" />
      <path d="M12 12c-4-6-9-6-10-2 4-1 7 0 10 2Z" />
      <path d="M12 12v9" />
      <path d="M8 21h8" />
      <path d="M12 12 6 6" />
    </svg>
  );
}

export function DiningIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 3v7a2 2 0 0 0 4 0V3M8 10v11" />
      <path d="M17 3c-1.5 0-3 1.5-3 4s1 4 1 4v10" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function TicketIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path d="M10 6v12" strokeDasharray="2 2" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function PriceTagIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20.5 12.5 12 21l-9-9V4h8l9.5 8.5Z" />
      <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.5 14.3c2.5.3 4.5 2.5 4.5 5.7" />
    </svg>
  );
}
