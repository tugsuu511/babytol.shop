"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { SwissCross } from "@/components/swiss-cross";
import { SwissSeal } from "@/components/swiss-seal";

// "Бидний тухай" — Үйлдвэрлэгч / Нийлүүлэгч гэсэн хоёр карт.
// Карт дарахад View Transition-оор картын хэсгүүд (тэмдэг, гарчиг, нэр, уриа) тус тусдаа
// салж нисээд banner болж дахин нийлнэ; доорх агуулга цаас шиг дэлгэгдэнэ (.org-unfold).
// Сонголт URL-ийн hash-д (#maker / #supplier) хадгалагдана — хуваалцах, Back товч ажиллана.

export type Org = "maker" | "supplier";

const EVENT = "about-org-change";

function readHash(): Org | null {
  const h = window.location.hash.slice(1);
  return h === "maker" || h === "supplier" ? h : null;
}

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/** view-transition-name + class — хэсэг бүр бие даан хөдөлнө */
const vt = (name: string, cls: "org-card" | "org-piece" | "org-mark"): CSSProperties => ({
  viewTransitionName: name,
  viewTransitionClass: cls,
});

const copy = {
  maker: {
    role: "Үйлдвэрлэгч",
    name: "4U Pharma · Швейцарь",
    tagline: "Швейцарьт боловсруулж, Европын Холбооны стандартаар үйлдвэрлэдэг.",
  },
  supplier: {
    role: "Нийлүүлэгч",
    name: "Ачит Фарм · Монгол",
    tagline: "2022 оноос хүүхдийн эм, эрүүл мэндийн бүтээгдэхүүнийг Монголд нийлүүлж байна.",
  },
} as const;

export function OrgExplorer({ maker, supplier }: { maker: ReactNode; supplier: ReactNode }) {
  const open = useSyncExternalStore(subscribe, readHash, () => null);
  const rootRef = useRef<HTMLElement>(null);

  const go = useCallback((next: Org | null) => {
    const apply = () => {
      flushSync(() => {
        const url = next ? `#${next}` : window.location.pathname + window.location.search;
        window.history.pushState(null, "", url);
        window.dispatchEvent(new Event(EVENT));
      });
      // Картын дээд хэсэг рүү буцаана (доош гүйлгэсэн үед)
      const el = rootRef.current;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 96;
        if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" });
      }
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document.startViewTransition !== "function") apply();
    else document.startViewTransition(apply);
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="about-title" className="bg-ivory">
      {open === null ? (
        <Chooser onOpen={go} />
      ) : (
        <Opened org={open} onBack={() => go(null)} onSwitch={() => go(open === "maker" ? "supplier" : "maker")}>
          {open === "maker" ? maker : supplier}
        </Opened>
      )}
    </section>
  );
}

/* ───────────── Сонгох (2 карт) ───────────── */

function Chooser({ onOpen }: { onOpen: (o: Org) => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 lg:px-8 lg:pt-8">
      <Crumbs />
      <h1
        id="about-title"
        className="mt-10 max-w-4xl text-[2.25rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink [text-wrap:balance] sm:text-5xl xl:text-[4rem]"
      >
        Швейцарьт бүтээгдэж, <span className="text-brand-red">Монголд хүргэгддэг.</span>
      </h1>
      <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.6] text-ink-muted sm:text-lg">
        Babytol-ийн ард хоёр байгууллага бий. Картаа сонгоод дэлгэрэнгүй танилцаарай.
      </p>

      <ul className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[1.18fr_1fr] lg:gap-6">
        <li>
          <MakerCard onOpen={() => onOpen("maker")} />
        </li>
        <li>
          <SupplierCard onOpen={() => onOpen("supplier")} />
        </li>
      </ul>
    </div>
  );
}

