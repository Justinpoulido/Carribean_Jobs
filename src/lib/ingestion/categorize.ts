const sectorKeywordMap: Record<string, string[]> = {
  Finance: ["accountant", "finance", "audit", "banking", "payroll"],
  IT: [
    "software",
    "developer",
    "network",
    "data",
    "cybersecurity",
    "support",
  ],
  Energy: ["oil", "gas", "energy", "offshore", "hse", "technician"],
  Education: ["teacher", "lecturer", "tutor", "school"],
  Healthcare: ["nurse", "doctor", "medical", "clinic", "pharmacy"],
  Management: ["manager", "supervisor", "operations", "director"],
  Sales: ["sales", "customer", "retail", "business development"],
};

export function categorizeSector(input: {
  title?: string;
  description?: string;
  sector?: string | null;
}) {
  if (input.sector) {
    return input.sector;
  }

  const text = `${input.title || ""} ${input.description || ""}`.toLowerCase();

  for (const [sector, keywords] of Object.entries(sectorKeywordMap)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return sector;
    }
  }

  return "General";
}

export function sectorToCategory(sector: string) {
  if (sector === "IT") {
    return "Technology";
  }

  if (sector === "Sales") {
    return "Customer Service";
  }

  return sector;
}
