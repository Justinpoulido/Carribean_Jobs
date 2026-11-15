import Link from "next/link";
import { PalmDoodle } from "@/components/Doodles";

/** Accent stripe per island, loosely drawn from each flag's palette. */
const countryAccent: Record<string, string> = {
  "Trinidad & Tobago": "from-[#DA1A35] via-[#111111] to-[#DA1A35]",
  Jamaica: "from-[#009B3A] via-[#FED100] to-[#111111]",
  Barbados: "from-[#00267F] via-[#FFC726] to-[#00267F]",
  Guyana: "from-[#009E49] via-[#FCD116] to-[#CE1126]",
  Grenada: "from-[#CE1126] via-[#FCD116] to-[#007A5E]",
  "St. Lucia": "from-[#6CF] via-[#FCD116] to-[#111111]",
  Bahamas: "from-[#00ABC9] via-[#FAE042] to-[#111111]",
  Belize: "from-[#003F87] via-[#CE1126] to-[#003F87]",
};

export function CountryCard({ country }: { country: string }) {
  return (
    <Link
      href={`/jobs?country=${encodeURIComponent(country)}`}
      className="group relative block overflow-hidden rounded-brand border-2 border-ocean/10 bg-white p-5 transition-all duration-300 ease-brand hover:-translate-y-1.5 hover:border-ocean/20 hover:shadow-[0_18px_40px_rgb(6_48_58/0.14)]"
    >
      <PalmDoodle
        className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 text-turq opacity-0 transition-all duration-500 ease-brand group-hover:rotate-6 group-hover:opacity-30"
        strokeWidth={5}
      />
      <span
        aria-hidden="true"
        className={`block h-2 w-14 rounded-full bg-gradient-to-r transition-all duration-300 ease-brand group-hover:w-full ${
          countryAccent[country] || "from-teal to-turq"
        }`}
      />
      <h3 className="mt-5 font-display text-[19px] font-bold text-ocean">
        {country}
      </h3>
      <p className="mt-1 text-[14.5px] font-medium text-ink-soft transition-colors group-hover:text-teal-deep">
        Explore open roles →
      </p>
    </Link>
  );
}
