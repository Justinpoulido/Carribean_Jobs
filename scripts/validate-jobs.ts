import { readFileSync } from "node:fs";
import path from "node:path";
import { parseJobCatalog } from "../src/lib/board-jobs.ts";

const files = ["data/jobs.json", "data/jobs.fixtures.json"];

for (const file of files) {
  const fullPath = path.join(process.cwd(), file);
  let parsed: unknown;

  try {
    parsed = JSON.parse(readFileSync(fullPath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Invalid JSON in ${file}: ${message}`);
    process.exit(1);
  }

  try {
    const jobs = parseJobCatalog(parsed, file);
    const noun = jobs.length === 1 ? "job" : "jobs";
    console.log(`Validated ${file} (${jobs.length} ${noun})`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
