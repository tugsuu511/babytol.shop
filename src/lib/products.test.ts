// @vitest-environment node
import { describe, expect, it } from "vitest";
import { productContent } from "@/lib/product-content";
import { formatPrice, MAX_QTY, productBySlug, products } from "@/lib/products";

const HEX = /^#[0-9A-F]{6}$/;

describe("products catalogue", () => {
  it("has exactly the four Babytol SKUs with unique slugs", () => {
    expect(products.map((p) => p.slug)).toEqual(["d3", "d3-k1", "d3-dha-omega", "dha-omega"]);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it.each(products)("$slug has valid price, packshot and official HEX colours", (p) => {
    expect(Number.isInteger(p.price)).toBe(true);
    expect(p.price).toBeGreaterThan(0);
    expect(p.packshot).toMatch(/^\/brand\/packshots\/.+\.png$/);
    expect(p.accent).toMatch(HEX);
    expect(p.palette.length).toBeGreaterThan(0);
    p.palette.forEach((c) => expect(c).toMatch(HEX));
    expect(p.palette).toContain(p.accent);
  });

  it.each(products)("$slug has matching product page content", (p) => {
    const c = productContent[p.slug];
    expect(c, `missing productContent["${p.slug}"]`).toBeDefined();
    expect(c.slug).toBe(p.slug);
    expect(c.theme.cta).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("has no orphan product content", () => {
    Object.keys(productContent).forEach((slug) => expect(productBySlug(slug)).toBeDefined());
  });

  it("keeps D3 + DHA Omega and DHA Omega as distinct products", () => {
    const combo = productBySlug("d3-dha-omega")!;
    const dha = productBySlug("dha-omega")!;
    expect(combo.name).not.toBe(dha.name);
    expect(combo.packshot).not.toBe(dha.packshot);
  });
});

describe("productBySlug", () => {
  it("finds a product", () => {
    expect(productBySlug("d3-k1")?.name).toBe("Babytol D3 + K1");
  });

  it.each(["", "D3", "unknown", "d3 ", "__proto__"])("returns undefined for %j", (slug) => {
    expect(productBySlug(slug)).toBeUndefined();
  });
});

describe("formatPrice", () => {
  it.each([
    [0, "0₮"],
    [999, "999₮"],
    [1000, "1,000₮"],
    [28000, "28,000₮"],
    [150000, "150,000₮"],
    [1234567, "1,234,567₮"],
  ])("formats %d as %s", (n, out) => {
    expect(formatPrice(n)).toBe(out);
  });
});

describe("MAX_QTY", () => {
  it("is a positive integer", () => {
    expect(Number.isInteger(MAX_QTY)).toBe(true);
    expect(MAX_QTY).toBeGreaterThan(0);
  });
});
