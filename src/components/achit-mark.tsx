import { Dancing_Script } from "next/font/google";

// Ачит Фарм-ын уриа — бичмэл фонт (латин бичвэр тул latin subset хангалттай)
const script = Dancing_Script({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });

/** "Caring for kids, shaping tomorrow..." — kids ба ... улаан */
export function AchitSlogan({ className = "" }: { className?: string }) {
  return (
    <p lang="en" className={`${script.className} font-bold leading-[1.1] text-ink ${className}`}>
      Caring for <span className="text-brand-red">kids</span>,
      <br />
      shaping tomorrow<span className="text-brand-red">...</span>
    </p>
  );
}

/** Логоны гурван өнгийн нимгэн зураас */
export function AchitStripe({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`flex h-1.5 w-full ${className}`}>
      <span className="flex-1 bg-gradient-to-r from-achit-cyan to-achit-blue" />
      <span className="flex-1 bg-gradient-to-r from-achit-crimson to-achit-orange" />
      <span className="flex-1 bg-gradient-to-r from-achit-teal to-achit-lime" />
    </span>
  );
}
