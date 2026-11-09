"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { QtyStepper } from "@/components/qty-stepper";
import { cart, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

/** Header дахь сагсны товч, тооны badge-тэй */
export function CartButton() {
  const { count } = useCart();
  return (
    <button
      type="button"
      onClick={cart.open}
      aria-label={count ? `Сагс, ${count} бүтээгдэхүүн` : "Сагс, хоосон"}
      className="relative grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ivory-200"
    >
      <BagIcon />
      {count > 0 && (
        <span
          key={count}
          aria-hidden
          className="motion-safe:animate-bump absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-red px-1 text-[11px] font-bold tabular-nums text-white"
        >
          {count}
        </span>
      )}
    </button>
  );
}

/** Баруун талаас гарах сагс. Native <dialog> — focus trap, Escape-ийг хөтөч өөрөө хийнэ. */
export function CartDrawer() {
  const { items, isOpen, isCheckoutOpen, count, total } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  // Сагс эсвэл захиалгын dialog нээлттэй үед хуудсыг гүйлгэхгүй (нэг газар удирдана)
  useEffect(() => {
    document.body.style.overflow = isOpen || isCheckoutOpen ? "hidden" : "";
  }, [isOpen, isCheckoutOpen]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="cart-title"
      onClose={cart.close}
      onClick={(e) => {
        // Backdrop дээр дарахад хаана
        if (e.target === e.currentTarget) cart.close();
      }}
      className="fixed inset-y-0 left-auto right-0 m-0 h-full max-h-none w-full max-w-md bg-white p-0 text-ink shadow-[-16px_0_40px_rgba(41,50,58,0.15)] backdrop:bg-ink/40 open:flex open:flex-col"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 id="cart-title" className="text-lg font-bold">
          Захиалгын сагс {count > 0 && <span className="font-medium text-ink-muted">({count})</span>}
        </h2>
        <button
          type="button"
          onClick={cart.close}
          aria-label="Сагс хаах"
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-ivory-200"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-ivory-200 text-ink-muted">
            <BagIcon />
          </span>
          <p className="text-[15px] text-ink-muted">Сагс хоосон байна.</p>
          <Link
            href="/#shop"
            onClick={cart.close}
            className="rounded-full bg-brand-red px-5 py-3 text-[15px] font-semibold text-white hover:bg-[#B01F28]"
          >
            Бүтээгдэхүүн сонгох
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {items.map(({ product: p, qty, lineTotal }) => (
              <li key={p.slug} className="flex gap-4 py-5">
                <span
                  className="relative h-16 w-24 shrink-0 rounded-lg bg-ivory-200"
                  style={{ boxShadow: `inset 0 -3px 0 ${p.accent}` }}
                >
                  <Image src={p.packshot} alt="" fill sizes="96px" className="object-contain p-1.5" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold leading-tight">{p.name}</p>
                      <p className="mt-1 text-sm tabular-nums text-ink-muted">{formatPrice(p.price)} / хайрцаг</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => cart.remove(p.slug)}
                      className="shrink-0 text-sm font-medium text-ink-muted underline-offset-2 hover:text-brand-red hover:underline"
                    >
                      Устгах
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <QtyStepper
                      size="sm"
                      min={0}
                      value={qty}
                      onChange={(q) => cart.setQty(p.slug, q)}
                      label={`${p.name} — тоо ширхэг`}
                    />
                    <p className="text-[15px] font-bold tabular-nums">{formatPrice(lineTotal)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-line bg-ivory-200 px-5 pb-6 pt-4">
            <dl className="flex items-baseline justify-between">
              <dt className="text-[15px] font-semibold">Нийт дүн</dt>
              <dd className="text-2xl font-bold tabular-nums">{formatPrice(total)}</dd>
            </dl>
            <button
              type="button"
              onClick={cart.openCheckout}
              className="mt-4 flex w-full justify-center rounded-full bg-brand-red px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#B01F28]"
            >
              Захиалга өгөх
            </button>
            <button
              type="button"
              onClick={cart.close}
              className="mt-2 w-full py-2 text-sm font-semibold text-ink-muted hover:text-ink"
            >
              Худалдан авалт үргэлжлүүлэх
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
