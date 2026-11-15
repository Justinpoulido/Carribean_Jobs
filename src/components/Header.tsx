"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/Doodles";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/employers", label: "Employers" },
  { href: "/resources", label: "Resources" },
  { href: "/tips", label: "Career Tips" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape, and stop the page behind scrolling while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 bg-cream/85 backdrop-blur-xl transition-[box-shadow,border-color] duration-300 ${
        stuck
          ? "border-b border-ocean/10 shadow-[0_4px_24px_rgb(6_48_58/0.07)]"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 py-3"
          aria-label="Caribbean Jobs — home"
        >
          <BrandMark className="h-10 w-10 text-sun transition-transform duration-500 ease-brand group-hover:-rotate-6 group-hover:scale-105" />
          <span className="leading-tight">
            <span className="block font-display text-[19px] font-bold tracking-tight text-ocean">
              Caribbean Jobs
            </span>
            <span className="hidden text-[11.5px] font-semibold text-teal-deep sm:block">
              Your Future. Our Caribbean.
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`group relative rounded-xl px-3 py-2 text-[15px] font-semibold transition-colors ${
                isActive(item.href)
                  ? "text-teal-deep"
                  : "text-ocean hover:text-teal-deep"
              }`}
            >
              {item.label}
              <span
                className={`absolute inset-x-3 bottom-1 h-[2.5px] origin-left rounded-full bg-sun transition-transform duration-300 ease-brand ${
                  isActive(item.href)
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/post-job"
            className="hidden rounded-full bg-sun px-5 py-2.5 text-[15px] font-bold text-ocean shadow-[0_4px_0_var(--color-sun-deep)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--color-sun-deep)] active:translate-y-0 active:shadow-[0_2px_0_var(--color-sun-deep)] sm:inline-flex"
          >
            Post a Job
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ocean/15 bg-white text-ocean transition-colors hover:border-ocean/35 lg:hidden"
          >
            <span
              className={`absolute h-[2.5px] w-5 rounded-full bg-current transition-transform duration-300 ease-brand ${
                open ? "rotate-45" : "-translate-y-[7px]"
              }`}
            />
            <span
              className={`absolute h-[2.5px] w-5 rounded-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-[2.5px] w-5 rounded-full bg-current transition-transform duration-300 ease-brand ${
                open ? "-rotate-45" : "translate-y-[7px]"
              }`}
            />
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-ocean/10 bg-cream lg:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col px-4 pb-6 pt-2 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`border-b border-ocean/10 py-3.5 text-[17px] font-semibold ${
                  isActive(item.href) ? "text-teal-deep" : "text-ocean"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/post-job"
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-6 font-bold text-ocean shadow-[0_4px_0_var(--color-sun-deep)]"
            >
              Post a Job
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
