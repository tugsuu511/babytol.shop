"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Мушгидаг капсул",
    body: "Нэг мушгидаг капсул — нэг удаагийн тун. Тунг урьдчилан хэмжсэн twist-off савлагаатай.",
  },
  {
    title: "Тагийг эргүүлнэ",
    body: "Мушгидаг капсулын дээд хэсгийг (таг) эргүүлнэ.",
  },
  {
    title: "Татаж аваад хаяна",
    body: "Эргүүлсэн тагийг татаж аваад хаяна.",
  },
  {
    title: "Шахаж өгнө",
    body: "Мушгидаг капсулыг шахаж, хүүхдийн аманд шууд хийнэ. Мөн халбагаар өгөх эсвэл сүүтэй хольж өгч болно.",
  },
] as const;

/** Twist-off капсулын SVG. Төлөвийг эцэг элементийн data-step удирдана (globals.css → .capsule-stage). */
function CapsuleArt() {
  return (
    <svg viewBox="0 40 200 310" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="cap-gel" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="0.45" stopColor="#f7bd12" />
          <stop offset="1" stopColor="#d98500" />
        </linearGradient>
        <radialGradient id="cap-glow" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#fff6c9" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6c9" stopOpacity="0" />
        </radialGradient>
        <marker id="cap-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-brand-green)" />
        </marker>
      </defs>

      {/* Сүүдэр */}
      <ellipse className="cap-shadow" cx="100" cy="326" rx="44" ry="7" fill="#29323a" opacity="0.12" />

      <g className="cap-rotate">
        <g className="cap-float">
          <g className="cap-squeeze">
            {/* Их бие + хүзүү */}
            <rect x="60" y="118" width="80" height="184" rx="40" fill="url(#cap-gel)" />
            <path d="M80 134 C84 118 92 110 92 100 L108 100 C108 110 116 118 120 134 Z" fill="url(#cap-gel)" />
            <rect x="60" y="118" width="80" height="184" rx="40" fill="url(#cap-glow)" />
            <rect x="71" y="142" width="11" height="120" rx="5.5" fill="#fff" opacity="0.55" />
            <ellipse cx="118" cy="270" rx="6" ry="14" fill="#fff" opacity="0.25" />
            {/* Нээгдсэн ам */}
            <ellipse className="cap-lip" cx="100" cy="100" rx="8" ry="2.6" fill="#b86f00" />
          </g>

          {/* Twist-off үзүүр */}
          <g className="cap-tip">
            <g className="cap-tip-spin">
              <path
                d="M93 102 L93 88 C80 87 71 79 73 69 C75 58 90 56 100 61 C110 56 125 58 127 69 C129 79 120 87 107 88 L107 102 Z"
                fill="url(#cap-gel)"
              />
              <ellipse cx="88" cy="68" rx="7" ry="4" fill="#fff" opacity="0.6" />
            </g>
          </g>
        </g>
      </g>

      {/* 2-р алхам: мушгих сум */}
      <path
        className="cap-twist-arrow"
        d="M50 92 A50 14 0 0 0 150 92"
        fill="none"
        stroke="var(--color-brand-green)"
        strokeWidth="7"
        strokeLinecap="round"
        markerEnd="url(#cap-arrow)"
        pathLength="1"
      />

      {/* 4-р алхам: шахах сумнууд */}
      <g className="cap-press" stroke="var(--color-brand-green)" strokeWidth="7" strokeLinecap="round" fill="none">
        <path className="cap-press-r" d="M186 240 Q172 226 156 225" markerEnd="url(#cap-arrow)" />
        <path className="cap-press-l" d="M14 170 Q28 186 44 187" markerEnd="url(#cap-arrow)" />
      </g>

      {/* 4-р алхам: дусал */}
      <path
        className="cap-drop"
        d="M64 300 C68 309 72 313 72 318 A8 8 0 0 1 56 318 C56 313 60 309 64 300 Z"
        fill="url(#cap-gel)"
      />
    </svg>
  );
}

const chips = ["Урьдчилан хэмжсэн тун", "Хэрэглэхэд хялбар савлагаа", "Нэг удаагийн хэрэглээ"];

