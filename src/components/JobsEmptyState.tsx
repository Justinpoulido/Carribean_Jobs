import Link from "next/link";
import { BoatDoodle } from "@/components/Doodles";

export function JobsEmptyState() {
  return (
    <div className="rounded-brand-lg border-2 border-dashed border-ocean/20 bg-white px-6 py-14 text-center">
      <BoatDoodle
        className="mx-auto h-16 w-16 text-turq animate-bob"
        strokeWidth={4}
      />
      <p className="mt-5 font-display text-[22px] font-bold text-ocean">
        No open roles yet
      </p>
      <p className="mx-auto mt-2 max-w-xl leading-7 text-ink-soft">
        The board is quiet right now. Employers — this is a good moment to get
        seen.
      </p>
      <Link
        href="/post-job"
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-7 font-bold text-ocean shadow-[0_4px_0_var(--color-sun-deep)] transition-transform duration-200 hover:-translate-y-0.5"
      >
        Post a vacancy
      </Link>
    </div>
  );
}
