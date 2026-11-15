"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { categories, countries } from "@/data/jobs";

const fieldClass =
  "min-h-13 w-full rounded-xl border-2 border-ocean/12 bg-cream px-4 py-3 text-[16px] font-medium text-ink outline-none transition-all duration-200 focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/15";

const labelClass =
  "text-[11.5px] font-bold uppercase tracking-[0.08em] text-teal-deep";

export function SearchBar() {
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    const params = new URLSearchParams();
    ["q", "country", "category"].forEach((key) => {
      const value = String(formData.get(key) || "").trim();
      if (value) {
        params.set(key, value);
      }
    });
    const query = params.toString();
    router.push(query ? `/jobs?${query}` : "/jobs");
  }

  return (
    <div className="relative">
      {/* hand-drawn offset frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -rotate-[1.1deg] rounded-brand-lg border-2 border-sun/60"
      />
      <form
        action={handleSubmit}
        className="relative grid gap-3 rounded-brand-lg bg-white p-5 shadow-[0_24px_60px_rgb(6_48_58/0.16)] md:grid-cols-[1.5fr_1fr_1fr_auto]"
      >
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className={labelClass} htmlFor="q">
            What
          </label>
          <input
            id="q"
            name="q"
            placeholder="Job title, company, or keyword"
            className={fieldClass}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <label className={labelClass} htmlFor="country">
            Where
          </label>
          <select id="country" name="country" className={fieldClass} defaultValue="">
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <label className={labelClass} htmlFor="category">
            Field
          </label>
          <select id="category" name="category" className={fieldClass} defaultValue="">
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex min-h-13 items-center justify-center gap-2 self-end rounded-xl bg-ocean px-7 font-bold text-white transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-ocean-2 hover:shadow-[0_12px_28px_rgb(6_48_58/0.28)]"
        >
          <Search size={18} aria-hidden="true" />
          Search
        </button>
      </form>
    </div>
  );
}