function Intro({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-green">Хэрэглэх заавар</p>
      <h2 className="mt-3 text-[2rem] font-bold uppercase leading-[1.05] text-brand-red sm:text-[2.75rem] xl:text-[3.25rem]">
        Мушгидаг капсул.
        <br />
        Тодорхой тун.
      </h2>
      <p className="mt-5 max-w-lg text-[17px] leading-[1.6] text-ink sm:text-lg">
        Twist-off савлагаанд бүтээгдэхүүний тунг урьдчилан хэмжсэн байдаг. Тагийг нь эргүүлж аваад агуулгыг нь
        шахаж өгөхөд л болно.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2.5">
        {chips.map((t) => (
          <li
            key={t}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CapsuleUsage() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Track-ийн scroll явцыг 4 хэсэгт хувааж идэвхтэй алхмыг тодорхойлно
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      const panel = panelRef.current;
      if (!track || !panel) return;
      const top = parseFloat(getComputedStyle(panel).top) || 0;
      const distance = track.offsetHeight - panel.offsetHeight;
      const progress = distance > 0 ? (top - track.getBoundingClientRect().top) / distance : 0;
      const i = Math.min(steps.length - 1, Math.max(0, Math.floor(progress * steps.length)));
      setActive(i);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const panel = panelRef.current;
    if (!track || !panel) return;
    const distance = track.offsetHeight - panel.offsetHeight;
    const top = parseFloat(getComputedStyle(panel).top) || 0;
    const y = track.getBoundingClientRect().top + window.scrollY - top + distance * ((i + 0.5) / steps.length);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="usage" aria-label="Мушгидаг капсулын хэрэглэх заавар" className="relative scroll-mt-20 bg-[linear-gradient(180deg,#f8f5f0_0%,#fffefc_100%)]">
      {/* Mobile: танилцуулга sticky самбараас гадна */}
      <Intro className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:hidden" />

      {/* Scroll track — өндөр нь алхам солигдох зайг өгнө */}
      <div ref={trackRef} className="relative h-[calc(100svh+4*40svh)] lg:h-[calc(100svh+4*45svh)]">
        <div
          ref={panelRef}
          className="sticky top-[67px] mx-auto flex h-[calc(100svh-67px)] max-w-7xl flex-col justify-center gap-5 px-4 py-4 sm:px-6 lg:top-[83px] lg:grid lg:h-[calc(100svh-83px)] lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-10"
        >
          {/* Зүүн: мэдээлэл + нэг байрлалд солигдох алхам */}
          <div className="order-2 lg:order-none">
            <Intro className="hidden lg:block" />

            <div className="lg:mt-10 lg:border-t lg:border-line lg:pt-8">
              <div className="grid" aria-live="polite">
                {steps.map((s, i) => (
                  <div
                    key={s.title}
                    aria-hidden={i !== active}
                    className={`col-start-1 row-start-1 transition-all duration-500 ease-out ${
                      i === active
                        ? "translate-y-0 opacity-100"
                        : `pointer-events-none opacity-0 ${i < active ? "motion-safe:-translate-y-3" : "motion-safe:translate-y-3"}`
                    }`}
                  >
                    <p className="font-bold tabular-nums text-brand-green">
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-ink/30"> / {String(steps.length).padStart(2, "0")}</span>
                    </p>
                    <h3 className="mt-1.5 text-2xl font-bold text-ink sm:text-3xl">{s.title}</h3>
                    <p className="mt-2 max-w-md text-base leading-[1.6] text-ink-muted sm:text-[17px]">{s.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-brand-green lg:mt-6">Бүтээгдэхүүний зааврын дагуу хэрэглэнэ.</p>
            </div>
          </div>

          {/* Баруун: хөдөлгөөнт үзүүлэн */}
          <div className="order-1 lg:order-none">
            <div
              data-step={active + 1}
              className="capsule-stage relative mx-auto flex h-[42svh] max-h-[360px] w-full max-w-[520px] items-center justify-center overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(41,50,58,0.25)] lg:aspect-[4/5] lg:h-auto lg:max-h-[calc(100svh-83px-7rem)]"
            >
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(120%_100%_at_50%_100%,rgba(0,167,133,0.08),transparent_70%)]" />
              <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#0f6b4f] text-lg font-bold text-white lg:left-6 lg:top-6 lg:h-14 lg:w-14 lg:text-2xl">
                {active + 1}
              </span>
              <div className="relative h-[80%] w-full lg:h-[72%]">
                <CapsuleArt />
              </div>
            </div>

            {/* Явц */}
            <div className="mt-3 flex justify-center gap-2 lg:mt-5">
              {steps.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${i + 1}-р алхам: ${s.title}`}
                  aria-current={i === active ? "step" : undefined}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === active ? "w-10 bg-brand-green" : "w-4 bg-ink/15 hover:bg-ink/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
