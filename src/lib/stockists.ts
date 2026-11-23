import { rawStockists, ubDistricts } from "./stockists-data";

export type RegionGroup = "ub" | "aimag";

export type Stockist = {
  id: string;
  name: string;
  /** Салбар эсвэл хаяг — PDF-д таслалаас хойш бичигдсэн хэсэг */
  detail?: string;
};

export type Region = {
  id: string;
  name: string;
  group: RegionGroup;
  stockists: Stockist[];
};

/**
 * Нийтэд харуулахгүй мөрүүд: хувь хүний нэр, төрийн байгууллага, их сургууль,
 * эрүүл мэндийн бус компани, "Хүргэлтийн хаяг" — эдгээрээс худалдан авагч очиж авах боломжгүй.
 */
export const EXCLUDED = new Set([
  "Б. Болорчимэг",
  "Дамбацэрэн Батэрдэнэ",
  "Дарханбаатар Нарангарав",
  "Н.Сарангоо",
  "З. Ганчулуун",
  "П.Баттуяа",
  "С.Дашням",
  "Ш. Нандин-Эрдэнэ",
  "Лхавгажав Цэдэвсүрэн",
  "ШАГДАР БОРХҮҮХЭН",
  "мягмарсанжаа",
  "саяхицэцэн",
  "Ховд Жаргалан ӨЭМТ эмч Нуржан",
  "Эрдэмбилэг-Дархан эмч",
  "Сүхбаатар дүүргийн засаг даргын тамгын газар",
  "Анагаахын шинжлэх ухааны үндэсний их сургууль",
  "Баярнэтворкс групп",
  "Сет инженеринг",
  "Омни шиппинг",
  "Ололтсофт",
  "Иликон капитал",
  "Фарма софт",
  "Хүргэлтийн хаяг",
]);

/**
 * Эмнэлэг, ӨЭМТ, эрүүл мэндийн төвийг жагсаалтад оруулахгүй.
 * Зөвхөн нэрээр нь шүүнэ: "Монос Дархан, Дархан Монос Нэгдсэн эмнэлэг" мэт эмнэлэг доторх эмийн сан үлдэнэ.
 * Нэрэндээ "фарм", "эмийн сан", "салбар" орсон бол эмийн сан гэж үзнэ ("Нил фарм Нисэх Амбулатори",
 * "Зинт 3р эмнэлэг Ачтан салбар").
 */
const CLINIC = /эмнэлэг|ӨЭМТ|эрүүл мэндийн төв|клиник|амбулатори|медикал сентер|медикал групп/i;
const PHARMACY = /фарм|эмийн сан|салбар/i;

export function isClinic(name: string) {
  return CLINIC.test(name) && !PHARMACY.test(name);
}

/** "Сити фарм мейк HEAD" → "Сити фарм мейк" гэх мэт дотоод тэмдэглэгээг арилгана */
function cleanName(s: string) {
  return s
    .replace(/\s+(HEAD|Head|head office)\b/g, "")
    .replace(/\s*\(2\)$/, "")
    .replace(/\)$/, (m) => (s.includes("(") ? m : ""))
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** "14-ХУД Имарт", "ЭС/4-Нисэх салбар", "-2-19 салбар" → дугаарын угтварыг арилгана */
function cleanDetail(s: string) {
  return s
    .replace(/^-?\d+-/, "")
    .replace(/^ЭС\/\d+-/, "")
    .replace(/^эмийн сан-\d+-\s*/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function parseLine(line: string): Omit<Stockist, "id"> | null {
  const raw = line.trim();
  if (EXCLUDED.has(raw)) return null;

  // Нэргүй, зөвхөн хаягтай мөр ("… аймаг … сум …")
  if (/аймаг .+ сум/.test(raw)) return { name: "Эмийн сан", detail: raw };

  const comma = raw.indexOf(", ");
  if (comma === -1) return { name: cleanName(raw) };

  const name = cleanName(raw.slice(0, comma));
  let detail: string | undefined = cleanDetail(raw.slice(comma + 2));
  if (detail === "Хүргэлтийн хаяг" || detail === name) detail = undefined;
  return { name, detail };
}

const regionLabel: Record<string, string> = { "Сүхбаатар дүүрэг": "Сүхбаатар" };

function build(): Region[] {
  const regions: Region[] = [];

  for (const [key, lines] of Object.entries(rawStockists)) {
    const seen = new Set<string>();
    const stockists: Stockist[] = [];
    for (const line of lines) {
      const parsed = parseLine(line);
      if (!parsed || isClinic(parsed.name)) continue;
      const dedupe = `${parsed.name}|${parsed.detail ?? ""}`;
      if (seen.has(dedupe)) continue;
      seen.add(dedupe);
      stockists.push({ ...parsed, id: `${key}-${stockists.length}` });
    }
    regions.push({
      id: key,
      name: regionLabel[key] ?? key,
      group: ubDistricts.includes(key) ? "ub" : "aimag",
      stockists,
    });
  }

  // Улаанбаатар эхэнд (PDF-ийн дарааллаар), аймгууд цагаан толгойн дарааллаар
  const ub = ubDistricts.map((k) => regions.find((r) => r.id === k)!).filter(Boolean);
  const aimags = regions
    .filter((r) => r.group === "aimag")
    .sort((a, b) => a.name.localeCompare(b.name, "mn"));
  return [...ub, ...aimags];
}

export const regions: Region[] = build();

export const totalStockists = regions.reduce((n, r) => n + r.stockists.length, 0);

/** Хайлт: том жижиг үсэг, илүү зай, зураасыг үл тооно */
export function normalize(s: string) {
  return s.toLocaleLowerCase("mn").replace(/[\s\-–—]+/g, " ").trim();
}

export function filterRegions(
  list: Region[],
  { query, group, regionId }: { query: string; group: RegionGroup | "all"; regionId: string | null },
): Region[] {
  const q = normalize(query);
  return list
    .filter((r) => (group === "all" || r.group === group) && (!regionId || r.id === regionId))
    .map((r) => {
      if (!q) return r;
      // Бүсийн нэрээр хайвал бүх жагсаалтыг нь харуулна
      if (normalize(r.name).includes(q)) return r;
      return {
        ...r,
        stockists: r.stockists.filter((s) => normalize(`${s.name} ${s.detail ?? ""}`).includes(q)),
      };
    })
    .filter((r) => r.stockists.length > 0);
}
