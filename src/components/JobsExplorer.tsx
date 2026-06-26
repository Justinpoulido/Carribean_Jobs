"use client";

import { useMemo, useState } from "react";
import { JobCard } from "./JobCard";
import { categories, countries, jobTypes, workModes } from "@/data/jobs";
import type { Job } from "@/lib/types";

export function JobsExplorer({
  jobs,
  initialFilters,
}: {
  jobs: Job[];
  initialFilters: Record<string, string>;
}) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [filters, setFilters] = useState({
    keyword: initialFilters.keyword || "",
    country: initialFilters.country || "",
    city: initialFilters.city || "",
    category: initialFilters.category || "",
    job_type: initialFilters.job_type || "",
    salary: initialFilters.salary || "",
    work_mode: initialFilters.work_mode || "",
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keyword = filters.keyword.toLowerCase();
      const matchesKeyword =
        !keyword ||
        [job.title, job.company_name, job.description, job.category]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesSalary =
        !filters.salary || job.salary_max >= Number(filters.salary);

      return (
        matchesKeyword &&
        (!filters.country || job.country === filters.country) &&
        (!filters.city ||
          job.city.toLowerCase().includes(filters.city.toLowerCase())) &&
        (!filters.category || job.category === filters.category) &&
        (!filters.job_type || job.job_type === filters.job_type) &&
        (!filters.work_mode || job.work_mode === filters.work_mode) &&
        matchesSalary
      );
    });
  }, [filters, jobs]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  function updateFilter(key: keyof typeof filters, value: string) {
    setVisibleCount(4);
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Search and filter</h2>
        <div className="mt-5 grid gap-4">
          <input
            value={filters.keyword}
            onChange={(event) => updateFilter("keyword", event.target.value)}
            placeholder="Keyword or company"
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
          />
          <select
            value={filters.country}
            onChange={(event) => updateFilter("country", event.target.value)}
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <input
            value={filters.city}
            onChange={(event) => updateFilter("city", event.target.value)}
            placeholder="City"
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
          />
          <select
            value={filters.category}
            onChange={(event) => updateFilter("category", event.target.value)}
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filters.job_type}
            onChange={(event) => updateFilter("job_type", event.target.value)}
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
          >
            <option value="">All job types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            value={filters.salary}
            onChange={(event) => updateFilter("salary", event.target.value)}
            type="number"
            min="0"
            placeholder="Minimum salary"
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
          />
          <select
            value={filters.work_mode}
            onChange={(event) => updateFilter("work_mode", event.target.value)}
            className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
          >
            <option value="">Remote / On-site / Hybrid</option>
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              {filteredJobs.length} open roles
            </p>
            <h1 className="text-3xl font-bold text-slate-950">
              Jobs across the Caribbean
            </h1>
          </div>
          <p className="text-sm text-slate-500">Updated with sample listings</p>
        </div>
        <div className="grid gap-4">
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        {visibleJobs.length < filteredJobs.length ? (
          <button
            onClick={() => setVisibleCount((count) => count + 4)}
            className="mt-6 w-full rounded-lg border border-[#0077b6] px-5 py-3 font-bold text-[#0077b6] transition hover:bg-[#e0f2fe]"
          >
            Load more jobs
          </button>
        ) : null}
        {filteredJobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              No matching jobs yet
            </h2>
            <p className="mt-2 text-slate-600">
              Try another country, category, or keyword.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
