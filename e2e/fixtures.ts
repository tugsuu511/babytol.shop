import { expect, test as base, type Locator, type Page } from "@playwright/test";

export const CART_KEY = "babytol-cart-v1";

/** Хуудасны гол хэсгүүдийн locator-ууд — тестүүд selector давтахгүй. */
export class Shop {
  constructor(readonly page: Page) {}

  get cartButton() {
    return this.page.getByRole("button", { name: /^Сагс,/ });
  }
  get drawer() {
    return this.page.getByRole("dialog", { name: /Захиалгын сагс/ });
  }
  get checkout() {
    return this.page.locator("dialog[aria-labelledby='checkout-title']");
  }
  get toast() {
    return this.page.getByRole("status").filter({ hasText: "Сагсанд нэмэгдлээ" });
  }

  card(name: string): Locator {
    return this.page.locator("#shop article").filter({ has: this.page.getByRole("heading", { name, exact: true }) });
  }

  async addFromShop(name: string, qty = 1) {
    const card = this.card(name);
    for (let i = 1; i < qty; i++) await card.getByRole("button", { name: "Нэмэх", exact: true }).click();
    await card.getByRole("button", { name: "Сагсанд нэмэх" }).click();
    await expect(this.toast).toContainText(name);
  }

  async seedCart(lines: { slug: string; qty: number }[]) {
    await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [CART_KEY, JSON.stringify(lines)] as const);
    await this.page.reload();
  }

  async storedCart() {
    return this.page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), CART_KEY);
  }
}

export const test = base.extend<{ shop: Shop }>({
  // `use` гэж нэрлэвэл react-hooks lint дүрэм андуурна
  shop: async ({ page }, provide) => {
    // React hydration-ий алдаа, console error-ыг тест бүрт барина
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text());
    });
    await provide(new Shop(page));
    expect(errors, "unexpected browser errors").toEqual([]);
  },
});

export { expect };
