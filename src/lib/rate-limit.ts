const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

export function tooManyPosts(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.set(key, recent);
  return recent.length >= LIMIT;
}

export function recordPost(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
}
