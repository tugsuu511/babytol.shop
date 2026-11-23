import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

// Header-тэй ижил: дөрвөн SKU-ийн гол өнгөөр дээд зураас
const stripe = ["#F79E24", "#ED1072", "#00A785", "#CC242E"];

const infoLinks = [
  { href: "/about", label: "Бидний тухай" },
  { href: "/where-to-buy", label: "Хаанаас авах" },
  { href: "/terms", label: "Үйлчилгээний нөхцөл" },
];

const link =
  "rounded underline-offset-4 transition-colors hover:text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red";

export function SiteFooter() {
  return (
    <footer className="bg-white text-ink">
      <div aria-hidden className="flex h-1">
        {stripe.map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-12 lg:px-8 lg:py-16">
        <div>
          <Link href="/" aria-label="Babytol — нүүр хуудас" className="inline-block rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red">
            {/* Албан lockup (эх JPG, цагаан фон) — footer цагаан тул харьцаа, өнгө хэвээр */}
            <Image
              src="/brand/babytol-logo.jpg"
              alt="Babytol for you!"
              width={4133}
              height={1425}
              sizes="140px"
              className="h-11 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-[36ch] text-[15px] leading-[1.6] text-ink-muted [text-wrap:pretty]">
            Албан ёсны дистрибьютер Ачит Фарм
          </p>
        </div>

        <nav aria-labelledby="footer-products">
          <h2 id="footer-products" className="text-sm font-semibold text-ink-muted">
            Бүтээгдэхүүн
          </h2>
          <ul className="mt-4 grid gap-2.5 text-[15px] font-semibold">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} className={`inline-flex items-center gap-2 py-0.5 ${link}`}>
                  <span aria-hidden className="h-[3px] w-3.5 shrink-0 rounded-full" style={{ background: p.accent }} />
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-info">
          <h2 id="footer-info" className="text-sm font-semibold text-ink-muted">
            Мэдээлэл
          </h2>
          <ul className="mt-4 grid gap-2.5 text-[15px] font-semibold">
            {infoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`inline-block py-0.5 ${link}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-ink-muted">Холбоо барих</h2>
          <address className="mt-4 grid gap-2.5 text-[15px] not-italic leading-[1.5]">
            <span className="font-semibold">
              <a href="tel:+97691929698" className={link}>9192-9698</a>
              {", "}
              <a href="tel:+97677079192" className={link}>7707-9192</a>
            </span>
            <a href="mailto:sales@achitpharma.mn" className={`font-semibold ${link}`}>
              sales@achitpharma.mn
            </a>
            <span className="text-ink-muted">Даваа – Баасан, 08:30 – 17:30</span>
            <span className="text-ink-muted">Улаанбаатар, Хан-Уул дүүрэг, 3-р хороо, Алтаргана хотхон, 41г байр</span>
          </address>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Ачит Алтан Ундарга ХХК</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
            <li>
              <a href="https://www.facebook.com/Babytol.Mongolia" target="_blank" rel="noopener noreferrer" className={link}>
                Babytol Facebook
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/AchitAltanUndarga" target="_blank" rel="noopener noreferrer" className={link}>
                Ачит Фарм Facebook
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/achit.pharma" target="_blank" rel="noopener noreferrer" className={link}>
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
