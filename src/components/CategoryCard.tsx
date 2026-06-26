import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";

export function CategoryCard({ category }: { category: string }) {
  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category)}`}
      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0077b6] hover:shadow-md"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0fdf4] text-[#059669]">
          <BriefcaseBusiness size={18} aria-hidden="true" />
        </span>
        <span className="font-bold text-slate-950">{category}</span>
      </span>
      <ArrowRight size={18} className="text-slate-400" aria-hidden="true" />
    </Link>
  );
}
