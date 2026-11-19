import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { OrgExplorer } from "@/components/about/org-explorer";
import { SwissCross } from "@/components/swiss-cross";
import { SwissSeal } from "@/components/swiss-seal";
import { products } from "@/lib/products";

// Эх сурвалж (2026.11.19-нд авсан):
//  - Үйлдвэрлэгч: https://www.4upharma.com/en/page/about-us/1/
//  - Нийлүүлэгч:  https://achitpharma.com/about
// Тоо, амлалтыг зөвхөн эдгээр хуудсанд байгаагаар бичнэ — эх сайтад байхгүй мэдээлэл нэмэхгүй.

export const metadata: Metadata = {
  title: "Бидний тухай — Швейцарийн 4U Pharma ба Ачит Фарм | Babytol",
  description: "Babytol-ийг Швейцарийн 4U Pharma үйлдвэрлэж, Монголд Ачит Фарм (Ачит Алтан Ундарга ХХК) нийлүүлдэг.",
};

/* ───────────── Үйлдвэрлэгч — 4U Pharma ───────────── */

const makerPassport = [
  { label: "Улс", value: "Швейцарь" },
  {
    label: "Төв оффис",
    value: "Швейцарьт — технологи, эмнэлгийн бүтээгдэхүүний боловсруулалт, санхүүгийн хяналт",
  },
  { label: "Үйлдвэрлэл", value: "Европын Холбооны гишүүн орнууд, Израиль, Өмнөд Солонгос" },
  { label: "Стандарт", value: "Европын Холбооны шаардлагын дагуу бүртгэгдэж, баталгаажсан" },
  { label: "Зах зээл", value: "Европын 12 оронд бүртгэлтэй, борлуулагддаг" },
];

const chain = [
  {
    title: "Швейцарьт боловсруулна",
    body: "Бүтээгдэхүүний технологи, эмнэлгийн боловсруулалтыг Швейцарийн төв оффис хариуцна.",
  },
  {
    title: "ЕХ-ны стандартаар үйлдвэрлэнэ",
    body: "Бүх үйлдвэр Европын Холбооноос тавьдаг чанарын хамгийн өндөр шаардлагыг хангадаг.",
  },
  {
    title: "Дотооддоо хянана",
    body: "Чанарын хяналт, баталгаажуулалтыг компанийн өөрийн хэлтэс гүйцэтгэнэ.",
  },
  {
    title: "Багц бүрт гэрчилгээ",
    body: "Үйлдвэрлэлийн багц бүр ЕХ-ны итгэмжлэгдсэн лабораторийн Чанарын гэрчилгээтэй гарна.",
  },
  {
    title: "Бүртгэлийн дараа л зах зээлд",
    body: "Гэрчилгээгүйгээр бүртгүүлэх, экспортлох боломжгүй. Үйл ажиллагаа явуулдаг орнуудын үндэсний лаборатори нэмэлтээр шалгадаг.",
  },
];

const principles = ["Найрлагын чанар", "Эмнэлзүйн туршилт", "Боловсрол", "Эрүүл хооллолт"];

/* ───────────── Нийлүүлэгч — Ачит Фарм ───────────── */

const supplierPassport = [
  { label: "Хуулийн этгээд", value: "Ачит Алтан Ундарга ХХК" },
  { label: "Байгуулагдсан", value: "2022 оны 11 сар" },
  { label: "Тусгай зөвшөөрөл", value: "Эм, эмнэлгийн хэрэгсэл, эрүүл мэндийн бүтээгдэхүүн импорт" },
  { label: "Үндсэн чиглэл", value: "Хүүхдийн эм, эрүүл мэндийн бүтээгдэхүүн" },
];

const supplierValues = ["Өрсөлдөхүйц үнэ", "Чанартай орц найрлага", "Мэргэшсэн баг", "Үнэнч шударга", "Бүтээлч шийдэл"];

