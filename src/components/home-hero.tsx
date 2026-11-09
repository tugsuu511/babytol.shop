import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { SwissSeal } from "@/components/swiss-seal";
import { products } from "@/lib/products";

// Packshot бүрийн эх хэмжээ (харьцааг хадгална) ба hero дээрх богино нэр
const packshots: Record<string, { w: number; h: number; label: string }> = {
  d3: { w: 1025, h: 557, label: "D3" },
  "d3-k1": { w: 459, h: 253, label: "D3 + K1" },
  "d3-dha-omega": { w: 1374, h: 748, label: "D3 + DHA Omega" },
  "dha-omega": { w: 1028, h: 564, label: "DHA Omega" },
};

/** Ээж, хүүхдийн фото — mobile/desktop-д өөр crop (art direction). Зөвхөн нэг нь татагдана. */
function HeroPhoto() {
  const common = { alt: "", sizes: "(min-width: 1024px) 54vw, 100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/brand/hero/mother-baby-wide.webp", width: 690, height: 800 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/brand/hero/mother-baby-tall.webp", width: 1196, height: 855 });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop} />
      <source srcSet={mobile} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- getImageProps art direction; alt="" (чимэглэл) rest дотор бий */}
      <img
        {...rest}
        fetchPriority="high"
        loading="eager"
        className="h-full w-full object-cover object-[60%_center] lg:object-[30%_20%]"
      />
    </picture>
  );
}

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#fdfcfa_0%,#f8f5f0_100%)]"
    >
      {/* Цонхны гэрэл, ургамлын бүдэг туяа — фотоны зүүн талын уур амьсгалыг үргэлжлүүлнэ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-[#9cc48a]/15 blur-3xl" />
        <div className="absolute -top-32 left-1/3 h-[360px] w-[520px] rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:static lg:flex lg:min-h-[clamp(620px,calc(100svh-83px),800px)] lg:items-center lg:px-8 lg:py-16">
        <div className="lg:max-w-[50%] xl:max-w-[700px]">
          {/* Швейцарь бренд — Монголд */}
          <div className="motion-safe:animate-rise relative z-10 mb-6 inline-flex items-center gap-3 rounded-full border border-line bg-white/80 py-1.5 pl-1.5 pr-5 shadow-[0_8px_24px_-14px_rgba(41,50,58,0.35)] backdrop-blur-sm lg:mb-8">
            <SwissSeal className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
            <p className="leading-tight">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Swiss Premium Quality
              </span>
              <span className="block text-[15px] font-bold text-ink sm:text-base">
                Швейцарь бренд — <span className="text-brand-red">Монголд</span>
              </span>
            </p>
          </div>

          <h1
            id="hero-title"
            className="motion-safe:animate-rise relative z-10 font-bold uppercase leading-[1.05] tracking-[-0.01em]"
          >
            <span className="block text-[1.75rem] text-ink sm:text-[2.5rem] lg:whitespace-nowrap lg:text-[1.75rem] xl:text-[2.5rem]">
              Бяцхан өсөлт <br className="lg:hidden" />
              бүрийн цаана
            </span>
            <span className="mt-2 block text-[2.75rem] text-brand-red sm:text-[4rem] lg:mt-3 lg:whitespace-nowrap lg:text-[3.25rem] xl:text-[4.5rem]">
              Том хайр бий.
            </span>
          </h1>

          {/* Фото: mobile дээр гарчгийн доор урсгалд, desktop дээр баруун талд бүтэн өндрөөр */}
          <div
            className={[
              "relative -mx-4 -mt-4 aspect-[1196/855] sm:-mx-6",
              "[mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%,#000_78%,transparent_100%)]",
              "lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:m-0 lg:aspect-auto lg:w-[54%] xl:w-[min(52%,860px)]",
              "lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_16%),linear-gradient(to_top,transparent_0%,#000_22%)] lg:[mask-composite:intersect]",
            ].join(" ")}
          >
            <HeroPhoto />
          </div>

          <p className="motion-safe:animate-rise relative -mt-6 max-w-xl text-[17px] leading-[1.55] text-ink [animation-delay:120ms] sm:text-lg lg:mt-7 xl:text-xl">
            <strong className="font-semibold">Babytol</strong> — Ачит Фарм-ын хүүхдэд зориулсан шим
            тэжээлийн бүтээгдэхүүний цуврал.
          </p>

          <ul className="motion-safe:animate-rise relative mt-8 grid grid-cols-2 gap-x-4 gap-y-7 [animation-delay:220ms] sm:grid-cols-4 sm:gap-x-5 pb-14 lg:mt-10 lg:pb-0">
            {products.map((p) => {
              const s = packshots[p.slug];
              return (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
                  >
                    <span className="relative block">
                      <span
                        aria-hidden
                        className="absolute inset-x-[8%] -bottom-1.5 h-3 rounded-[50%] bg-ink/15 blur-md transition-opacity group-hover:opacity-60"
                      />
                      <Image
                        src={p.packshot}
                        alt={p.name}
                        width={s.w}
                        height={s.h}
                        sizes="(min-width: 1280px) 150px, (min-width: 640px) 22vw, 44vw"
                        className="relative h-auto w-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
                      />
                    </span>
                    <span className="mt-4 block text-[15px] font-bold leading-tight text-ink xl:text-base">
                      <span
                        aria-hidden
                        className="mb-2 block h-[3px] w-6 rounded-full transition-all duration-300 group-hover:w-10"
                        style={{ background: p.accent }}
                      />
                      {s.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
