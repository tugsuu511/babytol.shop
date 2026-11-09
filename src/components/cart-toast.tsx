"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cart, useCart } from "@/lib/cart";
import { formatPrice, productBySlug } from "@/lib/products";

const HIDE_AFTER = 4500;

/**
 * "Сагсанд нэмэгдлээ" мэдэгдэл — header-ийн сагсны товчны доор гарч, өөрөө алга болно.
 * Хэрэглэгчийн урсгалыг тасалдуулахгүй: сагс нээгдэхгүй, focus хөдлөхгүй.
 */
export function CartToast() {
  const { toast, count, total } = useCart();
  const hovering = useRef(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => {
      if (!hovering.current) cart.dismissToast();
    }, HIDE_AFTER);
    return () => clearTimeout(t);
  }, [toast]);

  const p = toast ? productBySlug(toast.slug) : undefined;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-[76px] z-[60] flex justify-end sm:inset-x-auto sm:right-6 lg:right-8 lg:top-[92px]"
    >
      {toast && p && (
        <div
          key={toast.id}
          role="status"
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => {
            hovering.current = false;
            cart.dismissToast();
          }}
          className="motion-safe:animate-toast-in pointer-events-auto w-full rounded-2xl border border-line bg-white p-4 shadow-[0_16px_40px_rgba(41,50,58,0.18)] sm:w-[360px]"
          style={{ borderTopColor: p.accent, borderTopWidth: 3 }}
        >
          <div className="flex items-start gap-3">
            <span className="relative h-14 w-[72px] shrink-0 rounded-lg bg-ivory-200">
              <Image src={p.packshot} alt="" fill sizes="72px" className="object-contain p-1" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-green">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Сагсанд нэмэгдлээ
              </p>
              <p className="mt-1 truncate text-[15px] font-semibold text-ink">{p.name}</p>
              <p className="text-xs tabular-nums text-ink-muted">
                {toast.qty} ширхэг · {formatPrice(p.price * toast.qty)}
              </p>
            </div>
            <button
              type="button"
              onClick={cart.dismissToast}
              aria-label="Мэдэгдэл хаах"
              className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-ivory-200 hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M3 3l8 8M11 3 3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={cart.open}
              className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ivory-200"
            >
              Сагс харах ({count})
            </button>
            <button
              type="button"
              onClick={cart.openCheckout}
              className="flex-1 rounded-full bg-brand-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B01F28]"
            >
              Захиалах · {formatPrice(total)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