function MakerCard({ onOpen }: { onOpen: () => void }) {
  const c = copy.maker;
  return (
    <article
      style={vt("org-card-maker", "org-card")}
      className="group relative isolate flex h-full min-h-[460px] flex-col overflow-hidden rounded-[2rem] bg-brand-red p-7 text-white shadow-[0_32px_64px_-36px_rgba(204,36,46,0.75)] transition-transform duration-500 ease-out hover:-translate-y-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-brand-red sm:min-h-[480px] sm:p-10"
    >
      <SwissCross
        style={vt("org-mark-maker", "org-mark")}
        className="pointer-events-none absolute -bottom-[8%] -right-[8%] -z-10 w-[44%] text-white transition-transform duration-700 ease-out group-hover:-rotate-6 group-hover:scale-[1.04] sm:-bottom-[14%] sm:-right-[12%] sm:w-[54%]"
      />
      <SwissSeal style={vt("org-seal-maker", "org-piece")} className="h-16 w-16 sm:h-20 sm:w-20" />

      <h2
        style={vt("org-role-maker", "org-piece")}
        className="mt-8 w-fit text-[2.5rem] font-bold leading-none tracking-[-0.02em] sm:text-6xl"
      >
        <button
          type="button"
          onClick={onOpen}
          className="text-left outline-none after:absolute after:inset-0 after:content-['']"
        >
          {c.role}
        </button>
      </h2>
      <p
        style={vt("org-name-maker", "org-piece")}
        className="mt-3 w-fit text-xl font-semibold text-white/90 sm:text-2xl"
      >
        {c.name}
      </p>
      <p
        style={vt("org-tag-maker", "org-piece")}
        className="mt-5 max-w-[24ch] text-[17px] leading-[1.5] text-white [text-wrap:pretty] sm:text-lg"
      >
        {c.tagline}
      </p>

      <span
        aria-hidden
        style={vt("org-cta-maker", "org-piece")}
        className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-brand-red transition-colors group-hover:bg-ivory-200"
      >
        Дэлгэрэнгүй
        <Arrow />
      </span>
    </article>
  );
}

function SupplierCard({ onOpen }: { onOpen: () => void }) {
  const c = copy.supplier;
  return (
    <article
      style={vt("org-card-supplier", "org-card")}
      className="group relative isolate flex h-full min-h-[380px] flex-col overflow-hidden rounded-[2rem] border border-line bg-white p-7 text-ink shadow-[0_32px_64px_-40px_rgba(41,50,58,0.5)] transition-transform duration-500 ease-out hover:-translate-y-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ink sm:min-h-[480px] sm:p-10"
    >
      <span style={vt("org-mark-supplier", "org-mark")} className="block w-28 sm:w-36">
        <Image
          src="/brand/achit/achit-pharma-logo.png"
          alt="Ачит Фарм"
          width={395}
          height={149}
          className="h-auto w-full"
        />
      </span>

      <h2
        style={vt("org-role-supplier", "org-piece")}
        className="mt-8 w-fit text-[2.5rem] font-bold leading-none tracking-[-0.02em] sm:text-6xl"
      >
        <button
          type="button"
          onClick={onOpen}
          className="text-left outline-none after:absolute after:inset-0 after:content-['']"
        >
          {c.role}
        </button>
      </h2>
      <p
        style={vt("org-name-supplier", "org-piece")}
        className="mt-3 w-fit text-xl font-semibold text-ink-muted sm:text-2xl"
      >
        {c.name}
      </p>
      <p
        style={vt("org-tag-supplier", "org-piece")}
        className="mt-5 max-w-[26ch] text-[17px] leading-[1.5] text-ink [text-wrap:pretty] sm:text-lg"
      >
        {c.tagline}
      </p>

      <span
        aria-hidden
        style={vt("org-cta-supplier", "org-piece")}
        className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-[15px] font-semibold text-white transition-colors group-hover:bg-[#1d242a]"
      >
        Дэлгэрэнгүй
        <Arrow />
      </span>
    </article>
  );
}

/* ───────────── Нээгдсэн (banner + агуулга) ───────────── */

function Opened({
  org,
  onBack,
  onSwitch,
  children,
}: {
  org: Org;
  onBack: () => void;
  onSwitch: () => void;
  children: ReactNode;
}) {
  const other: Org = org === "maker" ? "supplier" : "maker";
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <h1 id="about-title" className="sr-only">
          Бидний тухай — {copy[org].role}
        </h1>
        <Crumbs current={copy[org].role} onBack={onBack} />
        <div className="mt-6">{org === "maker" ? <MakerBanner /> : <SupplierBanner />}</div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[15px] font-semibold text-ink transition-colors hover:bg-ivory-200 focus-visible:outline-2 focus-visible:outline-ink"
          >
            <Arrow className="rotate-180" />
            Хоёр байгууллага
          </button>
          <button
            type="button"
            onClick={onSwitch}
            style={vt(`org-card-${other}`, "org-card")}
            className={`inline-flex min-h-11 items-center gap-3 rounded-full py-2 pl-2 pr-5 text-[15px] font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              other === "maker"
                ? "bg-brand-red text-white focus-visible:outline-brand-red"
                : "border border-line bg-white text-ink focus-visible:outline-ink"
            }`}
          >
            {other === "maker" ? (
              <SwissCross className="h-8 w-8 rounded-full bg-white text-brand-red" />
            ) : (
              <span className="grid h-8 w-12 place-items-center">
                <Image
                  src="/brand/achit/achit-pharma-logo.png"
                  alt=""
                  width={395}
                  height={149}
                  className="h-auto w-full"
                />
              </span>
            )}
            {copy[other].role}: {copy[other].name.split(" · ")[0]}
            <Arrow />
          </button>
        </div>
      </div>

      {/* key — шилжих бүрт дэлгэгдэх хөдөлгөөн дахин эхэлнэ */}
      <div key={org} className="org-unfold">
        {children}
      </div>
    </>
  );
}

