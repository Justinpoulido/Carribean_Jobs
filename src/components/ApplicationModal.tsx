"use client";

import { useActionState, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { submitApplication } from "@/app/actions";
import { countries } from "@/data/jobs";
import { resumeFileProblem } from "@/lib/resume-file";
import { SubmitButton } from "./FormStatus";

export function ApplicationModal({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [fileError, setFileError] = useState("");
  const [state, formAction] = useActionState(submitApplication, {
    ok: false,
    message: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const input = event.currentTarget.elements.namedItem("resume");
    const file = input instanceof HTMLInputElement ? input.files?.[0] : undefined;
    if (!file) {
      return;
    }
    const problem = resumeFileProblem(file);
    if (problem) {
      event.preventDefault();
      setFileError(problem);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-lg bg-[#f59e0b] px-5 py-3 font-bold text-slate-950 shadow-sm transition hover:bg-[#fbbf24]"
      >
        Apply now
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#0077b6]">
                  One-click apply
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {jobTitle}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
                aria-label="Close application form"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <form action={formAction} onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <input type="hidden" name="job_id" value={jobId} />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  name="full_name"
                  placeholder="Full name"
                  className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
                />
                <input
                  name="phone"
                  placeholder="Phone"
                  className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
                />
                <select
                  name="country"
                  required
                  className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Country
                  </option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Resume upload
                <input
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setFileError(file ? resumeFileProblem(file) ?? "" : "");
                  }}
                  className="rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm"
                />
                <span className="font-normal text-slate-500">
                  PDF, DOC, or DOCX. 5 MB maximum.
                </span>
              </label>
              {fileError ? (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {fileError}
                </p>
              ) : null}
              <textarea
                name="message"
                rows={4}
                placeholder="Short message"
                className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#0077b6]"
              />
              {state.message ? (
                <p
                  className={`rounded-lg px-4 py-3 text-sm font-semibold ${
                    state.ok
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {state.message}
                </p>
              ) : null}
              <SubmitButton
                pendingText="Submitting application..."
                className="rounded-lg bg-[#0077b6] px-5 py-3 font-bold text-white transition hover:bg-[#005f8f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Submit application
              </SubmitButton>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
