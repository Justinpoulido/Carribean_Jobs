"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { categories, countries } from "@/data/jobs";

export function SearchBar() {
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    const params = new URLSearchParams();
    ["keyword", "country", "category"].forEach((key) => {
      const value = String(formData.get(key) || "");
      if (value) {
        params.set(key, value);
      }
    });
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form
      action={handleSubmit}
      className="grid gap-3 rounded-lg bg-white p-3 shadow-xl ring-1 ring-slate-200 md:grid-cols-[1.4fr_1fr_1fr_auto]"
    >
      <label className="sr-only" htmlFor="keyword">
        Keyword
      </label>
      <input
        id="keyword"
        name="keyword"
        placeholder="Job title, company, or keyword"
        className="min-h-12 rounded-lg border border-slate-200 px-4 text-slate-900 outline-none focus:border-[#0077b6]"
      />
      <label className="sr-only" htmlFor="country">
        Country
      </label>
      <select
        id="country"
        name="country"
        className="min-h-12 rounded-lg border border-slate-200 px-4 text-slate-900 outline-none focus:border-[#0077b6]"
        defaultValue=""
      >
        <option value="">All countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="category">
        Category
      </label>
      <select
        id="category"
        name="category"
        className="min-h-12 rounded-lg border border-slate-200 px-4 text-slate-900 outline-none focus:border-[#0077b6]"
        defaultValue=""
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0077b6] px-5 font-bold text-white transition hover:bg-[#005f8f]">
        <Search size={18} aria-hidden="true" />
        Search
      </button>
    </form>
  );
}
