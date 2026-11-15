import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatJobDate } from "@/lib/public-jobs";
import type { Tip } from "@/lib/tips";
import { SparkleDoodle } from "@/components/Doodles";

export function TipCard({ tip }: { tip: Tip }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-brand border-2 border-ocean/10 bg-white p-6 transition-all duration-300 ease-brand hover:-translate-y-1.5 hover:border-teal/40 hover:shadow-[0_18px_40px_rgb(6_48_58/0.13)]">
      <SparkleDoodle
        className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 text-sun opacity-0 transition-opacity duration-500 group-hover:opacity-25"
        strokeWidth={6}
      />
      <span className="inline-flex w-fit items-center rounded-full bg-turq-soft px-3 py-1 text-[11.5px] font-bold text-teal-deep">
        {tip.category}
      </span>
      <h3 className="mt-4 font-display text-[20px] font-bold leading-snug text-ocean transition-colors group-hover:text-teal-deep">
        <Link href={`/tips/${tip.slug}`} className="after:absolute after:inset-0">
          {tip.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 leading-7 text-ink-soft">{tip.excerpt}</p>
      <div className="mt-6 flex items-center justify-between text-[14.5px]">
        <time dateTime={tip.publishedAt} className="font-medium text-ink-soft">
          {formatJobDate(tip.publishedAt)}
        </time>
        <span className="inline-flex items-center gap-1.5 font-bold text-teal-deep">
          Read tip
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-brand group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
}
