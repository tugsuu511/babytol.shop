import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("/#shop");
});

test("lists all four products with prices", async ({ shop }) => {
  const cards = shop.page.locator("#shop article");
  await expect(cards).toHaveCount(4);
  await expect(shop.card("Babytol D3")).toContainText("28,000₮");
  await expect(shop.card("Babytol D3 + K1")).toContainText("36,000₮");
  await expect(shop.card("Babytol D3 + DHA Omega")).toContainText("50,000₮");
  await expect(shop.card("Babytol DHA Omega")).toContainText("42,000₮");
});

test("adding to cart shows a toast and updates the header badge", async ({ shop }) => {
  await expect(shop.cartButton).toHaveAccessibleName("Сагс, хоосон");
  await shop.addFromShop("Babytol D3", 3);

  await expect(shop.toast).toContainText("3 ширхэг · 84,000₮");
  await expect(shop.cartButton).toHaveAccessibleName("Сагс, 3 бүтээгдэхүүн");

  await shop.addFromShop("Babytol D3 + K1");
  await expect(shop.cartButton).toHaveAccessibleName("Сагс, 4 бүтээгдэхүүн");
  // Нэмэх бүрт сагс нээгдэхгүй — урсгал тасалдахгүй
  await expect(shop.drawer).toBeHidden();
});

test("toast auto-hides", async ({ shop }) => {
  await shop.addFromShop("Babytol D3");
  await expect(shop.toast).toBeHidden({ timeout: 7_000 });
});

test("drawer edits quantities and totals", async ({ shop }) => {
  await shop.addFromShop("Babytol D3", 2);
  await shop.addFromShop("Babytol DHA Omega");
  await shop.cartButton.click();

  const drawer = shop.drawer;
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("listitem")).toHaveCount(2);
  await expect(drawer).toContainText("98,000₮");

  const d3 = drawer.getByRole("group", { name: "Babytol D3 — тоо ширхэг" });
  await d3.getByRole("button", { name: "Нэмэх", exact: true }).click();
  await expect(d3).toContainText("3");
  await expect(drawer).toContainText("126,000₮");

  await drawer.getByRole("listitem").filter({ hasText: "Babytol DHA Omega" }).getByRole("button", { name: "Устгах" }).click();
  await expect(drawer.getByRole("listitem")).toHaveCount(1);
  await expect(drawer).toContainText("84,000₮");

  await d3.getByRole("button", { name: "Хасах", exact: true }).click({ clickCount: 3 });
  await expect(drawer).toContainText("Сагс хоосон байна.");
  expect(await shop.storedCart()).toEqual([]);
});

test("drawer closes with Escape and locks page scroll while open", async ({ shop, page }) => {
  await shop.cartButton.click();
  await expect(shop.drawer).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(shop.drawer).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("cart survives a reload", async ({ shop, page }) => {
  await shop.addFromShop("Babytol D3 + DHA Omega", 2);
  await page.reload();
  await expect(shop.cartButton).toHaveAccessibleName("Сагс, 2 бүтээгдэхүүн");
  expect(await shop.storedCart()).toEqual([{ slug: "d3-dha-omega", qty: 2 }]);
});

test("cart syncs across tabs", async ({ shop, context }) => {
  const other = await context.newPage();
  await other.goto("/");
  await shop.addFromShop("Babytol D3", 2);
  await expect(other.getByRole("button", { name: /^Сагс,/ })).toHaveAccessibleName("Сагс, 2 бүтээгдэхүүн");
});

test("tampered localStorage is sanitised", async ({ shop }) => {
  await shop.seedCart([
    { slug: "d3", qty: 999 },
    { slug: "hacked", qty: 1 },
    { slug: "d3-k1", qty: -5 },
  ]);
  await expect(shop.cartButton).toHaveAccessibleName("Сагс, 20 бүтээгдэхүүн");
});
