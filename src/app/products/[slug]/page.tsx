import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type CSSProperties } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { ProductMotif } from "@/components/product-motif";
import { SwissSeal } from "@/components/swiss-seal";
import { packInfo, productContent } from "@/lib/product-content";
import { formatPrice, productBySlug, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  const c = productContent[slug];
  if (!p || !c) return {};
  return {
    title: `${p.name} — ${c.tagline} | 4U Pharma`,
    description: c.lead,
  };
}

const steps = [
  { title: "Мушгина", body: "Мушгидаг капсулын тагийг эргүүлж салгана." },
  { title: "Шахна", body: "Мушгидаг капсулыг зөөлөн шахна." },
  { title: "Өгнө", body: "Хүүхдийн аманд шууд, халбаганд эсвэл сүүнд хольж өгнө." },
];

// partialPrefetching: App Shell нь бүх slug-д нийтлэг тул params-ийг Suspense дотор уншина.
// generateStaticParams-аар 4 хуудас бүрэн HTML-ээр prerender хийгдэх тул skeleton нь
// зөвхөн client navigation-ий үед агуулга ирэх хүртэл богино хугацаанд харагдана.
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

/** Hero-ийн хэлбэртэй placeholder — layout shift гаргахгүй */
function ProductSkeleton() {
  return (
    <div aria-busy="true" aria-label="Ачаалж байна" className="bg-ivory-200">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8 lg:pb-16 lg:pt-8">
        <div className="order-2 space-y-4 motion-safe:animate-pulse lg:order-1">
          <div className="h-4 w-48 rounded bg-ivory-300" />
          <div className="h-7 w-40 rounded-full bg-ivory-300" />
          <div className="h-14 w-4/5 rounded-lg bg-ivory-300" />
          <div className="h-7 w-3/5 rounded bg-ivory-300" />
          <div className="h-24 w-full max-w-xl rounded bg-ivory-300" />
          <div className="h-36 w-full max-w-xl rounded-2xl bg-white" />
        </div>
        <div className="order-1 aspect-[4/3] rounded-3xl bg-ivory-300 motion-safe:animate-pulse lg:order-2 lg:aspect-square" />
      </div>
      <div className="h-[72px] bg-ivory-300" />
    </div>
  );
}

