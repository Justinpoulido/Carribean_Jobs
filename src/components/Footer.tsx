import Link from "next/link";
import { Mail } from "lucide-react";
import { countries } from "@/data/jobs";
import { CONTACT_EMAIL } from "@/lib/site";

const quickLinks = [
  ["Jobs", "/jobs"],
  ["Employers", "/employers"],
  ["Resources", "/resources"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Footer() {
  return (
    <footer className="bg-[#06283d] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold">Caribbean Jobs</h2>
          <p className="mt-3 text-sm leading-6 text-blue-100">
            Your Future. Our Caribbean. One Opportunity at a Time.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#fbbf24]"
          >
            <Mail size={16} aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
        </div>
        <div>
          <h3 className="font-semibold">Quick links</h3>
          <ul className="mt-4 space-y-3 text-sm text-blue-100">
            {quickLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Countries</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-blue-100">
            {countries.slice(0, 8).map((country) => (
              <li key={country}>
                <Link
                  href={`/jobs?country=${encodeURIComponent(country)}`}
                  className="hover:text-white"
                >
                  {country}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Employers</h3>
          <p className="mt-4 text-sm leading-6 text-blue-100">
            Promote vacancies, reach active candidates, and receive applications
            from across the region.
          </p>
          <Link
            href="/post-job"
            className="mt-5 inline-flex rounded-lg bg-[#f59e0b] px-4 py-2 text-sm font-bold text-slate-950"
          >
            Post a job
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-blue-100">
        © 2026 Caribbean Jobs. Built for Caribbean talent and employers.
      </div>
    </footer>
  );
}
