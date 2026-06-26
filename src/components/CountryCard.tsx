import Link from "next/link";
import { MapPin } from "lucide-react";

const countryAccent: Record<string, string> = {
  "Trinidad & Tobago": "from-red-500 to-slate-900",
  Jamaica: "from-green-600 to-yellow-400",
  Barbados: "from-blue-600 to-yellow-400",
  Guyana: "from-green-600 to-red-500",
  Grenada: "from-red-500 to-yellow-400",
  "St. Lucia": "from-sky-500 to-yellow-300",
  Bahamas: "from-cyan-500 to-yellow-300",
  Belize: "from-blue-700 to-red-500",
};

export function CountryCard({ country }: { country: string }) {
  return (
    <Link
      href={`/jobs?country=${encodeURIComponent(country)}`}
      className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        className={`block h-2 rounded-full bg-gradient-to-r ${
          countryAccent[country] || "from-[#0077b6] to-[#10b981]"
        }`}
      />
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-950">{country}</h3>
          <p className="mt-1 text-sm text-slate-500">Explore open roles</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ecfeff] text-[#0077b6] group-hover:bg-[#0077b6] group-hover:text-white">
          <MapPin size={18} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
