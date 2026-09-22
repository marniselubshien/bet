import { auth } from "@/lib/auth/server";
import type { NextRequest } from "next/server";

const handler = auth.middleware({ loginUrl: "/auth/sign-in" });

export function proxy(request: NextRequest) {
  return handler(request);
}

export const config = {
  matcher: ["/account/:path*", "/wallet/:path*", "/settings/:path*"],
};
