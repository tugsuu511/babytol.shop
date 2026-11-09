import { expect, test } from "./fixtures";

const products = [
  { slug: "d3", name: "Babytol D3", price: "28,000₮" },
  { slug: "d3-k1", name: "Babytol D3 + K1", price: "36,000₮" },
  { slug: "d3-dha-omega", name: "Babytol D3 + DHA Omega", price: "50,000₮" },
  { slug: "dha-omega", name: "Babytol DHA Omega", price: "42,000₮" },
];

test("home page renders without errors", async ({ shop, page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Babytol/i);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(shop.cartButton).toBeVisible();
});

for (const p of products) {
  test(`product page /products/${p.slug}`, async ({ shop, page }) => {
    const res = await page.goto(`/products/${p.slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.name);

    await page.getByRole("button", { name: "Сагсанд нэмэх" }).click();
    await expect(shop.toast).toContainText(p.name);
    await expect(shop.toast).toContainText(p.price);
    await expect(shop.cartButton).toHaveAccessibleName("Сагс, 1 бүтээгдэхүүн");
  });
}

test("navigates from a shop card to its product page", async ({ shop, page }) => {
  await page.goto("/#shop");
  await shop.card("Babytol D3 + K1").getByRole("link").click();
  await expect(page).toHaveURL(/\/products\/d3-k1$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Babytol D3 + K1");
});

// notFound() нь <Suspense> дотор дуудагддаг тул эхний хүсэлтэд shell аль хэдийн 200-аар stream
// хийгдсэн байдаг (soft 404 + `noindex`); дараагийн хүсэлтүүд cache-ээс 404 авч болно.
// (docs: functions/not-found → "Status codes"). Жинхэнэ 404-ийг баталгаажуулах бол proxy.ts-д
// slug шалгах эсвэл notFound()-ийг Suspense-ээс өмнө дуудаад доорхыг `toBe(404)` болгоно.
test("unknown product shows not-found and is not indexable", async ({ page }) => {
  const slug = `not-a-real-product-${Date.now()}`;
  const res = await page.goto(`/products/${slug}`);
  expect([200, 404]).toContain(res?.status());
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByText(/404|could not be found/i).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Сагсанд нэмэх" })).toHaveCount(0);
});
