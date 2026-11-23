import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

// Эх загвар: https://achitpharma.com/terms (Ачит Алтан Ундарга ХХК) — Babytol онлайн дэлгүүрийн
// захиалгын урсгалд (Bonum-оор "Одоо төлөх" / "Хүргэлт очсоны дараа төлөх") тааруулав.

export const metadata: Metadata = {
  title: "Үйлчилгээний нөхцөл | Babytol",
  description:
    "Babytol онлайн дэлгүүрээр захиалга өгөх, төлбөр төлөх, хүргүүлэх, буцаах нөхцөл. Ачит Алтан Ундарга ХХК.",
};

const UPDATED = "2026 оны 11-р сарын 23";

type Section = { id: string; title: string; body: ReactNode };

const sections: Section[] = [
  {
    id: "general",
    title: "Ерөнхий үндэслэл",
    body: (
      <>
        <p>
          Babytol.shop нь Швейцарийн 4U Pharma-гийн Babytol бүтээгдэхүүнийг Монголд албан ёсоор нийлүүлэгч{" "}
          <strong>Ачит Алтан Ундарга ХХК</strong>-ийн (цаашид «Компани») онлайн дэлгүүр юм. Энэхүү нөхцөл нь
          вэбсайтыг ашиглах, захиалга өгөх, төлбөр төлөх, хүргүүлэхтэй холбоотой харилцааг зохицуулна.
        </p>
        <ol>
          <li>Вэбсайтаар захиалга өгснөөр та энэхүү нөхцөлийг уншиж, хүлээн зөвшөөрсөнд тооцно.</li>
          <li>
            Компани нөхцөлд өөрчлөлт оруулах эрхтэй бөгөөд өөрчлөлт вэбсайтад нийтлэгдсэн өдрөөс эхлэн хүчин
            төгөлдөр болно.
          </li>
          <li>
            Вэбсайт дээрх барааны тэмдэг, лого, дизайн, зураг, бичвэр нь эзэмшигчийн өмч бөгөөд зөвшөөрөлгүйгээр
            хуулбарлах, ашиглахыг хориглоно. Зөрчлийг Монгол Улсын оюуны өмчийн болон холбогдох хуулийн дагуу
            шийдвэрлэнэ.
          </li>
          <li>
            Бүтээгдэхүүний мэдээлэл, үнэ, хөнгөлөлтийн үнэн зөвийг Компани хариуцна. Санал, хүсэлтээ доорх холбоо
            барих хаягаар илгээж болно.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "account",
    title: "Хэрэглэгчийн бүртгэл ба захиалга",
    body: (
      <ol>
        <li>
          Хэрэглэгч имэйл хаягаар бүртгүүлж, эсвэл бүртгэлгүйгээр нэр, утасны дугаар, хүргэлтийн хаягаа оруулан
          захиалга өгч болно.
        </li>
        <li>
          Оруулсан мэдээллээ үнэн зөв байлгах, нэвтрэх нууц үгээ бусдад задруулахгүй байх нь хэрэглэгчийн үүрэг.
          Нэг хэрэглэгч нэг имэйл хаягаар бүртгүүлнэ.
        </li>
        <li>
          Захиалга хүлээн авсны дараа манай ажилтан таны утсаар холбогдож, захиалга болон хүргэлтийн цагийг
          баталгаажуулна.
        </li>
        <li>
          Хаяг, утасны дугаар буруу эсвэл хэрэглэгчтэй холбогдох боломжгүй тохиолдолд Компани захиалгыг цуцлах
          эрхтэй.
        </li>
      </ol>
    ),
  },
  {
    id: "payment",
    title: "Төлбөр тооцоо",
    body: (
      <ol>
        <li>Онлайн дэлгүүр 24 цагийн турш захиалга хүлээн авна.</li>
        <li>Вэбсайт дээрх үнэ НӨАТ орсон үнэ болно.</li>
        <li>
          Төлбөрийг дараах хоёр хэлбэрээр төлнө:
          <ul>
            <li>
              <strong>Одоо төлөх</strong> — Bonum төлбөрийн хуудсаар дамжуулан карт, банкны апп-аар онлайнаар
              төлнө.
            </li>
            <li>
              <strong>Хүргэлт очсоны дараа төлөх</strong> — бүтээгдэхүүнээ хүлээн авахдаа төлнө.
            </li>
          </ul>
        </li>
        <li>
          Шилжүүлгээр төлөх бол гүйлгээний утга дээр захиалгын дугаараа заавал бичнэ. Дутуу төлөгдсөн захиалгыг
          хүргэхгүй. Илүү төлөгдсөн дүнг гүйлгээний шимтгэлийг хасаад ажлын 3 хоногт буцаан олгоно.
        </li>
        <li>
          Интернэт, банк, цахилгааны доголдол эсвэл хэрэглэгчийн буруугаас үүссэн төлбөрийн саатлыг Компани
          хариуцахгүй.
        </li>
      </ol>
    ),
  },
  {
    id: "delivery",
    title: "Хүргэлт",
    body: (
      <ol>
        <li>Улаанбаатар хотод захиалгыг баталгаажуулснаас хойш 3–8 цагийн дотор хүргэнэ.</li>
        <li>16:00 цагаас хойш баталгаажсан захиалгыг дараагийн ажлын өдөр хүргэнэ.</li>
        <li>
          100,000₮-с дээш захиалгыг үнэгүй хүргэнэ. Түүнээс бага дүнтэй захиалгад 10,000₮ хүргэлтийн төлбөр
          нэмэгдэнэ. Орон нутгийн хүргэлтийн нөхцөлийг ажилтан утсаар тохирно.
        </li>
        <li>Бүтээгдэхүүн хэрэглэгчид хүлээлгэн өгөх хүртэлх савлагааны бүрэн бүтэн байдлыг Компани хариуцна.</li>
        <li>
          Цаг агаар, хорио цээр, гамшиг зэрэг давагдашгүй хүчин зүйлээс хүргэлт хойшлох тохиолдолд хэрэглэгчид
          мэдэгдэж, хүргэлтийн хугацааг шилжүүлнэ.
        </li>
      </ol>
    ),
  },
  {
    id: "receipt",
    title: "Баримт",
    body: (
      <p>
        Гүйлгээ бүрийн мэдээллийг имэйлээр илгээх ба бүтээгдэхүүн хүлээлгэн өгөхдөө НӨАТ-ын баримт (ebarimt)
        олгоно. Байгууллагын нэр дээр баримт авах бол захиалга баталгаажуулах үед регистрийн дугаараа зөв мэдэгдэнэ
        үү.
      </p>
    ),
  },
  {
    id: "returns",
    title: "Буцаалт ба солилт",
    body: (
      <>
        <p>
          Babytol нь хүүхдэд зориулсан хүнсний нэмэлт тул эрүүл ахуйн шаардлагын дагуу хүлээлгэн өгсний дараа{" "}
          <strong>буцаах, солихгүй</strong>. Харин дараах тохиолдолд буцаана эсвэл солино:
        </p>
        <ul>
          <li>Ажилтан эсвэл системийн алдаагаар өөр бүтээгдэхүүн, буруу тоо ширхэг хүргэгдсэн;</li>
          <li>Үйлдвэрлэгчээс шалтгаалсан чанарын доголдол илэрсэн;</li>
          <li>Эмчийн бичгээр баталгаажуулсан гаж нөлөө илэрсэн.</li>
        </ul>
        <p>Дараах тохиолдолд буцаалт хийхгүй:</p>
        <ul>
          <li>Хүлээн авахдаа бүтээгдэхүүн, тоо ширхэгээ шалгаагүй;</li>
          <li>Баримтаа хаясан, гээсэн эсвэл баримтын сугалааг ebarimt.mn-д бүртгүүлсэн;</li>
          <li>Савлагааг хэрэглэгч задалсан, гэмтээсэн эсвэл хэрэглэсэн;</li>
          <li>Урамшуулал, хямдралын үеэр худалдан авсан;</li>
          <li>Хэрэглэгч татвар, байгууллагын регистрийн мэдээллээ буруу өгсөн.</li>
        </ul>
        <p>
          Компанийн алдаанаас шалтгаалсан буцаалт, солилтын хүргэлтийн зардлыг Компани хариуцна. Бусад тохиолдолд
          хүргэлтийн зардлыг хэрэглэгч хариуцна.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Хариуцлага",
    body: (
      <ol>
        <li>
          Хэрэглэгч захиалга өгөхөөсөө өмнө бүтээгдэхүүний найрлага, хэрэглэх заавар, насны тохиромжийг уншиж
          танилцана. Хүүхдийн эрүүл мэндтэй холбоотой асуудлаар эмчтэйгээ зөвлөлдөхийг зөвлөж байна.
        </li>
        <li>
          Үйлдвэрлэлийн болон тээвэрлэлтийн доголдлоос бусад шалтгаанаар бүтээгдэхүүнд үүссэн асуудлыг Компани
          хариуцахгүй.
        </li>
        <li>Хэрэглэгч буруу захиалга өгсөн, буруу данс руу шилжүүлэг хийснийг Компани хариуцахгүй.</li>
      </ol>
    ),
  },
  {
    id: "other",
    title: "Бусад",
    body: (
      <p>
        Энэхүү нөхцөлөөр зохицуулагдаагүй асуудал болон маргааныг талууд харилцан зөвшилцөж, шийдвэрлэж
        чадаагүй тохиолдолд Монгол Улсын хууль тогтоомжийн дагуу шийдвэрлэнэ. Төлбөр, захиалгатай холбоотой
        асуултаа доорх утас, имэйлээр лавлана уу.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <article className="bg-ivory">
      <header className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-14 lg:pt-20">
        <h1 className="text-[2.25rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink [text-wrap:balance] sm:text-5xl">
          Үйлчилгээний нөхцөл
        </h1>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.6] text-ink-muted [text-wrap:pretty] sm:text-lg">
          Babytol онлайн дэлгүүрээр захиалга өгөх, төлбөр төлөх, хүргүүлэх, буцаах нөхцөл.
        </p>
        <p className="mt-3 text-sm text-ink-muted">Сүүлд шинэчилсэн: {UPDATED}</p>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[15rem_1fr] lg:gap-16 lg:px-8">
        <nav aria-label="Агуулга" className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold text-ink-muted">Агуулга</p>
          <ol className="mt-3 grid gap-1 text-[15px]">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex gap-2 rounded-lg py-1.5 font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  <span className="w-5 shrink-0 tabular-nums text-ink-muted">{i + 1}.</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-[68ch]">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24 border-t border-line py-8 first:border-t-0 first:pt-0">
              <h2 id={`${s.id}-title`} className="text-2xl font-bold leading-tight text-ink">
                <span className="mr-2 tabular-nums text-brand-red">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="mt-4 space-y-4 text-[16px] leading-[1.7] text-ink [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_li>ul]:mt-2">
                {s.body}
              </div>
            </section>
          ))}

          <Contact />
        </div>
      </div>
    </article>
  );
}

