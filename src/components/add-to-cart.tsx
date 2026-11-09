"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { QtyStepper } from "@/components/qty-stepper";
import { cart } from "@/lib/cart";

type Props = {
  slug: string;
  name: string;
  /** Товчны өнгө (SKU-ийн загвараас); өгөхгүй бол брэндийн улаан */
  color?: string;
  hoverColor?: string;
  size?: "md" | "lg";
};

/** Тоо ширхэг сонгох + "Сагсанд нэмэх". Нэмэхэд CartToast мэдэгдэл гарна. */
export function AddToCart({ slug, name, color = "#CC242E", hoverColor = "#B01F28", size = "md" }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const add = () => {
    cart.add(slug, qty);
    setQty(1);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QtyStepper value={qty} onChange={setQty} label={`${name} — тоо ширхэг`} />
      <button
        type="button"
        onClick={add}
        style={{ "--cta": color, "--cta-hover": hoverColor } as CSSProperties}
        className={`flex flex-1 items-center justify-center whitespace-nowrap rounded-full bg-[var(--cta)] font-semibold text-white transition-colors hover:bg-[var(--cta-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta)] ${
          size === "lg" ? "h-12 min-w-56 px-7 text-base" : "h-11 px-5 text-[15px]"
        }`}
      >
        {added ? "✓ Нэмэгдлээ" : "Сагсанд нэмэх"}
      </button>
    </div>
  );
}
