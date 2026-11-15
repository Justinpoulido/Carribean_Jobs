/**
 * Hand-drawn doodle set for Caribbean Jobs.
 * Original artwork — plain stroked SVG paths, no external assets.
 * Every doodle inherits `currentColor` so it can be tinted with a text colour,
 * and is decorative by default (aria-hidden on the wrapper that places it).
 */

type DoodleProps = {
  className?: string;
  strokeWidth?: number;
};

const base = "overflow-visible";

export function SunDoodle({ className = "", strokeWidth = 4 }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="19" />
      <path d="M50 16V5M50 95V84M84 50h11M5 50h11M74.5 25.5l7.8-7.8M17.7 82.3l7.8-7.8M74.5 74.5l7.8 7.8M17.7 17.7l7.8 7.8" />
    </svg>
  );
}

export function WaveDoodle({ className = "", strokeWidth = 4 }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      <path d="M4 14q10-11 20 0t20 0t20 0t20 0t20 0" />
      <path d="M4 30q10-11 20 0t20 0t20 0t20 0t20 0" opacity="0.5" />
    </svg>
  );
}

export function PalmDoodle({ className = "", strokeWidth = 4 }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      <path d="M50 94c0-22 2-38 6-52" />
      <path d="M56 42c-10-9-23-11-33-4 11-3 21 0 28 7" />
      <path d="M56 42c2-13-3-25-14-31 7 9 9 19 7 28" />
      <path d="M56 42c11-8 24-7 33 2-11-2-21 1-27 8" />
      <path d="M56 42c8 2 14 8 17 16-7-6-14-9-21-9" />
    </svg>
  );
}

export function BoatDoodle({ className = "", strokeWidth = 4 }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      <path d="M16 68h68l-11 18H27z" />
      <path d="M50 64V16" />
      <path d="M54 20c12 5 20 12 24 21H54z" />
      <path d="M46 26c-9 4-15 10-18 17h18z" />
      <path d="M8 92q9-8 18 0t18 0t18 0t18 0" opacity="0.6" />
    </svg>
  );
}

export function SparkleDoodle({ className = "", strokeWidth = 4 }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      <path d="M50 10c3 22 18 37 40 40-22 3-37 18-40 40-3-22-18-37-40-40 22-3 37-18 40-40z" />
    </svg>
  );
}

export function ArrowDoodle({ className = "", strokeWidth = 4 }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      <path d="M6 42c22-30 62-40 106-26" />
      <path d="M96 4c6 5 11 9 16 12-6 4-10 9-13 16" />
    </svg>
  );
}

export function SquiggleDoodle({ className = "", strokeWidth = 4 }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 30"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      <path d="M4 16q14-16 28 0t28 0t28 0t28 0" />
    </svg>
  );
}

export function StarDoodle({ className = "", strokeWidth = 4 }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      <path d="M50 12l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z" />
    </svg>
  );
}

export function CompassDoodle({ className = "", strokeWidth = 4 }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="38" />
      <path d="M64 36L42 44l-6 20 22-8z" />
    </svg>
  );
}

export function DotsDoodle({ className = "" }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={`${base} ${className}`}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <circle key={`${row}-${col}`} cx={14 + col * 24} cy={14 + row * 24} r="4" />
        )),
      )}
    </svg>
  );
}

/** The hand-drawn underline used beneath headline words. */
export function UnderlineDoodle({ className = "" }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      className={`doodle-underline ${base} ${className}`}
      aria-hidden="true"
    >
      <path d="M6 16c54-9 112-12 170-8 42 3 80 6 118 2" />
    </svg>
  );
}

/** Full-width layered wave used as a section divider. */
export function WaveDivider({
  className = "",
  topColor = "text-cream",
}: {
  className?: string;
  topColor?: string;
}) {
  return (
    <div className={`pointer-events-none relative leading-[0] ${className}`} aria-hidden="true">
      <div className={`w-[200%] animate-wave-slow ${topColor} opacity-50`}>
        <svg viewBox="0 0 2400 90" fill="currentColor" className="h-[70px] w-full sm:h-[90px]">
          <path d="M0 46q150-46 300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0V90H0z" />
        </svg>
      </div>
      <div className={`absolute inset-0 w-[200%] animate-wave ${topColor}`}>
        <svg viewBox="0 0 2400 90" fill="currentColor" className="h-[70px] w-full sm:h-[90px]">
          <path d="M0 60q150-40 300 0t300 0t300 0t300 0t300 0t300 0t300 0t300 0V90H0z" />
        </svg>
      </div>
    </div>
  );
}

/** The brand mark: a briefcase holding a sunrise over the sea. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <clipPath id="cj-brand-clip">
          <rect x="22" y="64" width="156" height="112" rx="20" />
        </clipPath>
      </defs>
      <path
        d="M72 64V48a12 12 0 0 1 12-12h32a12 12 0 0 1 12 12v16"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <g clipPath="url(#cj-brand-clip)">
        <rect x="22" y="64" width="156" height="112" className="fill-turq" />
        <circle cx="100" cy="136" r="40" className="fill-sun" />
        <path d="M22 132q19.5-14 39 0t39 0t39 0t39 0V176H22Z" className="fill-teal" />
        <path d="M22 154q19.5-14 39 0t39 0t39 0t39 0V176H22Z" className="fill-ocean" />
      </g>
    </svg>
  );
}
