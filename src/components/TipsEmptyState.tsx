import Link from "next/link";
import { CompassDoodle } from "@/components/Doodles";

export function TipsEmptyState() {
  return (
    <div className="rounded-brand-lg border-2 border-dashed border-ocean/20 bg-white px-6 py-14 text-center">
      <CompassDoodle
        className="mx-auto h-16 w-16 text-turq animate-float"
        strokeWidth={4}
      />
      <p className="mt-5 font-display text-[22px] font-bold text-ocean">
        No career tips yet
      </p>
      <p className="mx-auto mt-2 max-w-xl leading-7 text-ink-soft">
        Check back soon — or go straight to the openings.
      </p>
      <Link
        href="/jobs"
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-ocean px-7 font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
      >
        Browse open jobs
      </Link>
    </div>
  );
}
