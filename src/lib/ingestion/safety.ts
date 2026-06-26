const blockedHostPatterns = [
  "linkedin.com",
  "indeed.com",
  "glassdoor.com",
  "caribbeanjobs.com",
];

export function isBlockedWebsite(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return blockedHostPatterns.some((blocked) => hostname.includes(blocked));
  } catch {
    return true;
  }
}

export async function canScrapeUrl(url: string) {
  if (isBlockedWebsite(url)) {
    return {
      allowed: false,
      reason: "Website is blocked by ingestion safety rules.",
    };
  }

  const target = new URL(url);
  const robotsUrl = `${target.origin}/robots.txt`;

  try {
    const response = await fetch(robotsUrl, {
      headers: { "User-Agent": "CaribbeanJobsBot/1.0" },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return { allowed: true };
    }

    const robots = await response.text();
    const path = target.pathname || "/";
    const disallowRules = robots
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^disallow:/i.test(line))
      .map((line) => line.replace(/^disallow:/i, "").trim())
      .filter(Boolean);

    const disallowed = disallowRules.some((rule) => {
      if (rule === "/") {
        return true;
      }
      return path.startsWith(rule);
    });

    return disallowed
      ? { allowed: false, reason: "robots.txt disallows this path." }
      : { allowed: true };
  } catch {
    return { allowed: true };
  }
}
