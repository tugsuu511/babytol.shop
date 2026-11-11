import { createNeonAuth } from "@neon/auth/next/server";

// Neon Managed Better Auth. Хэрэглэгч, session нь Neon branch-ийн `neon_auth` схемд хадгалагдана.
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});