function MakerBanner() {
  const c = copy.maker;
  return (
    <div
      style={vt("org-card-maker", "org-card")}
      className="relative isolate overflow-hidden rounded-[2rem] bg-brand-red p-7 text-white sm:p-10 lg:px-14 lg:py-12"
    >
      <SwissCross
        style={vt("org-mark-maker", "org-mark")}
        className="pointer-events-none absolute -right-[10%] top-1/2 -z-10 w-[58%] -translate-y-1/2 text-white/[0.16] sm:-right-[4%] sm:w-[40%] lg:w-[30%] lg:text-white"
      />
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
        <SwissSeal style={vt("org-seal-maker", "org-piece")} className="h-14 w-14 shrink-0 sm:h-24 sm:w-24" />
        <div className="min-w-0 lg:max-w-[64%]">
          <h2
            style={vt("org-role-maker", "org-piece")}
            className="w-fit text-[2.5rem] font-bold leading-none tracking-[-0.02em] sm:text-6xl xl:text-7xl"
          >
            {c.role}
          </h2>
          <p
            style={vt("org-name-maker", "org-piece")}
            className="mt-3 w-fit text-xl font-semibold text-white/90 sm:text-2xl"
          >
            {c.name}
          </p>
        </div>
      </div>
      <p
        style={vt("org-tag-maker", "org-piece")}
        className="mt-6 max-w-[40ch] text-[17px] leading-[1.5] [text-wrap:pretty] sm:text-lg lg:max-w-[56%]"
      >
        {c.tagline}
      </p>
    </div>
  );
}

function SupplierBanner() {
  const c = copy.supplier;
  return (
    <div
      style={vt("org-card-supplier", "org-card")}
      className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-white p-7 text-ink sm:p-10 lg:px-14 lg:py-12"
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
        <span style={vt("org-mark-supplier", "org-mark")} className="block w-24 shrink-0 sm:w-40">
          <Image
            src="/brand/achit/achit-pharma-logo.png"
            alt="Ачит Фарм"
            width={395}
            height={149}
            className="h-auto w-full"
          />
        </span>
        <div className="min-w-0 lg:max-w-[60%]">
          <h2
            style={vt("org-role-supplier", "org-piece")}
            className="w-fit text-[2.5rem] font-bold leading-none tracking-[-0.02em] sm:text-6xl xl:text-7xl"
          >
            {c.role}
          </h2>
          <p
            style={vt("org-name-supplier", "org-piece")}
            className="mt-3 w-fit text-xl font-semibold text-ink-muted sm:text-2xl"
          >
            {c.name}
          </p>
        </div>
      </div>
      <p
        style={vt("org-tag-supplier", "org-piece")}
        className="mt-6 max-w-[40ch] text-[17px] leading-[1.5] [text-wrap:pretty] sm:text-lg lg:max-w-[52%]"
      >
        {c.tagline}
      </p>
    </div>
  );
}

/* ───────────── Жижиг хэсгүүд ───────────── */

function Crumbs({ current, onBack }: { current?: string; onBack?: () => void }) {
  return (
    <nav aria-label="Байршил" className="text-[13px] font-medium text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="underline-offset-4 hover:text-ink hover:underline">
            Нүүр
          </Link>
        </li>
        <li aria-hidden>/</li>
        {current && onBack ? (
          <>
            <li>
              <button type="button" onClick={onBack} className="underline-offset-4 hover:text-ink hover:underline">
                Бидний тухай
              </button>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {current}
            </li>
          </>
        ) : (
          <li aria-current="page" className="text-ink">
            Бидний тухай
          </li>
        )}
      </ol>
    </nav>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className={className}>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
