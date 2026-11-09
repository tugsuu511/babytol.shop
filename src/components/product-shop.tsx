import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/add-to-cart";
import { formatPrice, products, type Product } from "@/lib/products";

/** Нүүр хуудасны "Захиалах" хэсэг — SKU бүр үнэ, тоо ширхэг, сагсанд нэмэх товчтой. */
export function ProductShop() {
  return (
    <section id="shop" aria-labelledby="shop-title" className="scroll-mt-24 bg-ivory-200 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">Онлайн захиалга</p>
          <h2 id="shop-title" className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Сагсандаа нэмээд захиалаарай
          </h2>
          <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">
            Хүүхдийнхээ хэрэгцээнд тохирох найрлагыг сонгож, хэдэн хайрцаг авахаа заана уу.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  return (
    <article
      className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_-16px_rgba(41,50,58,0.25)]"
      style={{ borderTopColor: p.accent, borderTopWidth: 4 }}
    >
      <Link href={`/products/${p.slug}`} className="group block rounded-lg">
        <span className="relative block aspect-[1.83] w-full">
          <Image
            src={p.packshot}
            alt=""
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 90vw"
            className="object-contain transition-transform duration-500 group-hover:-translate-y-1"
          />
        </span>
        <h3 className="mt-5 text-lg font-bold leading-tight text-ink group-hover:underline">{p.name}</h3>
      </Link>

      <p className="mt-4 text-2xl font-bold tabular-nums text-ink">
        {formatPrice(p.price)}
        <span className="ml-1 text-sm font-medium text-ink-muted">/ хайрцаг</span>
      </p>

      <div className="mt-auto pt-5">
        <AddToCart slug={p.slug} name={p.name} />
      </div>
    </article>
  );
}
