import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CategoryCard({ category }: { category: string }) {
  return (
    <Link
      href={`/jobs?category=${encodeURIComponent(category)}`}
      className="group flex items-center justify-between gap-3 rounded-brand border-2 border-ocean/10 bg-white px-5 py-4 transition-all duration-300 ease-brand hover:-translate-y-1 hover:border-teal hover:shadow-[0_14px_30px_rgb(6_48_58/0.12)]"
    >
      <span className="font-display text-[17px] font-semibold text-ocean">
        {category}
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-turq-soft text-teal-deep transition-colors duration-300 group-hover:bg-sun group-hover:text-ocean">
        <ArrowUpRight size={17} aria-hidden="true" />
      </span>
    </Link>
  );
}
