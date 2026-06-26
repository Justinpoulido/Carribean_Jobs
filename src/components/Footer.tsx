import Link from "next/link";
import { Globe2, Mail, Share2, Users } from "lucide-react";
import { countries } from "@/data/jobs";

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
            href="mailto:hello@caribbeanjobs.com"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#fbbf24]"
          >
            <Mail size={16} aria-hidden="true" />
            hello@caribbeanjobs.com
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
              <li key={country}>{country}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Employers</h3>
          <p className="mt-4 text-sm leading-6 text-blue-100">
            Promote vacancies, reach active candidates, and receive applications
            from across the region.
          </p>
          <div className="mt-5 flex gap-3 text-blue-100">
            <a href="#" aria-label="Social profile" className="hover:text-white">
              <Share2 size={20} />
            </a>
            <a href="#" aria-label="Community" className="hover:text-white">
              <Users size={20} />
            </a>
            <a href="#" aria-label="Website" className="hover:text-white">
              <Globe2 size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-blue-100">
        © 2026 Caribbean Jobs. Built for Caribbean talent and employers.
      </div>
    </footer>
  );
}