async function ProductDetails({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const p = productBySlug(slug);
  const c = productContent[slug];
  if (!p || !c) notFound();

  const t = c.theme;
  // SKU-ийн өнгийг CSS хувьсагчаар дамжуулна — Tailwind-д arbitrary value-аар хэрэглэнэ
  const vars = {
    "--band": t.band,
    "--stripe": t.stripe,
    "--heading": t.heading,
    "--ink-accent": t.ink,
    "--accent2": t.accent2,
    "--soft": t.soft,
  } as CSSProperties;
  const others = products.filter((o) => o.slug !== p.slug);

  return (
    <article style={vars}>
      {/* ── Hero ── */}
      <section
        aria-labelledby="product-title"
        className="relative isolate overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${t.heroFrom} 0%, ${t.heroTo} 100%)` }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8 lg:pb-16 lg:pt-8">
          <div className="order-2 lg:order-1">
            <nav aria-label="Байршил" className="text-[13px] font-medium text-ink-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href="/" className="hover:text-ink hover:underline">Нүүр</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/#shop" className="hover:text-ink hover:underline">Бүтээгдэхүүн</Link></li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink">{p.name}</li>
              </ol>
            </nav>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-1.5 text-[13px] font-bold text-[var(--ink-accent)] shadow-[0_4px_14px_-8px_rgba(41,50,58,0.35)]">
              <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--band)]" />
              {c.age}
            </p>

            <h1 id="product-title" className="mt-4 text-4xl font-bold leading-[1.08] tracking-[-0.01em] text-ink sm:text-5xl xl:text-[3.5rem]">
              {p.name}
            </h1>
            <p className="mt-3 text-xl font-bold leading-snug text-[var(--ink-accent)] sm:text-2xl">{c.tagline}</p>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink">{c.lead}</p>

            <div className="mt-8 max-w-xl rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_12px_32px_-20px_rgba(41,50,58,0.4)] backdrop-blur-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-3xl font-bold tabular-nums text-ink">{formatPrice(p.price)}</p>
                {/* Өдөрт 2 капсул уувал хайрцаг сар хүрэхгүй тул "нэг сарын хэрэглээ"-г зөвхөн 1 тунтай SKU-д бичнэ */}
                <p className="text-sm text-ink-muted">{c.dosage ? "30 мушгидаг капсул" : packInfo}</p>
              </div>
              <div className="mt-4">
                <AddToCart slug={p.slug} name={p.name} color={t.cta} hoverColor={t.ctaHover} size="lg" />
              </div>
            </div>
          </div>

          <div className="relative order-1 aspect-[4/3] lg:order-2 lg:aspect-square">
            <ProductMotif slug={p.slug} />
            <div className="absolute inset-[6%] flex items-center justify-center">
              <div className="relative w-full">
                <span aria-hidden className="absolute inset-x-[10%] -bottom-3 h-6 rounded-[50%] bg-ink/20 blur-xl" />
                <Image
                  src={p.packshot}
                  alt={`${p.name} хайрцаг`}
                  width={c.packshotSize.w}
                  height={c.packshotSize.h}
                  priority
                  sizes="(min-width: 1024px) 560px, 92vw"
                  className="motion-safe:animate-rise relative h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Leaflet-ийн өнгөт тууз */}
        <div className="border-t-4 border-[var(--stripe)] bg-[var(--band)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-white sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p className="text-xl font-bold">Нэг мушгидаг капсулын агууламж</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {c.composition.map((x) => (
                <li key={x.label} className="text-xl font-bold">
                  {x.label}: <span className="tabular-nums">{x.value} {x.unit}</span>
                  {x.sub && <span className="font-semibold opacity-90"> ({x.sub})</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Яагаад чухал вэ ── */}
      <section aria-labelledby="why-title" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="why-title" className="text-3xl font-bold leading-tight text-[var(--heading)] sm:text-4xl">
            Яагаад чухал вэ?
          </h2>
          <span aria-hidden className="mt-4 block h-1 w-16 rounded-full bg-[var(--accent2)]" />
          <ol className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {c.why.map((w, i) => (
              <li key={w.title} className="border-t-2 border-[var(--soft)] pt-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--soft)] text-base font-bold text-[var(--ink-accent)]">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold leading-snug text-ink">{w.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{w.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Гол санаа (leaflet-ийн KEY MESSAGES) ── */}
      <section aria-labelledby="key-title" className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2rem] bg-[var(--soft)] px-5 pb-8 pt-12 sm:px-10 sm:pb-10">
            <h2
              id="key-title"
              className="absolute -top-5 left-6 rounded-full bg-[var(--accent2)] px-6 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-ink shadow-[0_8px_20px_-10px_rgba(41,50,58,0.5)] sm:left-10"
            >
              Гол санаа
            </h2>
            <dl className={`grid gap-4 sm:grid-cols-2 ${c.keyMessages.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
              {c.keyMessages.map((k) => (
                <div key={k.label} className="rounded-2xl bg-white p-5">
                  <dt className="inline-block rounded-md bg-[var(--ink-accent)] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.06em] text-white">
                    {k.label}
                  </dt>
                  <dd className="mt-3 text-[15px] font-semibold leading-snug text-ink">{k.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Хэрэглэх ── */}
      <section aria-labelledby="how-title" className="bg-ivory-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:px-8">
          <div>
            <h2 id="how-title" className="text-3xl font-bold leading-tight text-[var(--heading)] sm:text-4xl">
              {c.dosage ? "Хэрэглэх тун" : "Өдөрт ердөө 1 мушгидаг капсул"}
            </h2>
            {c.dosage && (
              <dl className="mt-5 grid max-w-md gap-2">
                {c.dosage.map((d) => (
                  <div key={d.age} className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3">
                    <dt className="text-[15px] text-ink-muted">{d.age}</dt>
                    <dd className="text-[15px] font-bold text-ink">{d.amount}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-muted">
              Тунг урьдчилан хэмжсэн мушгидаг капсул — хэмжих, хольж бэлтгэх шаардлагагүй.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl bg-white p-6">
                <span className="text-4xl font-bold tabular-nums text-[var(--heading)]">{i + 1}</span>
                <h3 className="mt-3 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Чанар ── */}
      <section aria-labelledby="quality-title" className="bg-white py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:items-start sm:gap-10 sm:text-left">
          <SwissSeal className="h-28 w-28 shrink-0" />
          <div>
            <h2 id="quality-title" className="text-2xl font-bold leading-tight text-ink sm:text-3xl">
              {c.quality.title}
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">{c.quality.body}</p>
            <p className="mt-6 border-l-4 border-[var(--accent2)] pl-4 text-left text-sm leading-relaxed text-ink-muted">
              Хэрэглэхийн өмнө хүүхдийн эмчтэйгээ зөвлөлдөнө үү. Хэд хэдэн Babytol бүтээгдэхүүнийг хамт хэрэглэх эсэхийг
              эмчийн зөвлөгөөгөөр шийднэ.
            </p>
          </div>
        </div>
      </section>

      {/* ── Бусад бүтээгдэхүүн ── */}
      <section aria-labelledby="others-title" className="border-t border-line bg-ivory py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="others-title" className="text-2xl font-bold text-ink">Babytol-ын бусад бүтээгдэхүүн</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/products/${o.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_-18px_rgba(41,50,58,0.4)]"
                  style={{ borderTopColor: o.accent, borderTopWidth: 4 }}
                >
                  <span className="relative block aspect-[1.83] w-full">
                    <Image src={o.packshot} alt="" fill sizes="(min-width: 640px) 30vw, 90vw" className="object-contain transition-transform duration-500 group-hover:-translate-y-1" />
                  </span>
                  <span className="mt-4 flex items-center justify-between gap-3">
                    <span className="font-bold text-ink">{o.name}</span>
                    <span className="text-sm font-semibold tabular-nums text-ink-muted">{formatPrice(o.price)}</span>
                  </span>
                  <span className="mt-1 text-sm text-ink-muted">{productContent[o.slug]?.age}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
