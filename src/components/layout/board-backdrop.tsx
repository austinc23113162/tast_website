export function BoardBackdrop() {
  return (
    <div
      className="board-backdrop pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="size-full min-h-full"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary/20"
        >
          <path d="M70 90c40-30 90 10 70 50-25 48-95 20-70-20" strokeWidth="2.2" />
          <path d="M980 80l18 52 54 8-44 32 12 54-40-30-40 30 12-54-44-32 54-8z" strokeWidth="1.6" />
          <path d="M1080 220c30 8 48 40 20 62" strokeWidth="2" />
          <path d="M140 760c80 20 120-40 190-10" strokeWidth="1.8" />
          <path d="M820 720c-10 40 30 70 70 40 28-22 8-70-28-62" strokeWidth="2" />
          <path d="M430 70c90 8 70 70-10 62" strokeWidth="1.7" />
          <path d="M60 430c12-40 70-30 78 12-6 36-62 40-78-12z" strokeWidth="1.8" />
          <path d="M1120 500c-50 30-20 90 30 70" strokeWidth="2.1" />
          <path d="M300 820l40-18 12 42" strokeWidth="1.7" />
          <path d="M700 120c40-20 90-10 110 30" strokeWidth="1.5" />
          <path d="M200 200c-8 24 18 40 36 18" strokeWidth="1.6" />
          <path d="M900 840c60-10 90 30 40 55" strokeWidth="1.8" />
          <path d="M520 780c0 0 40-50 90-20 30 18 10 50-20 48" strokeWidth="1.6" />
          <circle cx="1050" cy="640" r="22" strokeWidth="1.5" />
          <path d="M1042 640h16M1050 632v16" strokeWidth="1.4" />
          <path d="M160 560c40 0 40 28 80 28 40 0 40-28 80-28" strokeWidth="1.5" />
          <path d="M740 430c18-34 70-28 78 8" strokeWidth="1.7" />
          <path
            d="M390 300c8-22 38-22 46 0 6 18-12 30-23 42-11-12-29-24-23-42z"
            strokeWidth="1.6"
          />
        </g>
        <g className="font-heading text-primary/15">
          <text
            x="86"
            y="640"
            fontSize="28"
            fill="currentColor"
            fontFamily="var(--font-heading), cursive"
            transform="rotate(-8 86 640)"
          >
            hello
          </text>
          <text
            x="860"
            y="380"
            fontSize="22"
            fill="currentColor"
            fontFamily="var(--font-heading), cursive"
            transform="rotate(6 860 380)"
          >
            TAST
          </text>
          <text
            x="1000"
            y="130"
            fontSize="18"
            fill="currentColor"
            transform="rotate(-12 1000 130)"
          >
            *
          </text>
        </g>
      </svg>
    </div>
  );
}
