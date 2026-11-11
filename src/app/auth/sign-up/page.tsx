import type { Metadata } from "next";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Бүртгүүлэх — Babytol" };

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />;
}
