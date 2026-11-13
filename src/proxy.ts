import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const trackingParams = [
  "fbclid",
  "gclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "mc_cid",
  "mc_eid",
];

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  let changed = false;
  for (const key of trackingParams) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (changed) {
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/jobs/:path*"],
};
