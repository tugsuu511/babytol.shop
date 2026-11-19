import { auth } from "@/lib/auth/server";

/** ADMIN_EMAILS="a@x.mn,b@y.mn" — админ эрхтэй имэйлүүд. Хоосон бол хэн ч админ биш. */
export function isAdminEmail(email: string | null | undefined, list = process.env.ADMIN_EMAILS) {
  if (!email) return false;
  const admins = (list ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

/** Нэвтэрсэн хэрэглэгч админ бол түүнийг, үгүй бол null буцаана. Хуудас болон action бүрт дуудна. */
export async function getAdmin() {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  return user && isAdminEmail(user.email) ? user : null;
}
