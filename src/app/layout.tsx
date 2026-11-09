import type { Metadata } from "next";
import { CartDrawer } from "@/components/cart-drawer";
import { CartToast } from "@/components/cart-toast";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Babytol — 4U Pharma",
  description: "Babytol D3, D3 + K1, D3 + DHA Omega, DHA Omega — хүүхдэд зориулсан мушгидаг капсул.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <CartDrawer />
        <CheckoutDialog />
        <CartToast />
      </body>
    </html>
  );
}
