export function IslandHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      role="img"
      aria-label="Illustration of Picnic Island with palm trees, a beach, and the sea"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe0d3" />
          <stop offset="100%" stopColor="#fff2ed" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fb3ac" />
          <stop offset="100%" stopColor="#157872" />
        </linearGradient>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2b134" />
          <stop offset="100%" stopColor="#e59c1a" />
        </linearGradient>
      </defs>

      <rect width="400" height="260" fill="url(#sky)" />

      <circle cx="335" cy="55" r="30" fill="#fff8ec" opacity="0.9" />

      <path d="M0 165 C60 145 100 180 160 160 C220 140 260 175 320 155 C360 142 380 160 400 150 V260 H0 Z" fill="url(#sea)" />
      <path d="M0 150 C50 138 90 158 150 145 C210 132 250 160 310 142 C355 128 380 145 400 138 V165 C380 175 355 158 320 172 C260 192 220 157 160 177 C100 197 60 162 0 182 Z" fill="#72d1cb" opacity="0.55" />

      <path d="M70 200 C110 150 170 145 210 175 C260 145 320 165 340 205 C360 235 320 245 260 240 C190 250 100 248 60 232 C30 220 45 210 70 200Z" fill="url(#land)" />
      <path d="M40 232 C120 260 300 260 365 228 L400 260 H0 Z" fill="#fbf3e3" />

      <g transform="translate(120 108)">
        <path d="M0 90 C-3 60 2 35 8 15" stroke="#146560" strokeWidth="5" fill="none" strokeLinecap="round" />
        <g fill="#4c8c4a">
          <path d="M8 15 C-10 8 -22 -6 -20 -18 C-6 -14 4 0 8 15Z" />
          <path d="M8 15 C26 8 38 -6 36 -18 C22 -14 12 0 8 15Z" />
          <path d="M8 15 C-6 22 -18 34 -14 46 C0 40 8 26 8 15Z" />
          <path d="M8 15 C22 22 34 34 30 46 C16 40 8 26 8 15Z" />
          <path d="M8 15 C4 -2 8 -20 18 -30 C24 -16 20 2 8 15Z" />
        </g>
      </g>

      <g transform="translate(290 118)">
        <path d="M0 78 C-2 50 2 28 7 12" stroke="#146560" strokeWidth="4" fill="none" strokeLinecap="round" />
        <g fill="#3c7239">
          <path d="M7 12 C-8 6 -18 -5 -16 -15 C-5 -11 3 0 7 12Z" />
          <path d="M7 12 C22 6 32 -5 30 -15 C19 -11 11 0 7 12Z" />
          <path d="M7 12 C-5 18 -15 28 -12 38 C0 33 7 22 7 12Z" />
          <path d="M7 12 C19 18 29 28 26 38 C14 33 7 22 7 12Z" />
        </g>
      </g>

      <g stroke="#c13d1d" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M175 210 h30" />
        <path d="M178 210 v18 M186 210 v18 M194 210 v18 M202 210 v18" />
        <path d="M172 228 h36" />
      </g>
    </svg>
  );
}
