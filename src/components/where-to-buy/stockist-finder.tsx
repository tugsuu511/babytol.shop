"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import { filterRegions, type Region, type RegionGroup } from "@/lib/stockists";

const groups: { id: RegionGroup | "all"; label: string }[] = [
  { id: "all", label: "Бүгд" },
  { id: "ub", label: "Улаанбаатар" },
  { id: "aimag", label: "Орон нутаг" },
];

const count = (list: Region[]) => list.reduce((n, r) => n + r.stockists.length, 0);

export function StockistFinder({ regions }: { regions: Region[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<RegionGroup | "all">("all");
  const [regionId, setRegionId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const searchId = useId();

  const groupRegions = useMemo(
    () => regions.filter((r) => group === "all" || r.group === group),
    [regions, group],
  );
  const results = useMemo(
    () => filterRegions(regions, { query: deferredQuery, group, regionId }),
    [regions, deferredQuery, group, regionId],
  );
  const total = count(results);
  const filtered = Boolean(query.trim()) || regionId !== null;

  const reset = () => {
    setQuery("");
    setRegionId(null);
    setGroup("all");
  };

  return (
    <section aria-labelledby="finder-title" className="bg-white">
      <h2 id="finder-title" className="sr-only">
        Эмийн сан хайх
      </h2>

      {/* Хайлт ба шүүлтүүр — header-ийн доор наалдана */}
      <div className="sticky top-[67px] z-30 border-b border-line bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/85 lg:top-[83px]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
            <div className="relative flex-1">
              <label htmlFor={searchId} className="sr-only">
                Эмийн сан, салбар эсвэл аймаг, дүүргийн нэрээр хайх
              </label>
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Нэр, салбар, аймаг, дүүрэг"
                autoComplete="off"
                enterKeyHint="search"
                className="h-12 w-full rounded-full border border-line bg-ivory pl-12 pr-12 text-base text-ink caret-brand-red outline-none transition-[border-color,box-shadow] placeholder:text-ink-muted/80 focus:border-ink/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(204,36,46,0.12)] [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Хайлтыг арилгах"
                  className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-ink-muted transition-colors hover:bg-ivory-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            <div role="radiogroup" aria-label="Байршил" className="flex shrink-0 rounded-full bg-ivory-200 p-1">
              {groups.map((g) => {
                const active = group === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setGroup(g.id);
                      setRegionId(null);
                    }}
                    className={`min-h-10 flex-1 whitespace-nowrap rounded-full px-3 text-[15px] sm:px-4 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:flex-none ${
                      active ? "bg-white text-ink shadow-[0_2px_8px_rgba(41,50,58,0.12)]" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 sm:pb-28 lg:px-8">
          {/* Аймаг, дүүрэг — mobile дээр хэвтээ гүйлгэнэ; наалдахгүй, жагсаалтыг халхлахгүй */}
          <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
            <ul className="flex w-max gap-2 pb-0.5 lg:w-auto lg:flex-wrap" aria-label="Аймаг, дүүрэг сонгох">
              <li>
                <Chip active={regionId === null} onClick={() => setRegionId(null)}>
                  {group === "ub" ? "Бүх дүүрэг" : group === "aimag" ? "Бүх аймаг" : "Бүгд"}
                  <Count>{count(groupRegions)}</Count>
                </Chip>
              </li>
              {groupRegions.map((r) => (
                <li key={r.id}>
                  <Chip active={regionId === r.id} onClick={() => setRegionId(regionId === r.id ? null : r.id)}>
                    {r.name}
                    <Count>{r.stockists.length}</Count>
                  </Chip>
                </li>
              ))}
            </ul>
          </div>

        <p aria-live="polite" className="mt-6 text-[15px] text-ink-muted">
          {total > 0 ? (
            <>
              <span className="font-semibold tabular-nums text-ink">{total}</span> газар
              {results.length > 1 && (
                <>
                  , <span className="tabular-nums">{results.length}</span>{" "}
                  {group === "ub" ? "дүүрэгт" : group === "aimag" ? "аймагт" : "бүс нутагт"}
                </>
              )}
            </>
          ) : (
            "Илэрц олдсонгүй"
          )}
          {filtered && total > 0 && (
            <button
              type="button"
              onClick={reset}
              className="ml-3 font-semibold text-brand-red underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-brand-red"
            >
              Шүүлтүүрийг цэвэрлэх
            </button>
          )}
        </p>

        {total === 0 ? (
          <EmptyState query={query} onReset={reset} />
        ) : (
          <div className="mt-6 space-y-14 sm:space-y-16">
            {results.map((r) => (
              <RegionBlock key={r.id} region={r} query={deferredQuery} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RegionBlock({ region, query }: { region: Region; query: string }) {
  const headingId = `region-${region.id}`;
  return (
    <section aria-labelledby={headingId} className="scroll-mt-48">
      <div className="flex items-baseline gap-3 border-b-2 border-ink pb-3">
        <h3 id={headingId} className="text-2xl font-bold leading-tight text-ink sm:text-[1.75rem]">
          {region.name}
        </h3>
        <span className="text-[15px] font-semibold text-ink-muted">
          {region.group === "ub" ? "Улаанбаатар" : "аймаг"}
        </span>
        <span className="ml-auto text-[15px] tabular-nums text-ink-muted">{region.stockists.length}</span>
      </div>

      <ul className="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
        {region.stockists.map((s) => (
          <li key={s.id} className="flex items-start gap-3 border-b border-line py-3.5">
            <PinIcon className="mt-[3px] shrink-0 text-brand-red" />
            <div className="min-w-0">
              <p className="text-base font-semibold leading-snug text-ink [overflow-wrap:anywhere]">
                <Highlight text={s.name} query={query} />
              </p>
              {s.detail && (
                <p className="mt-0.5 text-sm leading-snug text-ink-muted [overflow-wrap:anywhere]">
                  <Highlight text={s.detail} query={query} />
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="mt-8 rounded-[1.5rem] bg-ivory-200 px-6 py-12 text-center sm:px-10 sm:py-16">
      <p className="text-xl font-bold text-ink [text-wrap:balance]">
        {query.trim() ? <>“{query.trim()}” нэртэй газар жагсаалтад алга</> : "Энэ шүүлтүүрт тохирох газар алга"}
      </p>
      <p className="mx-auto mt-3 max-w-[46ch] text-base leading-relaxed text-ink-muted [text-wrap:pretty]">
        Нэрийн хэсгээр (жишээ нь “Монос”, “Нил фарм”) эсвэл аймаг, дүүргийн нэрээр хайж үзээрэй. Олдохгүй бол
        нийлүүлэгчээс лавлаарай.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 rounded-full bg-ink px-5 text-[15px] font-semibold text-white transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Бүх жагсаалтыг харах
        </button>
        <a
          href="tel:+97691929698"
          className="inline-flex min-h-11 items-center rounded-full border border-ink/20 bg-white px-5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          9192-9698 руу залгах
        </a>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink hover:border-ink/30 hover:bg-ivory-200"
      }`}
    >
      {children}
    </button>
  );
}

function Count({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold tabular-nums opacity-70">{children}</span>;
}

/** Хайсан үгийг тодруулна (том жижиг үсэг үл хамаарна) */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLocaleLowerCase("mn");
  if (!q) return <>{text}</>;
  const i = text.toLocaleLowerCase("mn").indexOf(q);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-brand-orange/35 px-0.5 text-ink">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className={className}>
      <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden className={className}>
      <path
        d="M8 17s6-5.2 6-10A6 6 0 0 0 2 7c0 4.8 6 10 6 10Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="7" r="2" fill="currentColor" />
    </svg>
  );
}
