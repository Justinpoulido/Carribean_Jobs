import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthorization } from "@/lib/admin-auth";

// Gate every /admin route (pages and the server actions they post to).
export function proxy(request: NextRequest) {
  if (isAdminAuthorization(request.headers.get("authorization"))) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Caribbean Jobs admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
