import { facebookPageUrl } from "@/lib/site";

export function JobsEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
        Jobs board
      </p>
      <h2 className="mt-3 text-2xl font-bold text-slate-950">
        No open jobs right now
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-slate-600">
        New jobs are posted daily, follow us on{" "}
        <a
          href={facebookPageUrl}
          className="font-bold text-[#0077b6] underline decoration-[#0077b6]/30 underline-offset-4"
        >
          Facebook
        </a>
        .
      </p>
    </div>
  );
}
