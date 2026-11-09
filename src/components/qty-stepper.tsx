"use client";

import { MAX_QTY } from "@/lib/cart";

type Props = {
  value: number;
  onChange: (qty: number) => void;
  /** Доод хязгаар: картан дээр 1, сагсанд 0 (= устгах) */
  min?: number;
  label: string;
  size?: "md" | "sm";
};

export function QtyStepper({ value, onChange, min = 1, label, size = "md" }: Props) {
  const btn =
    size === "md"
      ? "h-11 w-11 text-xl"
      : "h-9 w-9 text-lg";
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-full border border-line bg-white"
    >
      <button
        type="button"
        aria-label="Хасах"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={`${btn} grid place-items-center rounded-full font-semibold text-ink transition-colors hover:bg-ivory-200 disabled:cursor-not-allowed disabled:opacity-35`}
      >
        −
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-[15px] font-bold tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        aria-label="Нэмэх"
        disabled={value >= MAX_QTY}
        onClick={() => onChange(value + 1)}
        className={`${btn} grid place-items-center rounded-full font-semibold text-ink transition-colors hover:bg-ivory-200 disabled:cursor-not-allowed disabled:opacity-35`}
      >
        +
      </button>
    </div>
  );
}
