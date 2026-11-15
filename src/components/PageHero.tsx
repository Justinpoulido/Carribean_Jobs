import { ReactNode } from "react";
import {
  DotsDoodle,
  SparkleDoodle,
  SquiggleDoodle,
  SunDoodle,
  WaveDivider,
} from "@/components/Doodles";

/**
 * Shared hero for inner pages: ocean band, doodles, and the wave that
 * hands off to the page body. Keeps every page consistent with the home
 * page without each one re-implementing the treatment.
 */
export function PageHero({
  kicker,
  title,
  lead,
  children,
  waveColor = "text-cream",
}: {
  kicker: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
  /** Colour of the wave, matching whatever section follows. */
  waveColor?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ocean text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_400px_at_80%_10%,rgba(14,124,123,0.5),transparent_66%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <SunDoodle
          className="absolute right-[7%] top-[14%] hidden h-28 w-28 text-sun opacity-50 animate-spin-slow sm:block"
          strokeWidth={3}
        />
        <SparkleDoodle
          className="absolute left-[3%] top-[26%] hidden h-7 w-7 text-turq opacity-50 animate-twinkle lg:block"
          strokeWidth={6}
        />
        <SquiggleDoodle
          className="absolute bottom-[26%] right-[22%] hidden h-8 w-32 text-turq opacity-30 lg:block"
          strokeWidth={5}
        />
        <DotsDoodle className="absolute bottom-[18%] left-[40%] hidden h-16 w-16 text-white opacity-10 xl:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
        <div data-reveal>
          <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-sun">
            <span className="h-[2.5px] w-7 rounded-full bg-sun" />
            {kicker}
          </p>
          <h1 className="mt-4 max-w-[17ch] text-[clamp(2.25rem,5.4vw,3.75rem)] font-bold leading-[1.05]">
            {title}
          </h1>
          {lead ? (
            <p className="mt-5 max-w-[58ch] text-[clamp(1rem,1.8vw,1.18rem)] leading-relaxed text-white/80">
              {lead}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <WaveDivider topColor={waveColor} />
      </div>
    </section>
  );
}
