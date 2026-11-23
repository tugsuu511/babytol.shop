import { describe, expect, it } from "vitest";
import { EXCLUDED, filterRegions, isClinic, regions, totalStockists } from "./stockists";

const all = regions.flatMap((r) => r.stockists.map((s) => ({ ...s, region: r.name })));
const find = (name: string) => all.filter((s) => s.name === name);

describe("stockists", () => {
  it("puts Ulaanbaatar districts first, then aimags", () => {
    const firstAimag = regions.findIndex((r) => r.group === "aimag");
    expect(regions.slice(0, firstAimag).every((r) => r.group === "ub")).toBe(true);
    expect(regions.slice(firstAimag).every((r) => r.group === "aimag")).toBe(true);
    expect(regions.filter((r) => r.group === "ub")).toHaveLength(8);
    expect(regions.filter((r) => r.group === "aimag")).toHaveLength(20);
  });

  it("keeps the Sükhbaatar district and aimag apart", () => {
    const named = regions.filter((r) => r.name === "Сүхбаатар");
    expect(named.map((r) => r.group).sort()).toEqual(["aimag", "ub"]);
  });

  it("never publishes excluded rows (people, delivery addresses, non-retail)", () => {
    for (const s of all) {
      expect(EXCLUDED.has(s.name)).toBe(false);
      expect(s.name).not.toBe("Хүргэлтийн хаяг");
      expect(s.detail).not.toBe("Хүргэлтийн хаяг");
    }
  });

  it("splits branches and strips internal markers", () => {
    const city = find("Сити фарм мейк");
    expect(city.length).toBeGreaterThan(20);
    expect(city.map((s) => s.detail)).toContain("ХУД Имарт");
    expect(city.map((s) => s.detail)).toContain("Нисэх салбар");
    expect(all.some((s) => s.name.includes("HEAD"))).toBe(false);
  });

  it("dedupes 'Name, Name' rows and labels address-only rows", () => {
    expect(find("Гладиолус").filter((s) => s.region === "Баянзүрх")).toEqual([
      expect.objectContaining({ detail: undefined }),
    ]);
    const unnamed = find("Эмийн сан");
    expect(unnamed).toHaveLength(3);
    expect(unnamed.every((s) => s.detail?.includes("сум"))).toBe(true);
  });

  it("drops hospitals and clinics but keeps pharmacies inside or near them", () => {
    for (const name of ["Аллеркид эмнэлэг", "Хаппи бэйби клиник", "Энхбуянт манал ӨЭМТ", "Сонгино хайрхан нэгдсэн эмнэлэг"]) {
      expect(find(name)).toEqual([]);
    }
    expect(all.some((s) => isClinic(s.name))).toBe(false);
    expect(find("Монос Дархан").map((s) => s.detail)).toContain("Дархан Монос Нэгдсэн эмнэлэг");
    expect(find("Жикүжи-Нил фарм Нисэх Амбулатори")).not.toEqual([]);
    expect(find("Зинт 3р эмнэлэг Ачтан салбар")).not.toEqual([]);
  });

  it("filters by query case-insensitively, by group and by region", () => {
    const monos = filterRegions(regions, { query: "монос", group: "all", regionId: null });
    expect(monos.flatMap((r) => r.stockists).every((s) => /монос/i.test(`${s.name} ${s.detail}`))).toBe(true);

    const ub = filterRegions(regions, { query: "", group: "ub", regionId: null });
    expect(ub.every((r) => r.group === "ub")).toBe(true);

    const hovd = filterRegions(regions, { query: "", group: "all", regionId: "Ховд" });
    expect(hovd).toHaveLength(1);

    // Бүсийн нэрээр хайвал тэр бүсийн бүх жагсаалт гарна
    const byRegion = filterRegions(regions, { query: "орхон", group: "all", regionId: null });
    expect(byRegion.find((r) => r.name === "Орхон")?.stockists).toHaveLength(
      regions.find((r) => r.name === "Орхон")!.stockists.length,
    );

    expect(filterRegions(regions, { query: "zzzz", group: "all", regionId: null })).toEqual([]);
    expect(totalStockists).toBeGreaterThan(400);
  });
});
