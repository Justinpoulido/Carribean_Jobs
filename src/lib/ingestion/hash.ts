import { createHash } from "crypto";

export function createDuplicateHash(input: {
  title: string;
  company_name: string;
  country: string;
  city: string;
}) {
  const normalized = [
    input.title,
    input.company_name,
    input.country,
    input.city,
  ]
    .map((value) => value.trim().toLowerCase().replace(/\s+/g, " "))
    .join("|");

  return createHash("sha256").update(normalized).digest("hex");
}
