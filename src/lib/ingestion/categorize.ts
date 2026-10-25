import { categories } from "@/data/jobs";

// Keyword -> site category. Order matters: the first match wins, so more
// specific groups come before broad ones. Every value here must exist in
// `categories` so imported jobs show up under the category filters.
const categoryKeywords: Array<[string, string[]]> = [
  ["Healthcare", ["nurse", "doctor", "medical", "clinic", "pharmac", "physician", "caregiver"]],
  ["Education", ["teacher", "lecturer", "tutor", "school", "principal"]],
  ["Energy", ["oil", "gas", "energy", "offshore", "hse", "petroleum", "refinery"]],
  ["Construction", ["construction", "civil engineer", "mason", "carpenter", "plumber", "electrician", "quantity surveyor", "site supervisor"]],
  ["Technology", ["software", "developer", "network", "data analyst", "cybersecurity", "it support", "programmer", "devops"]],
  ["Finance", ["accountant", "accounting", "finance", "audit", "banking", "payroll", "credit"]],
  ["Hospitality", ["hotel", "resort", "chef", "cook", "restaurant", "bartender", "housekeep", "front desk"]],
  ["Marketing", ["marketing", "social media", "brand", "communications", "graphic design"]],
  ["Sales", ["sales", "business development", "account executive", "retail"]],
  ["Customer Service", ["customer service", "call centre", "call center", "cashier", "receptionist"]],
  ["Administration", ["administrat", "clerk", "secretary", "office manager", "human resources", "hr "]],
];

// Older sources may store legacy sector names.
const legacySectors: Record<string, string> = {
  IT: "Technology",
  Management: "Administration",
  General: "Other",
};

export function categorize(input: {
  title?: string;
  description?: string;
  sector?: string | null;
}) {
  if (input.sector) {
    const mapped = legacySectors[input.sector] || input.sector;
    if (categories.includes(mapped)) {
      return mapped;
    }
  }

  // Title is the strongest signal; fall back to the description.
  for (const text of [input.title, input.description]) {
    const haystack = ` ${(text || "").toLowerCase()} `;
    for (const [category, keywords] of categoryKeywords) {
      if (keywords.some((keyword) => haystack.includes(keyword))) {
        return category;
      }
    }
  }

  return "Other";
}
