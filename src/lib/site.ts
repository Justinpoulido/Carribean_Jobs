// Central site configuration. Override per-environment in Vercel:
//   NEXT_PUBLIC_SITE_URL        e.g. https://carribeanjobs.online
//   NEXT_PUBLIC_CONTACT_EMAIL   public contact / report address (must be a real mailbox)

export const SITE_NAME = "Caribbean Jobs";
export const SITE_TAGLINE = "Your Future. Our Caribbean. One Opportunity at a Time.";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://carribeanjobs.online"
).replace(/\/+$/, "");

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@carribeanjobs.online";

// How long a newly approved job stays live before it auto-closes.
export const DEFAULT_LISTING_DAYS = 30;
