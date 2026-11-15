"use client";

import { useMemo, useState, type ReactNode } from "react";
import { JobCard } from "./JobCard";
import { categories, countries, jobTypes, workModes } from "@/data/jobs";
import { countriesMatch, type PublicJob } from "@/lib/public-jobs";
import { CompassDoodle } from "@/components/Doodles";

const fieldClass =
  "min-h-12 rounded-xl border-2 border-ocean/12 bg-cream px-4 py-3 text-[15px] font-medium text-ink outline-none transition-all duration-200 focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal/15";

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

  const hasFilters = Object.values(filters).some((value) => value !== "");

  function clearFilters() {
    setVisibleCount(8);
    setFilters({
      q: "",
      company: "",
      country: "",
      category: "",
      salary: "",
      workMode: "",
      jobType: "",
      location: "",
    });
  }

  function updateFilter(key: keyof typeof filters, value: string) {
    setVisibleCount(8);
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[310px_1fr]">
      <form
        className="h-fit rounded-brand-lg border-2 border-ocean/10 bg-white p-6 lg:sticky lg:top-24"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-[19px] font-bold text-ocean">
            Filter jobs
          </h2>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full px-3 py-1.5 text-[13.5px] font-bold text-teal-deep transition-colors hover:bg-turq-soft"
            >
              Clear all
            </button>
          ) : null}
        </div>
        <div className="mt-6 grid gap-4">
          <Filter label="Keyword">
            <input
              value={filters.q}
              onChange={(event) => updateFilter("q", event.target.value)}
              placeholder="Title or keyword"
              className={fieldClass}
            />
          </Filter>
          <Filter label="Company">
            <input
              value={filters.company}
              onChange={(event) => updateFilter("company", event.target.value)}
              placeholder="Company"
              className={fieldClass}
            />
          </Filter>
          <Filter label="Location">
            <input
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
              placeholder="Town or city"
              className={fieldClass}
            />
          </Filter>
          <Filter label="Country">
            <select
              value={filters.country}
              onChange={(event) => updateFilter("country", event.target.value)}
              className={fieldClass}
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
              className={fieldClass}
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
              className={fieldClass}
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
              className={fieldClass}
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
              className={fieldClass}
            />
          </Filter>
        </div>
      </form>

      <section>
        <div className="mb-7">
          <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em] text-teal-deep">
            <span className="h-[2.5px] w-7 rounded-full bg-sun" />
            {filteredJobs.length} open{" "}
            {filteredJobs.length === 1 ? "role" : "roles"}
          </p>
          <h2 className="mt-2.5 font-display text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold text-ocean">
            Jobs across the Caribbean
          </h2>
        </div>
        <div className="grid gap-5">
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        {visibleJobs.length < filteredJobs.length ? (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 8)}
            className="mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-full border-2 border-ocean px-6 font-bold text-ocean transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:bg-ocean hover:text-white"
          >
            Load more jobs
          </button>
        ) : null}
        {filteredJobs.length === 0 ? (
          <div className="rounded-brand-lg border-2 border-dashed border-ocean/20 bg-white px-6 py-14 text-center">
            <CompassDoodle
              className="mx-auto h-16 w-16 text-turq animate-float"
              strokeWidth={4}
            />
            <h2 className="mt-5 font-display text-[22px] font-bold text-ocean">
              No matching jobs
            </h2>
            <p className="mx-auto mt-2 max-w-md leading-7 text-ink-soft">
              Try another keyword, company, or location — or clear the filters
              to see everything on the board.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-ocean px-7 font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Clear filters
            </button>
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
    <label className="grid gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-teal-deep">
      {label}
      {children}
    </label>
  );
}
