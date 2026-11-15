import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { formatJobDate } from "@/lib/public-jobs";
import type { Tip } from "@/lib/tips";

export function TipCard({ tip }: { tip: Tip }) {
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-[#c2410c]">
          <Lightbulb size={18} aria-hidden="true" />
        </span>
        <span className="rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-bold text-[#0369a1]">
          {tip.category}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug text-slate-950 group-hover:text-[#0077b6]">
        <Link href={`/tips/${tip.slug}`} className="after:absolute after:inset-0">
          {tip.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 leading-7 text-slate-600">{tip.excerpt}</p>
      <div className="mt-5 flex items-center justify-between text-sm">
        <time dateTime={tip.publishedAt} className="text-slate-500">
          {formatJobDate(tip.publishedAt)}
        </time>
        <span className="inline-flex items-center gap-1 font-bold text-[#0077b6]">
          Read tip
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
