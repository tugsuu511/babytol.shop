import { auth } from "@/lib/auth/server";

// Нэвтрээгүй хэрэглэгчийг /account-аас /auth/sign-in руу шилжүүлнэ
export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
  matcher: ["/account/:path*"],
};