const timeline = [
  { when: "2022.11", title: "Байгуулагдсан", body: "Компани үүсгэн байгуулагдав." },
  { when: "2024.02", title: "Эхний бүтээгдэхүүн", body: "ADVA-BIOTICS KIDS MAX бүтээгдэхүүнийг зах зээлд гаргав." },
  {
    when: "2024.10",
    title: "Mozincare, Aclavcare",
    body: "Хүүхдийн эрүүл мэндийн хэрэгцээнд чиглэсэн бүтээгдэхүүний багцаа өргөжүүлэв.",
  },
  { when: "2025.06", title: "ADVA-IRON", body: "Төмрийн хэрэгцээнд чиглэсэн ADVA-IRON-ийг зах зээлд нэвтрүүлэв." },
  {
    when: "2026",
    title: "20 шинэ бүтээгдэхүүн",
    body: "Монгол Улсын хууль, шаардлагад нийцсэн 20 шинэ бүтээгдэхүүнийг үе шаттайгаар хүргэнэ.",
  },
];

const contact: { label: string; value: ReactNode }[] = [
  {
    label: "Утас",
    value: (
      <>
        <a href="tel:+97691929698" className="underline-offset-4 hover:underline">
          9192-9698
        </a>
        {", "}
        <a href="tel:+97677079192" className="underline-offset-4 hover:underline">
          7707-9192
        </a>
      </>
    ),
  },
  {
    label: "Имэйл",
    value: (
      <a href="mailto:sales@achitpharma.mn" className="underline-offset-4 hover:underline">
        sales@achitpharma.mn
      </a>
    ),
  },
  { label: "Хаяг", value: "Улаанбаатар хот, ХУД 3-р хороо, Алтаргана хотхон 41г байр, 49 тоот" },
  { label: "Ажлын цаг", value: "Даваа – Баасан, 08:30 – 17:30" },
];

export default function AboutPage() {
  return (
    <article>
      <OrgExplorer maker={<MakerContent />} supplier={<SupplierContent />} />
      <BabytolFamily />
    </article>
  );
}

