"use client";

import { useMemo, useState, type ReactNode } from "react";
import { JobCard } from "./JobCard";
import { categories, countries, jobTypes, workModes } from "@/data/jobs";
import { countriesMatch, type PublicJob } from "@/lib/public-jobs";

export function JobsExplorer({
  jobs,
  initialFilters,
}: {
  jobs: PublicJob[];
  initialFilters: Record<string, string>;
}) {
  const [visibleCount, setVisibleCount] = useState(8);
  const [filters, setFilters] = useState({
    q: initialFilters.q || initialFilters.keyword || "",
    company: initialFilters.company || "",
    country: initialFilters.country || "",
    category: initialFilters.category || "",
    salary: initialFilters.salary || "",
    workMode: initialFilters.work_mode || "",
    jobType: initialFilters.job_type || "",
    location: initialFilters.location || "",
  });

  const filteredJobs = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const company = filters.company.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();
    const salary = Number(filters.salary);

    return jobs.filter((job) => {
      const haystack = [
        job.title,
        job.companyName,
        job.city,
        job.country,
        job.category,
        job.description,
      ]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesCompany =
        !company || job.companyName.toLowerCase().includes(company);
      const matchesLocation =
        !location || `${job.city} ${job.country}`.toLowerCase().includes(location);
      const matchesCountry =
        !filters.country || countriesMatch(job.country, filters.country);
      const matchesCategory =
        !filters.category ||
        job.category.toLowerCase() === filters.category.toLowerCase();
      const matchesType = !filters.jobType || job.jobType === filters.jobType;
      const matchesMode = !filters.workMode || job.workMode === filters.workMode;
      const ceiling = job.salaryMax ?? job.salaryMin;
      const matchesSalary =
        !filters.salary || (ceiling != null && ceiling >= salary);

      return (
        matchesQuery &&
        matchesCompany &&
        matchesLocation &&
        matchesCountry &&
        matchesCategory &&
        matchesType &&
        matchesMode &&
        matchesSalary
      );
    });
  }, [filters, jobs]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  function updateFilter(key: keyof typeof filters, value: string) {
    setVisibleCount(8);
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <form
        className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={(event) => event.preventDefault()}
      >
        <h2 className="text-lg font-bold text-slate-950">Search jobs</h2>
        <div className="mt-5 grid gap-4">
          <Filter label="Keyword">
            <input
              value={filters.q}
              onChange={(event) => updateFilter("q", event.target.value)}
              placeholder="Title or keyword"
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            />
          </Filter>
          <Filter label="Company">
            <input
              value={filters.company}
              onChange={(event) => updateFilter("company", event.target.value)}
              placeholder="Company"
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            />
          </Filter>
          <Filter label="Location">
            <input
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
              placeholder="Town or city"
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            />
          </Filter>
          <Filter label="Country">
            <select
              value={filters.country}
              onChange={(event) => updateFilter("country", event.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            >
              <option value="">All countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </Filter>
          <Filter label="Category">
            <select
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Filter>
          <Filter label="Job type">
            <select
              value={filters.jobType}
              onChange={(event) => updateFilter("jobType", event.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            >
              <option value="">All job types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Filter>
          <Filter label="Work mode">
            <select
              value={filters.workMode}
              onChange={(event) => updateFilter("workMode", event.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            >
              <option value="">All</option>
              {workModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </Filter>
          <Filter label="Minimum salary">
            <input
              value={filters.salary}
              onChange={(event) => updateFilter("salary", event.target.value)}
              type="number"
              min="0"
              placeholder="Minimum salary"
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            />
          </Filter>
        </div>
      </form>

      <section>
        <div className="mb-5">
          <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
            {filteredJobs.length} open {filteredJobs.length === 1 ? "role" : "roles"}
          </p>
          <h2 className="text-3xl font-bold text-slate-950">
            Jobs across the Caribbean
          </h2>
        </div>
        <div className="grid gap-4">
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        {visibleJobs.length < filteredJobs.length ? (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 8)}
            className="mt-6 w-full rounded-lg border border-[#0077b6] px-5 py-3 font-bold text-[#0077b6] transition hover:bg-[#e0f2fe]"
          >
            Load more jobs
          </button>
        ) : null}
        {filteredJobs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-slate-950">No matching jobs</h2>
            <p className="mt-2 text-slate-600">
              Try another keyword, company, or location.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Filter({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}
