import Link from "next/link";
import { Mail, Share2 } from "lucide-react";
import { countries } from "@/data/jobs";
import { contactEmail, facebookPageUrl } from "@/lib/site";
import { BrandMark, SunDoodle, WaveDivider } from "@/components/Doodles";

const quickLinks = [
  ["Jobs", "/jobs"],
  ["Employers", "/employers"],
  ["Resources", "/resources"],
  ["Career tips", "/tips"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Footer() {
  return (
    <footer className="relative mt-24 bg-ocean text-white">
      {/* waves rolling into the footer */}
      <div className="absolute -top-[69px] left-0 w-full overflow-hidden sm:-top-[89px]">
        <WaveDivider topColor="text-ocean" />
      </div>

      <SunDoodle
        className="pointer-events-none absolute right-6 top-16 h-36 w-36 text-sun opacity-10 animate-spin-slow"
        strokeWidth={3}
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-11 w-11 text-sun" />
            <span className="font-display text-xl font-bold">Caribbean Jobs</span>
          </div>
          <p className="mt-4 leading-7 text-white/70">
            Your Future. Our Caribbean. One Opportunity at a Time.
          </p>
          <a
            href={`mailto:${contactEmail()}`}
            className="mt-5 inline-flex items-center gap-2 font-semibold text-sun transition-colors hover:text-white"
          >
            <Mail size={17} aria-hidden="true" />
            {contactEmail()}
          </a>
        </div>

        <div>
          <h3 className="font-display text-[17px] font-bold">Quick links</h3>
          <ul className="mt-4 space-y-1.5">
            {quickLinks.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block py-1 text-white/70 transition-colors hover:text-sun"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-[17px] font-bold">Countries</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1">
            {countries.slice(0, 8).map((country) => (
              <li key={country}>
                <Link
                  href={`/jobs?country=${encodeURIComponent(country)}`}
                  className="inline-block py-1 text-white/70 transition-colors hover:text-sun"
                >
                  {country}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-[17px] font-bold">Employers</h3>
          <p className="mt-4 leading-7 text-white/70">
            Promote vacancies, reach active candidates, and receive applications
            from across the region.
          </p>
          <Link
            href="/post-job"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-sun px-6 font-bold text-ocean transition-transform duration-200 hover:-translate-y-0.5"
          >
            Post a Job
          </Link>
          <a
            href={facebookPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 font-semibold text-sun transition-colors hover:text-white"
          >
            <Share2 size={17} aria-hidden="true" />
            Follow on Facebook
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-4 py-5 text-center text-[13.5px] text-white/60">
        © 2026 Caribbean Jobs. Built for Caribbean talent and employers.
      </div>
    </footer>
  );
}
