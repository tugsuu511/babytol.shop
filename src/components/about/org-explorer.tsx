"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { AchitSlogan, AchitStripe } from "@/components/achit-mark";
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

/** Гүйлгэлт дуусч, (утасны хаягийн мөрийн) viewport-ийн хэмжээ тогтворжихыг хүлээнэ */
function waitForScrollSettle(): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scrollend", finish);
      // Хаягийн мөрийн resize нэг-хоёр frame хоцорч ирдэг
      setTimeout(() => requestAnimationFrame(() => resolve()), 120);
    };
    if ("onscrollend" in window) window.addEventListener("scrollend", finish, { once: true });
    setTimeout(finish, 700); // scrollend дэмжихгүй / ирэхгүй үед
  });
}

/** view-transition-name + class — хэсэг бүр бие даан хөдөлнө */
/** fly — CSS нөөц хөдөлгөөнд хэсэг хаанаас нисэж ирэх: [x, y, эргэлт, хоцролт ms] */
const vt = (
  name: string,
  cls: "org-card" | "org-piece" | "org-mark",
  fly?: [string, string, string, number],
): CSSProperties => ({
  ...(fly && ({ "--fx": fly[0], "--fy": fly[1], "--fr": fly[2], "--fd": `${fly[3]}ms` } as CSSProperties)),
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
    const root = rootRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    delete root?.dataset.fx;

    const apply = () =>
      flushSync(() => {
        const url = next ? `#${next}` : window.location.pathname + window.location.search;
        window.history.pushState(null, "", url);
        window.dispatchEvent(new Event(EVENT));
      });

    /** CSS нөөц хөдөлгөөн: banner-ийн хэсгүүд өөр өөр чиглэлээс нисэж ирж нийлнэ */
    const playCssFallback = () => {
      if (!root || reduce) return;
      delete root.dataset.fx;
      void root.offsetWidth; // хөдөлгөөнийг дахин эхлүүлэх
      root.dataset.fx = "css";
    };

    const start = () => {
      if (reduce) return apply();
      if (typeof document.startViewTransition !== "function") {
        apply();
        return playCssFallback();
      }
      const t = document.startViewTransition(apply);
      // Шилжилтийн үед viewport өөрчлөгдвөл браузер хөдөлгөөнийг цуцалж reject хийнэ.
      // DOM аль хэдийн шинэчлэгдсэн тул CSS нөөц хөдөлгөөнийг тоглуулна.
      t.ready.catch(playCssFallback);
      t.finished.catch(() => {});
      t.updateCallbackDone.catch(() => {});
    };

    // Утсан дээр: дээш гүйлгэхэд хаягийн мөр гарч viewport өөрчлөгддөг тул шилжилтийн
    // ӨМНӨ гүйлгэж дуусгаад, хэмжээ тогтворжсоны дараа хөдөлгөөнийг эхлүүлнэ.
    const top = root ? root.getBoundingClientRect().top + window.scrollY - 96 : 0;
    if (window.scrollY <= top + 4) return start();
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "instant" : "smooth" });
    waitForScrollSettle().then(start);
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="about-title" className="overflow-x-clip bg-ivory">
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
      className="group relative isolate flex h-full min-h-[380px] flex-col overflow-hidden rounded-[2rem] border border-line bg-white p-7 text-ink shadow-[0_32px_64px_-36px_rgba(14,58,192,0.45)] transition-transform duration-500 ease-out hover:-translate-y-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-achit-blue sm:min-h-[480px] sm:p-10"
    >
      <AchitStripe className="absolute inset-x-0 top-0" />
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
        className="mt-3 w-fit text-xl font-semibold text-achit-blue sm:text-2xl"
      >
        {c.name}
      </p>
      <p
        style={vt("org-tag-supplier", "org-piece")}
        className="mt-5 max-w-[26ch] text-[17px] leading-[1.5] text-ink [text-wrap:pretty] sm:text-lg"
      >
        {c.tagline}
      </p>

      <div style={vt("org-slogan-supplier", "org-piece")} className="mt-auto w-fit pt-8">
        <AchitSlogan className="text-[1.75rem] sm:text-[2.125rem]" />
      </div>

      <span
        aria-hidden
        style={vt("org-cta-supplier", "org-piece")}
        className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-achit-blue px-5 py-3 text-[15px] font-semibold text-white transition-colors group-hover:bg-achit-blue-dark"
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
                : "border border-achit-blue/20 bg-white text-achit-blue focus-visible:outline-achit-blue"
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
      className="org-banner relative isolate overflow-hidden rounded-[2rem] bg-brand-red p-7 text-white sm:p-10 lg:px-14 lg:py-12"
    >
      <SwissCross
        style={vt("org-mark-maker", "org-mark", ["60px", "-40px", "25deg", 0])}
        className="pointer-events-none absolute -right-[10%] top-1/2 -z-10 w-[58%] -translate-y-1/2 text-white/[0.16] sm:-right-[4%] sm:w-[40%] lg:w-[30%] lg:text-white"
      />
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
        <SwissSeal
          style={vt("org-seal-maker", "org-piece", ["-50px", "-30px", "-30deg", 60])}
          className="h-14 w-14 shrink-0 sm:h-24 sm:w-24"
        />
        <div className="min-w-0 lg:max-w-[64%]">
          <h2
            style={vt("org-role-maker", "org-piece", ["-40px", "30px", "-4deg", 100])}
            className="w-fit text-[2.5rem] font-bold leading-none tracking-[-0.02em] sm:text-6xl xl:text-7xl"
          >
            {c.role}
          </h2>
          <p
            style={vt("org-name-maker", "org-piece", ["30px", "40px", "3deg", 160])}
            className="mt-3 w-fit text-xl font-semibold text-white/90 sm:text-2xl"
          >
            {c.name}
          </p>
        </div>
      </div>
      <p
        style={vt("org-tag-maker", "org-piece", ["0px", "50px", "-2deg", 220])}
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
      className="org-banner relative isolate overflow-hidden rounded-[2rem] border border-line bg-white p-7 text-ink sm:p-10 lg:px-14 lg:py-12"
    >
      <AchitStripe className="absolute inset-x-0 top-0" />
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
        <span
          style={vt("org-mark-supplier", "org-mark", ["-60px", "-30px", "-12deg", 0])}
          className="block w-24 shrink-0 sm:w-40"
        >
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
            style={vt("org-role-supplier", "org-piece", ["50px", "-20px", "4deg", 100])}
            className="w-fit text-[2.5rem] font-bold leading-none tracking-[-0.02em] sm:text-6xl xl:text-7xl"
          >
            {c.role}
          </h2>
          <p
            style={vt("org-name-supplier", "org-piece", ["-30px", "40px", "-3deg", 160])}
            className="mt-3 w-fit text-xl font-semibold text-achit-blue sm:text-2xl"
          >
            {c.name}
          </p>
        </div>
      </div>
      <p
        style={vt("org-tag-supplier", "org-piece", ["20px", "50px", "2deg", 220])}
        className="mt-6 max-w-[40ch] text-[17px] leading-[1.5] [text-wrap:pretty] sm:text-lg lg:max-w-[52%]"
      >
        {c.tagline}
      </p>
      <div
        style={vt("org-slogan-supplier", "org-piece", ["60px", "20px", "4deg", 280])}
        className="mt-8 w-fit lg:absolute lg:right-14 lg:top-1/2 lg:mt-0 lg:-translate-y-1/2"
      >
        <AchitSlogan className="text-[1.875rem] sm:text-[2.5rem] xl:text-[3rem]" />
      </div>
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
