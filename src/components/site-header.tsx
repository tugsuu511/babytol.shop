"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { products } from "@/lib/products";

const navLinks = [
  { href: "/about", label: "Бидний тухай" },
  { href: "/how-to-use", label: "Хэрэглэх заавар" },
  { href: "/faq", label: "Түгээмэл асуулт" },
  { href: "/contact", label: "Холбоо барих" },
];

// Дөрвөн SKU-ийн гол өнгөөр header-ийн доод зураас
const stripe = ["#F79E24", "#ED1072", "#00A785", "#CC242E"];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();
  const mobileId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape болон гадна дарахад хаах
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProductsOpen(false);
        setMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  // Mobile цэс нээлттэй үед хуудсыг гүйлгэхгүй
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const openProducts = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductsOpen(true);
  };
  const closeProductsSoon = () => {
    closeTimer.current = setTimeout(() => setProductsOpen(false), 120);
  };
  const closeAll = () => {
    setProductsOpen(false);
    setMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? "shadow-[0_2px_16px_rgba(41,50,58,0.08)]" : ""
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-white"
      >
        Үндсэн агуулга руу
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Лого — 4U Pharma-ийн эх PNG, харьцааг хадгалсан */}
        <Link href="/" onClick={closeAll} className="shrink-0 py-2" aria-label="Babytol — нүүр хуудас">
          <Image
            src="/brand/4u-pharma-logo.png"
            alt="4U pharma"
            width={207}
            height={80}
            priority
            className="h-9 w-auto lg:h-10"
          />
        </Link>

        {/* Desktop цэс */}
        <nav aria-label="Үндсэн цэс" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li
              ref={productsRef}
              className="relative"
              onMouseEnter={openProducts}
              onMouseLeave={closeProductsSoon}
            >
              <button
                type="button"
                aria-expanded={productsOpen}
                aria-controls={panelId}
                onClick={() => setProductsOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:bg-ivory-200 aria-expanded:bg-ivory-200"
              >
                Бүтээгдэхүүн
                <Chevron open={productsOpen} />
              </button>

              <div
                id={panelId}
                hidden={!productsOpen}
                className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3"
              >
                <div className="rounded-2xl border border-line bg-white p-3 shadow-[0_16px_40px_rgba(41,50,58,0.12)]">
                  <ul className="grid grid-cols-2 gap-2">
                    {products.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={closeAll}
                          className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-ivory-200 focus-visible:bg-ivory-200"
                        >
                          <span className="relative h-[68px] w-[124px] shrink-0">
                            <Image
                              src={p.packshot}
                              alt=""
                              fill
                              sizes="124px"
                              className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                            />
                          </span>
                          <span className="flex flex-col gap-1.5">
                            <span className="text-[15px] font-semibold leading-tight text-ink">
                              {p.name}
                            </span>
                            <span className="flex gap-1" aria-hidden>
                              {p.palette.map((c) => (
                                <span key={c} className="h-1.5 w-5 rounded-full" style={{ background: c }} />
                              ))}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/products"
                    onClick={closeAll}
                    className="mt-2 flex items-center justify-between rounded-xl bg-ivory-200 px-4 py-3 text-sm font-semibold text-ink hover:bg-ivory-300"
                  >
                    Бүх бүтээгдэхүүнийг харьцуулах
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </li>

            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:bg-ivory-200"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/where-to-buy"
            onClick={closeAll}
            className="hidden rounded-full bg-brand-red px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#B01F28] sm:inline-flex"
          >
            Хаанаас авах
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={mobileId}
            aria-label={menuOpen ? "Цэс хаах" : "Цэс нээх"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-ivory-200 lg:hidden"
          >
            <Burger open={menuOpen} />
          </button>
        </div>
      </div>

      {/* SKU өнгөний зураас */}
      <div className="flex h-[3px]" aria-hidden>
        {stripe.map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      {/* Mobile цэс */}
      <div
        id={mobileId}
        hidden={!menuOpen}
        className="fixed inset-x-0 bottom-0 top-[67px] overflow-y-auto bg-white lg:hidden"
      >
        <nav aria-label="Үндсэн цэс" className="px-4 pb-10 pt-5 sm:px-6">
          <p className="px-1 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Бүтээгдэхүүн
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  onClick={closeAll}
                  className="flex h-full flex-col gap-2 rounded-xl border border-line p-3"
                  style={{ borderTopColor: p.accent, borderTopWidth: 3 }}
                >
                  <span className="relative aspect-[1.83] w-full">
                    <Image src={p.packshot} alt="" fill sizes="45vw" className="object-contain" />
                  </span>
                  <span className="text-sm font-semibold leading-tight text-ink">{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-6 divide-y divide-line border-y border-line">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={closeAll}
                  className="flex items-center justify-between px-1 py-4 text-base font-semibold text-ink"
                >
                  {l.label}
                  <span aria-hidden className="text-ink-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/where-to-buy"
            onClick={closeAll}
            className="mt-6 flex justify-center rounded-full bg-brand-red px-5 py-3.5 text-base font-semibold text-white"
          >
            Хаанаас авах
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {open ? (
          <>
            <path d="M5 5l12 12" />
            <path d="M17 5L5 17" />
          </>
        ) : (
          <>
            <path d="M3 6h16" />
            <path d="M3 11h16" />
            <path d="M3 16h16" />
          </>
        )}
      </g>
    </svg>
  );
}
