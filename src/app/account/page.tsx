import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { signOut } from "@/app/auth/actions";
import { auth } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Миний бүртгэл — Babytol" };

// Session нь cookie-оос уншигддаг тул динамик. cacheComponents асаалттай учир Suspense дотор рендерлэнэ.
async function CurrentUser() {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  if (!user) redirect("/auth/sign-in");

  return (
    <>
      <p className="mt-6 text-[15px]">
        Сайн байна уу, <strong>{user.name}</strong>
      </p>
      <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
      <form action={signOut} className="mt-8">
        <button type="submit" className="rounded-full border border-ink px-5 py-3 text-[15px] font-semibold hover:bg-ink hover:text-white">
          Гарах
        </button>
      </form>
    </>
  );
}

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-[2.25rem] font-medium leading-[1.1] tracking-[-0.02em]">Миний бүртгэл</h1>
      <Suspense fallback={<p className="mt-6 text-sm text-ink-muted">Ачаалж байна…</p>}>
        <CurrentUser />
      </Suspense>
    </div>
  );
}
