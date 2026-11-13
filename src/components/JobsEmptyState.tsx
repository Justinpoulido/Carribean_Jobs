import Link from "next/link";

export function JobsEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
        Jobs board
      </p>
      <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-slate-600">
        <Link
          href="/post-job"
          className="font-bold text-[#0077b6] underline decoration-[#0077b6]/30 underline-offset-4"
        >
          No open roles yet — employers, post a vacancy
        </Link>
      </p>
    </div>
  );
}
