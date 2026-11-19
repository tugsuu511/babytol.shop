// Швейцарийн загалмай — албан харьцаагаар (мөр нь өргөнөөсөө 1/6-аар урт).
// 32×32 тор: төв дөрвөлжин 6×6, мөр бүр 7. Чимэглэл тул aria-hidden.

import type { CSSProperties } from "react";

export function SwissCross({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={style} aria-hidden>
      <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="currentColor" />
    </svg>
  );
}
