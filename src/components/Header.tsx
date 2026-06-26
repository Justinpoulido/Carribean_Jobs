import Link from "next/link";
import { BriefcaseBusiness, Menu } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/employers", label: "Employers" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#073b5a] text-white">
            <BriefcaseBusiness size={22} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-950">
              Caribbean Jobs
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Your Future. Our Caribbean.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[#0077b6]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/post-job"
            className="rounded-lg bg-[#f59e0b] px-4 py-2 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-[#fbbf24]"
          >
            Post a Job
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
