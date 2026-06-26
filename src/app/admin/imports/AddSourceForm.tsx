"use client";

import { useActionState } from "react";
import { addJobSource } from "./actions";
import { SubmitButton } from "@/components/FormStatus";
import { countries } from "@/data/jobs";

const sourceTypes = ["api", "ats", "rss", "scraper", "manual"];
const sectors = [
  "",
  "Finance",
  "IT",
  "Energy",
  "Education",
  "Healthcare",
  "Management",
  "Sales",
];

export function AddSourceForm() {
  const [state, formAction] = useActionState(addJobSource, {
    ok: false,
    message: "",
  });

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-950">Add job source</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add approved APIs, ATS feeds, RSS feeds, or public company career
          pages.
        </p>
      </div>
      <input name="admin_secret" type="password" placeholder="Admin secret" className="field" />
      <input required name="name" placeholder="Source name" className="field" />
      <select required name="source_type" defaultValue="" className="field">
        <option value="" disabled>
          Source type
        </option>
        {sourceTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <input required name="base_url" type="url" placeholder="Base URL" className="field" />
      <select required name="country" defaultValue="" className="field">
        <option value="" disabled>
          Country
        </option>
        {countries.map((country) => (
          <option key={country}>{country}</option>
        ))}
      </select>
      <select name="sector" defaultValue="" className="field">
        {sectors.map((sector) => (
          <option key={sector || "auto"} value={sector}>
            {sector || "Auto categorize"}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        <input name="is_active" type="checkbox" defaultChecked className="h-5 w-5 accent-[#0077b6]" />
        Active
      </label>
      <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        <input name="trusted_auto_publish" type="checkbox" className="h-5 w-5 accent-[#0077b6]" />
        Trusted auto publish
      </label>
      {state.message ? (
        <p
          className={`rounded-lg px-4 py-3 text-sm font-semibold ${
            state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
      <SubmitButton
        pendingText="Adding source..."
        className="rounded-lg bg-[#0077b6] px-5 py-3 font-bold text-white disabled:opacity-70"
      >
        Add source
      </SubmitButton>
    </form>
  );
}
