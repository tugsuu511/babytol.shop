"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthFormState } from "./actions";

const input =
  "mt-1.5 w-full rounded-xl border border-[#dde1e6] bg-white px-4 py-3 text-[15px] outline-none focus:border-ink";

export function AuthForm({ mode }: { mode: "sign-up" | "sign-in" }) {
  const isSignUp = mode === "sign-up";
  const [state, action, pending] = useActionState<AuthFormState, FormData>(isSignUp ? signUp : signIn, {});

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-[2.25rem] font-medium leading-[1.1] tracking-[-0.02em]">
        {isSignUp ? "Бүртгүүлэх" : "Нэвтрэх"}
      </h1>

      <form action={action} className="mt-8 space-y-5">
        {isSignUp && (
          <label className="block text-sm font-semibold">
            Нэр
            <input name="name" autoComplete="name" required defaultValue={state.name} className={input} />
          </label>
        )}
        <label className="block text-sm font-semibold">
          Имэйл
          <input name="email" type="email" autoComplete="email" required defaultValue={state.email} className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Нууц үг
          <input
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={isSignUp ? 8 : undefined}
            required
            className={input}
          />
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-brand-red">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-brand-red px-5 py-3.5 text-[15px] font-semibold text-white hover:bg-[#B01F28] disabled:opacity-60"
        >
          {pending ? "Түр хүлээнэ үү…" : isSignUp ? "Бүртгүүлэх" : "Нэвтрэх"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-muted">
        {isSignUp ? "Бүртгэлтэй юу? " : "Бүртгэлгүй юу? "}
        <Link href={isSignUp ? "/auth/sign-in" : "/auth/sign-up"} className="font-semibold text-ink underline">
          {isSignUp ? "Нэвтрэх" : "Бүртгүүлэх"}
        </Link>
      </p>
    </div>
  );
}
