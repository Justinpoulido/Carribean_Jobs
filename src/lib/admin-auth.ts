import { timingSafeEqual } from "crypto";

// Interim admin protection (HTTP Basic auth) until full admin login is built.
// Username: ADMIN_USER (default "admin"). Password: ADMIN_SECRET.
// Fails closed: if ADMIN_SECRET is not set, nobody can access admin.

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isAdminAuthorization(header: string | null | undefined) {
  const secret = process.env.ADMIN_SECRET;
  const user = process.env.ADMIN_USER || "admin";

  if (!secret || !header?.startsWith("Basic ")) {
    return false;
  }

  let decoded = "";
  try {
    decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch {
    return false;
  }

  const separator = decoded.indexOf(":");
  if (separator === -1) {
    return false;
  }

  return (
    safeEqual(decoded.slice(0, separator), user) &&
    safeEqual(decoded.slice(separator + 1), secret)
  );
}
