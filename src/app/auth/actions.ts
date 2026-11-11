"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export type AuthFormState = { error?: string; email?: string; name?: string };

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export async function signUp(_prev: AuthFormState, fd: FormData): Promise<AuthFormState> {
  const name = text(fd, "name");
  const email = text(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  if (name.length < 2) return { error: "Нэрээ оруулна уу.", email, name };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Зөв имэйл хаяг оруулна уу.", email, name };
  if (password.length < 8) return { error: "Нууц үг хамгийн багадаа 8 тэмдэгт байна.", email, name };

  const { error } = await auth.signUp.email({ name, email, password });
  if (error) return { error: error.message || "Бүртгэл амжилтгүй боллоо.", email, name };

  redirect("/account");
}

export async function signIn(_prev: AuthFormState, fd: FormData): Promise<AuthFormState> {
  const email = text(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  const { error } = await auth.signIn.email({ email, password });
  if (error) return { error: "Имэйл эсвэл нууц үг буруу байна.", email };

  redirect("/account");
}

export async function signOut() {
  await auth.signOut();
  redirect("/");
}