/* ═══════════════ ҮЙЛДВЭРЛЭГЧ — агуулга ═══════════════ */
function MakerContent() {
  return (
    <>
      {/* Швейцарь бренд гэдэг юу вэ — "паспорт" */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-8">
          <div>
            <Image
              src="/brand/4u-pharma-logo.png"
              alt="4U Pharma — Swiss Company"
              width={207}
              height={80}
              className="h-auto w-[168px] sm:w-[207px]"
            />
            <h3 className="mt-10 text-3xl font-bold leading-[1.15] text-ink [text-wrap:balance] sm:text-4xl">
              Швейцарь бренд гэдэг юу гэсэн үг вэ?
            </h3>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-ink-muted [text-wrap:pretty]">
              4U Pharma бол Швейцарийн компани. Бүтээгдэхүүн бүрийн санаа, найрлага, технологийн шийдэл Швейцарийн төв
              оффист боловсрогдож, санхүү, чанарын хяналт мөн тэндээс удирдагддаг. Лого дээрх загалмай,{" "}
              <span className="font-semibold text-ink">“Swiss Company”</span> гэсэн бичиг үүнийг илэрхийлдэг. Компани
              хүүхэд, гэр бүлд зориулсан хамгийн өндөр чанарын байгалийн гаралтай бүтээгдэхүүн бүтээхийг зорьдог.
            </p>
            <SwissSeal className="mt-10 h-28 w-28 sm:h-32 sm:w-32" />
          </div>

          <Passport
            title="4U Pharma · Switzerland"
            mark={<SwissCross className="h-7 w-7 shrink-0 rounded-[4px] bg-white text-brand-red" />}
            barClass="bg-brand-red"
            rows={makerPassport}
          />
        </div>
      </div>

      {/* Чанарын гинж */}
      <div className="bg-ivory-200 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="max-w-3xl text-3xl font-bold leading-[1.15] text-ink [text-wrap:balance] sm:text-4xl">
            Швейцарьт боловсруулж, Европын стандартаар баталгаажуулна
          </h3>
          <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-ink-muted">
            Капсул бүр танай гэрт хүрэхээсээ өмнө дараах шатыг дамждаг.
          </p>

          <ol className="relative mt-12 grid gap-10 lg:grid-cols-5 lg:gap-6">
            {/* Холбох шугам: mobile дээр босоо, desktop дээр хэвтээ */}
            <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-0.5 bg-brand-red/25 lg:hidden" />
            <span aria-hidden className="absolute left-5 right-5 top-[19px] hidden h-0.5 bg-brand-red/25 lg:block" />
            {chain.map((step, i) => (
              <li key={step.title} className="relative grid grid-cols-[40px_1fr] gap-5 lg:block">
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-red text-base font-bold tabular-nums text-white ring-8 ring-ivory-200">
                  {i + 1}
                </span>
                <div className="lg:mt-6">
                  <h4 className="text-lg font-bold leading-snug text-ink">{step.title}</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-14 max-w-[70ch] border-t border-line pt-6 text-[15px] leading-relaxed text-ink-muted">
            4U Pharma-гийн мэдээлснээр тус компанийн бүтээгдэхүүнийг үйл ажиллагаа явуулдаг орнуудын эрх бүхий
            байгууллагууд санал болгодог бөгөөд ихэнх оронд неонатологи, хүүхдийн эмч нарын холбооны үндэсний зөвлөмжид
            багтдаг.
          </p>
        </div>
      </div>

      {/* Эрхэм зорилго */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
          <div className="relative aspect-[690/800] w-full max-w-md overflow-hidden rounded-[2rem] lg:max-w-none">
            <Image
              src="/brand/hero/mother-baby-wide.webp"
              alt="Ээж нялх хүүхдээ духан дээр нь үнсэж байна"
              fill
              sizes="(min-width: 1024px) 42vw, (min-width: 448px) 448px, 92vw"
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="text-3xl font-bold leading-[1.15] text-ink sm:text-4xl">Байгаль ба хайр халамж</h3>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-ink-muted [text-wrap:pretty]">
              4U Pharma хүүхдийн хөгжилд нөлөөлдөг бүх хүнийг — эцэг эх, гэр бүл, найз нөхөд, эмч мэргэжилтэн, багш
              сурган хүмүүжүүлэгчдийг — хооронд нь холбож, хамтран ажиллахыг дэмжихийг эрхэм зорилгоо болгодог.
            </p>

            <blockquote className="mt-10 border-t-4 border-brand-red pt-6">
              <p className="text-2xl font-bold leading-[1.3] text-ink [text-wrap:balance] sm:text-[1.75rem]">
                “Бид насанд хүрсэн хойно аз жаргал авчрах бага насны суурийг тавихын төлөө оршдог.”
              </p>
              <footer className="mt-3 text-sm font-semibold text-ink-muted">— 4U Pharma</footer>
            </blockquote>

            <h4 className="mt-12 text-sm font-semibold text-ink-muted">Баримталдаг зарчим</h4>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {principles.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-lg font-bold text-ink">
                  <SwissCross className="h-5 w-5 shrink-0 rounded-[3px] bg-brand-red text-white" />
                  {p}
                </li>
              ))}
            </ul>

            <p className="mt-10 max-w-[60ch] rounded-2xl bg-ivory-200 px-5 py-4 text-[15px] leading-relaxed text-ink">
              4U Pharma жил бүр ашгийнхаа <strong className="font-bold text-brand-red">10%</strong>-ийг боловсролд
              чиглэсэн нийгмийн төслүүдэд хандивладаг.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════ НИЙЛҮҮЛЭГЧ — агуулга ═══════════════ */
function SupplierContent() {
  return (
    <>
      {/* Танилцуулга */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-8">
          <div>
            <h3 className="text-3xl font-bold leading-[1.15] text-ink [text-wrap:balance] sm:text-4xl">
              Хүүхдийн эрүүл мэндийн хэрэгцээнд нийцсэн чанартай шийдлийг хариуцлагатайгаар нийлүүлнэ
            </h3>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-ink-muted [text-wrap:pretty]">
              Ачит Фарм 2022 оноос хойш олон улсад хүлээн зөвшөөрөгдсөн хүүхдийн эм, эрүүл мэндийн бүтээгдэхүүнийг
              Монголын зах зээлд тогтвортой, хариуцлагатайгаар нийлүүлж байна. Швейцарийн 4U Pharma-гийн Babytol
              цувралыг Монголын ээж, аавуудад хүргэж буй нь Ачит Фарм.
            </p>
            <p className="mt-6 text-xl font-bold text-ink">“Хамгийн чухал нь хүүхдийн эрүүл мэнд.”</p>
          </div>

          <Passport
            title="Ачит Фарм · Mongolia"
            mark={
              <span className="grid h-7 w-12 shrink-0 place-items-center rounded-[4px] bg-white px-1">
                <Image
                  src="/brand/achit/achit-pharma-logo.png"
                  alt=""
                  width={395}
                  height={149}
                  className="h-auto w-full"
                />
              </span>
            }
            barClass="bg-ink"
            rows={supplierPassport}
          />
        </div>
      </div>

      {/* Зорилго, алсын хараа */}
      <div className="bg-ivory-200 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:px-8">
          <div>
            <dl className="grid gap-10 sm:grid-cols-2">
              <div className="border-t-4 border-ink pt-5">
                <dt className="text-2xl font-bold text-ink">Зорилго</dt>
                <dd className="mt-3 text-[16px] leading-[1.6] text-ink-muted">
                  Монгол Улсын эмийн зах зээлд дээд зэрэглэлийн, чанартай, олон улсад хүлээн зөвшөөрөгдсөн, эмчилгээний
                  өндөр үр дүнтэй эм, эрүүл мэндийн бүтээгдэхүүн, эмнэлгийн хэрэгслийг ханган нийлүүлэх.
                </dd>
              </div>
              <div className="border-t-4 border-ink pt-5">
                <dt className="text-2xl font-bold text-ink">Алсын хараа</dt>
                <dd className="mt-3 text-[16px] leading-[1.6] text-ink-muted">
                  Мэдлэг, нотолгоо шинжилгээнд тулгуурласан, шинийг санаачлагч, бүтээлч, үнэнч шударга, хамтын хөгжлийг
                  эрхэмлэгч эрүүл мэндийн тэргүүлэгч байгууллага байна.
                </dd>
              </div>
            </dl>

            <h4 className="mt-12 text-sm font-semibold text-ink-muted">Эрхэмлэдэг үнэ цэнэ</h4>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {supplierValues.map((v) => (
                <li key={v} className="rounded-full bg-white px-4 py-2 text-[15px] font-semibold text-ink">
                  {v}
                </li>
              ))}
            </ul>
          </div>

          <figure>
            <div className="relative aspect-[1600/1066] overflow-hidden rounded-[2rem]">
              <Image
                src="/brand/achit/team.jpg"
                alt="Ачит Фарм-ын хамт олон"
                fill
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-muted">Ачит Фарм-ын хамт олон</figcaption>
          </figure>
        </div>
      </div>

      {/* Замнал */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold leading-[1.15] text-ink sm:text-4xl">Манай замнал</h3>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {timeline.map((t) => (
              <li key={t.when} className="border-t-2 border-line pt-5">
                <p className="text-2xl font-bold tabular-nums text-ink">{t.when}</p>
                <h4 className="mt-3 text-lg font-bold leading-snug text-ink">{t.title}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{t.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h3 className="text-2xl font-bold leading-[1.2] text-ink sm:text-3xl">Нийгмийн хариуцлага</h3>
              <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.6] text-ink-muted [text-wrap:pretty]">
                Ачит Фарм хүүхэд, өсвөр насныхны бие бялдар, нийгэм, танин мэдэхүй, сэтгэл зүйн хөгжилд онцгой анхаарч,
                тэдний эрүүл мэндийг хамгаалж буй эмч, эмнэлгийн ажилтнуудын хөгжлийг дэмждэг. Жилийн ашгийнхаа{" "}
                <strong className="font-bold text-ink">20–25%</strong>-ийг боловсрол, эрүүл мэнд, урьдчилан
                сэргийлэлтийг дэмжсэн нийгмийн төслүүдэд хандивладаг.
              </p>
              <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.6] text-ink-muted [text-wrap:pretty]">
                2025 оны 2-р сарын 28 – 3-р сарын 1-нд болсон Европын хүүхдийн эмч нарын холбооны чуулга уулзалтад Ази
                тивээс оролцсон анхны байгууллага болсон.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold leading-[1.2] text-ink sm:text-3xl">Холбоо барих</h3>
              <dl className="mt-4 divide-y divide-line">
                {contact.map((c) => (
                  <div key={c.label} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
                    <dt className="text-sm font-semibold text-ink-muted">{c.label}</dt>
                    <dd className="text-[16px] font-semibold leading-snug text-ink">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function BabytolFamily() {
  // Babytol цуврал
  return (
    <section aria-labelledby="family-title" className="border-t border-line bg-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="family-title" className="text-3xl font-bold leading-[1.15] text-ink sm:text-4xl">
              Швейцарийн чанар — Babytol-д
            </h2>
            <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-ink-muted [text-wrap:pretty]">
              4U Pharma хүүхэд, жирэмсэн эх, насанд хүрэгчдэд зориулсан бүтээгдэхүүнтэй. Монголд Babytol цувралын дөрвөн
              бүтээгдэхүүнээр танилцаж байна.
            </p>
          </div>
          <Link
            href="/#shop"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#B01F28] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
          >
            Бүтээгдэхүүнүүдийг харах
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
          {products.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/products/${p.slug}`}
                className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
              >
                <span className="relative block aspect-[1.83] w-full">
                  <span
                    aria-hidden
                    className="absolute inset-x-[10%] -bottom-1.5 h-3 rounded-[50%] bg-ink/15 blur-md"
                  />
                  <Image
                    src={p.packshot}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 22vw, 44vw"
                    className="object-contain transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
                  />
                </span>
                <span className="mt-4 block text-[15px] font-bold leading-tight text-ink">
                  <span
                    aria-hidden
                    className="mb-2 block h-[3px] w-6 rounded-full transition-all duration-300 group-hover:w-10"
                    style={{ background: p.accent }}
                  />
                  {p.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-14 text-[13px] text-ink-muted">
          Эх сурвалж:{" "}
          <a
            href="https://www.4upharma.com/en/page/about-us/1/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-ink"
          >
            4upharma.com
          </a>
          {", "}
          <a
            href="https://achitpharma.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-ink"
          >
            achitpharma.com
          </a>
        </p>
      </div>
    </section>
  );
}

/** Байгууллагын товч мэдээллийн хүснэгт */
function Passport({
  title,
  mark,
  barClass,
  rows,
}: {
  title: string;
  mark: ReactNode;
  barClass: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="self-start overflow-hidden rounded-2xl border border-line shadow-[0_24px_48px_-32px_rgba(41,50,58,0.45)]">
      <div className={`flex items-center gap-3 px-5 py-4 text-white sm:px-7 ${barClass}`}>
        {mark}
        <p className="text-[15px] font-bold uppercase tracking-[0.08em]">{title}</p>
      </div>
      <dl className="divide-y divide-line bg-ivory px-5 sm:px-7">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <dt className="text-sm font-semibold text-ink-muted">{row.label}</dt>
            <dd className="text-[17px] font-semibold leading-snug text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
