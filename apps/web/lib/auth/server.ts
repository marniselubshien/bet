import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || "https://placeholder.neonauth.tech/neondb/auth",
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET || "placeholder-secret-at-least-32-chars-long!" },
});
