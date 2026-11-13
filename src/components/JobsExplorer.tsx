"use client";

import { useMemo, useState } from "react";
import { JobCard } from "./JobCard";
import { countries } from "@/data/jobs";
import {
  JOB_TYPES,
  countriesMatch,
  jobTypeLabel,
  type ListedJob,
} from "@/lib/board-jobs";

export function JobsExplorer({
  jobs,
  initialFilters,
}: {
  jobs: ListedJob[];
  initialFilters: Record<string, string>;
}) {
  const [visibleCount, setVisibleCount] = useState(8);
  const [filters, setFilters] = useState({
    keyword: initialFilters.keyword || "",
    employer: initialFilters.employer || "",
    location: initialFilters.location || initialFilters.city || "",
    country: initialFilters.country || "",
    jobType: initialFilters.jobType || initialFilters.job_type || "",
  });

  const filteredJobs = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const employer = filters.employer.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();
    const country = filters.country.trim();

    return jobs.filter((job) => {
      const haystack = [
        job.title,
        job.employer,
        job.location,
        job.country,
        job.description,
        job.sourceName,
        job.salary,
        ...(job.highlights ?? []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesKeyword = !keyword || haystack.includes(keyword);
      const matchesEmployer =
        !employer || job.employer.toLowerCase().includes(employer);
      const matchesLocation =
        !location ||
        `${job.location} ${job.country}`.toLowerCase().includes(location);
      const matchesCountry = !country || countriesMatch(job.country, country);
      const matchesType = !filters.jobType || job.jobType === filters.jobType;

      return (
        matchesKeyword &&
        matchesEmployer &&
        matchesLocation &&
        matchesCountry &&
        matchesType
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
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Keyword
            <input
              value={filters.keyword}
              onChange={(event) => updateFilter("keyword", event.target.value)}
              placeholder="Title, employer, or keyword"
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Employer
            <input
              value={filters.employer}
              onChange={(event) => updateFilter("employer", event.target.value)}
              placeholder="Employer"
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Location
            <input
              value={filters.location}
              onChange={(event) => updateFilter("location", event.target.value)}
              placeholder="City or town"
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Country
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
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Job type
            <select
              value={filters.jobType}
              onChange={(event) => updateFilter("jobType", event.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0077b6]"
            >
              <option value="">All job types</option>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {jobTypeLabel(type)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
              {filteredJobs.length} open {filteredJobs.length === 1 ? "role" : "roles"}
            </p>
            <h2 className="text-3xl font-bold text-slate-950">
              Jobs across the Caribbean
            </h2>
          </div>
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
            <h2 className="text-xl font-bold text-slate-950">
              No matching jobs
            </h2>
            <p className="mt-2 text-slate-600">
              Try another keyword, employer, or location.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
