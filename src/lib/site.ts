/** Public site origin. Matches the deployed host. */
export const siteUrl = "https://carribeanjobs.online";

export const siteName = "Caribbean Jobs";

/** Facebook Page that publishes the jobs on this board. */
export const facebookPageUrl =
  "https://www.facebook.com/profile.php?id=61591548955154";

/** Displayed footer address. CONTACT_EMAIL overrides it without a code change. */
export const defaultContactEmail = "hello@caribbeanjobs.com";

export function contactEmail() {
  return process.env.CONTACT_EMAIL?.trim() || defaultContactEmail;
}

/** Inbox for new /post-job submissions. NOTIFY_EMAIL overrides it. */
export const defaultNotifyEmail = "Jpoulido@gmail.com";

export function notifyEmail() {
  return process.env.NOTIFY_EMAIL?.trim() || defaultNotifyEmail;
}
