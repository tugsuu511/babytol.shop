import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StockistFinder } from "@/components/where-to-buy/stockist-finder";
import { products } from "@/lib/products";
import { regions, totalStockists } from "@/lib/stockists";

// Эх сурвалж: "татан авалт нэрс.pdf" — Babytol татан авсан эмийн сангууд (эмнэлгийг хассан) (src/lib/stockists-data.ts).
// Нөөц эмийн сан бүрт өөр байж болох тул "заавал байгаа" гэж амлахгүй.

export const metadata: Metadata = {
  title: "Хаанаас авах — Babytol-той эмийн сангууд | Babytol",
  description: `Улаанбаатар болон орон нутгийн ${totalStockists} эмийн сангаас Babytol D3, D3 + K1, D3 + DHA Omega, DHA Omega-г аваарай.`,
};

const ubCount = regions.filter((r) => r.group === "ub").length;
const aimagCount = regions.filter((r) => r.group === "aimag").length;

export default function WhereToBuyPage() {
  return (
    <article>
      <Hero />
      <StockistFinder regions={regions} />
      <Help />
    </article>
  );
}

function Hero() {
  return (
    <section aria-labelledby="wtb-title" className="relative overflow-x-clip bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="motion-safe:animate-rise">
          <h1
            id="wtb-title"
            className="text-[2.25rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink [text-wrap:balance] sm:text-5xl xl:text-[3.5rem]"
          >
            <span className="text-brand-red">Өөрт ойр байрлах эмийн сангаас</span> Babytol-оо аваарай
          </h1>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-ink-muted [text-wrap:pretty] sm:text-lg">
            Улаанбаатарын {ubCount} дүүрэг, орон нутгийн {aimagCount} аймгийн{" "}
            <span className="font-semibold text-ink">{totalStockists} эмийн санд</span> Babytol
            нийлүүлэгдсэн.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#shop"
              className="inline-flex min-h-12 items-center rounded-full bg-brand-red px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#B01F28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              Онлайнаар захиалах
            </Link>
          </div>
        </div>

        {/* Эмийн сангаас юуг асуух вэ — 4 SKU-г тэнцүү жинтэй */}
        <div className="motion-safe:animate-rise [animation-delay:120ms]">
          <p className="text-[15px] font-semibold text-ink">Эмийн сангаас нэрээр нь асуугаарай</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-2">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
                >
                  <span className="relative block aspect-[1.83] w-full">
                    <span aria-hidden className="absolute inset-x-[12%] -bottom-1 h-2.5 rounded-[50%] bg-ink/15 blur-md" />
                    <Image
                      src={p.packshot}
                      alt=""
                      fill
                      priority
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 22vw, 44vw"
                      className="object-contain transition-transform duration-500 ease-out group-hover:-translate-y-1"
                    />
                  </span>
                  <span className="mt-3 flex items-center gap-2 text-sm font-bold leading-tight text-ink">
                    <span aria-hidden className="h-[3px] w-4 shrink-0 rounded-full" style={{ background: p.accent }} />
                    {p.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Help() {
  return (
    <section aria-labelledby="help-title" className="bg-ivory-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16 lg:px-8">
        <div>
          <h2 id="help-title" className="text-3xl font-bold leading-[1.15] text-ink [text-wrap:balance] sm:text-4xl">
            Ойролцоо эмийн сангаа олсонгүй юу?
          </h2>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-ink-muted [text-wrap:pretty]">
            Эмийн сан бүрийн нөөц өөр өөр байдаг. Очихоосоо өмнө тухайн эмийн сангаас эсвэл албан ёсны нийлүүлэгч
            Ачит Фармаас лавлаарай. Онлайнаар захиалбал гэрт тань хүргэнэ.
          </p>
          <Link
            href="/#shop"
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-brand-red px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#B01F28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            Онлайнаар захиалах
          </Link>
        </div>

        <dl className="divide-y divide-line rounded-2xl border border-line bg-white px-5 shadow-[0_24px_48px_-32px_rgba(41,50,58,0.35)] sm:px-7">
          <div className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
            <dt className="text-sm font-semibold text-ink-muted">Нийлүүлэгч</dt>
            <dd className="text-[17px] font-semibold text-ink">Ачит Фарм</dd>
          </div>
          <div className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
            <dt className="text-sm font-semibold text-ink-muted">Утас</dt>
            <dd className="text-[17px] font-semibold text-ink">
              <a href="tel:+97691929698" className="underline-offset-4 hover:underline">
                9192-9698
              </a>
              {", "}
              <a href="tel:+97677079192" className="underline-offset-4 hover:underline">
                7707-9192
              </a>
            </dd>
          </div>
          <div className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
            <dt className="text-sm font-semibold text-ink-muted">Имэйл</dt>
            <dd className="text-[17px] font-semibold text-ink">
              <a href="mailto:sales@achitpharma.mn" className="underline-offset-4 hover:underline">
                sales@achitpharma.mn
              </a>
            </dd>
          </div>
          <div className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
            <dt className="text-sm font-semibold text-ink-muted">Ажлын цаг</dt>
            <dd className="text-[17px] font-semibold text-ink">Даваа – Баасан, 08:30 – 17:30</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