function Contact() {
  const row = "grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6";
  const dt = "text-sm font-semibold text-ink-muted";
  const dd = "text-[16px] font-semibold text-ink";
  return (
    <section aria-labelledby="contact-title" className="mt-4 rounded-2xl border border-line bg-white px-5 py-6 sm:px-7">
      <h2 id="contact-title" className="text-xl font-bold text-ink">
        Холбоо барих
      </h2>
      <dl className="mt-2 divide-y divide-line">
        <div className={row}>
          <dt className={dt}>Компани</dt>
          <dd className={dd}>Ачит Алтан Ундарга ХХК</dd>
        </div>
        <div className={row}>
          <dt className={dt}>Утас</dt>
          <dd className={dd}>
            <a href="tel:+97691929698" className="underline-offset-4 hover:underline">9192-9698</a>
            {", "}
            <a href="tel:+97677079192" className="underline-offset-4 hover:underline">7707-9192</a>
          </dd>
        </div>
        <div className={row}>
          <dt className={dt}>Имэйл</dt>
          <dd className={dd}>
            <a href="mailto:sales@achitpharma.mn" className="underline-offset-4 hover:underline">
              sales@achitpharma.mn
            </a>
          </dd>
        </div>
        <div className={row}>
          <dt className={dt}>Хаяг</dt>
          <dd className={dd}>Улаанбаатар, Хан-Уул дүүрэг, 3-р хороо, Алтаргана хотхон, 41г байр, 49 тоот</dd>
        </div>
        <div className={row}>
          <dt className={dt}>Ажлын цаг</dt>
          <dd className={dd}>Даваа – Баасан, 08:30 – 17:30</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-ink-muted">
        Хувийн мэдээллийн нууцлалын талаар асуух бол дээрх хаягаар хандана уу.{" "}
        <Link href="/" className="font-semibold text-brand-red underline-offset-4 hover:underline">
          Нүүр хуудас руу буцах
        </Link>
      </p>
    </section>
  );
}
