import { expect, test, type Shop } from "./fixtures";

async function openCheckout(shop: Shop) {
  await shop.cartButton.click();
  await shop.drawer.getByRole("button", { name: "Захиалга өгөх" }).click();
  await expect(shop.checkout).toBeVisible();
  return shop.checkout;
}

test.beforeEach(async ({ page, shop }) => {
  await page.goto("/");
  await shop.seedCart([
    { slug: "d3", qty: 2 },
    { slug: "d3-k1", qty: 1 },
  ]);
});

test("places an order end-to-end", async ({ shop }) => {
  const dialog = await openCheckout(shop);
  await expect(dialog).toContainText("3 бүтээгдэхүүн");
  await expect(dialog.getByRole("button", { name: /Захиалга илгээх/ })).toContainText("92,000₮");

  await dialog.getByLabel("Таны нэр").fill("Болд");
  await dialog.getByLabel("Утасны дугаар").fill("99112233");
  await dialog.getByLabel("Дүүрэг / байршил").selectOption("Сүхбаатар");
  await dialog.getByLabel("Хүргэлтийн дэлгэрэнгүй хаяг").fill("1-р хороо, 5-р байр, 3 тоот");
  await dialog.getByText("Хүргэлт очсоны дараа төлөх").click();
  await dialog.getByRole("button", { name: /Захиалга илгээх/ }).click();

  const done = dialog.getByRole("status");
  await expect(done).toContainText("Захиалга хүлээн авлаа");
  await expect(done).toContainText("99112233");
  await expect(done).toContainText(/BT-[0-9A-Z]+/);
  await expect(done).toContainText("92,000₮");

  await expect(shop.cartButton).toHaveAccessibleName("Сагс, хоосон");
  expect(await shop.storedCart()).toEqual([]);

  await done.getByRole("button", { name: "Хаах" }).click();
  await expect(dialog).toBeHidden();
});

test("browser validation blocks an incomplete form", async ({ shop }) => {
  const dialog = await openCheckout(shop);
  await dialog.getByLabel("Утасны дугаар").fill("123");
  await dialog.getByRole("button", { name: /Захиалга илгээх/ }).click();

  await expect(dialog.getByLabel("Таны нэр")).toHaveJSProperty("validity.valid", false);
  await expect(dialog.getByLabel("Утасны дугаар")).toHaveJSProperty("validity.valid", false);
  await expect(dialog.getByRole("status")).toHaveCount(0);
  await expect(shop.cartButton).toHaveAccessibleName("Сагс, 3 бүтээгдэхүүн");
});

test("server rejects a tampered cart even if client validation is bypassed", async ({ shop }) => {
  const dialog = await openCheckout(shop);
  await dialog.getByLabel("Таны нэр").fill("Болд");
  await dialog.getByLabel("Утасны дугаар").fill("99112233");
  await dialog.getByLabel("Дүүрэг / байршил").selectOption("Баянгол");
  await dialog.getByLabel("Хүргэлтийн дэлгэрэнгүй хаяг").fill("1-р хороо, 5-р байр");

  // Hidden input-ийг гараар өөрчилж, хуурамч бүтээгдэхүүн илгээх оролдлого
  await dialog.locator('input[name="lines"]').evaluate((el: HTMLInputElement) => {
    el.value = JSON.stringify([{ slug: "free-stuff", qty: 1, price: 0 }]);
  });
  await dialog.getByRole("button", { name: /Захиалга илгээх/ }).click();

  await expect(dialog.getByRole("alert")).toContainText("Мэдээллээ шалгаад дахин илгээнэ үү.");
  await expect(dialog).toContainText("Сагс хоосон байна.");
  await expect(dialog.getByLabel("Таны нэр")).toHaveValue("Болд");
  await expect(shop.cartButton).toHaveAccessibleName("Сагс, 3 бүтээгдэхүүн");
});

test("“Өөрчлөх” returns to the cart", async ({ shop }) => {
  const dialog = await openCheckout(shop);
  await dialog.getByRole("button", { name: "Өөрчлөх" }).click();
  await expect(dialog).toBeHidden();
  await expect(shop.drawer).toBeVisible();
});

test("Escape closes checkout", async ({ shop, page }) => {
  const dialog = await openCheckout(shop);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
