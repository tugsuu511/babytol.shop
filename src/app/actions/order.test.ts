// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { placeOrder } from "@/app/actions/order";
import { createPaymentLink } from "@/lib/bonum";
import { createOrder, setBonumInvoice } from "@/lib/orders";
import type { OrderState } from "@/lib/order";
import { MAX_QTY } from "@/lib/products";

// DB болон Bonum-ийг хуурамчаар орлуулна — энд зөвхөн action-ий логикийг шалгана
vi.mock("@/lib/orders", () => ({ createOrder: vi.fn(), setBonumInvoice: vi.fn() }));
vi.mock("@/lib/bonum", () => ({ createPaymentLink: vi.fn() }));

const IDLE: OrderState = { status: "idle" };

const valid = {
  name: "Болд",
  phone: "99112233",
  district: "Баянзүрх",
  address: "3-р хороо, 15-р байр, 2 орц, 34 тоот",
  payment: "on_delivery",
  lines: JSON.stringify([{ slug: "d3", qty: 2 }]),
};

function form(overrides: Partial<Record<keyof typeof valid, string | null>> = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...valid, ...overrides })) {
    if (v !== null) fd.set(k, v);
  }
  return fd;
}

const submit = (overrides?: Parameters<typeof form>[0]) => placeOrder(IDLE, form(overrides));

async function expectError(overrides: Parameters<typeof form>[0]) {
  const res = await submit(overrides);
  if (res.status !== "error") throw new Error(`expected error, got ${res.status}`);
  return res;
}

const save = vi.mocked(createOrder);
const payLink = vi.mocked(createPaymentLink);
beforeEach(() => {
  save.mockReset().mockResolvedValue(undefined);
  vi.mocked(setBonumInvoice).mockReset().mockResolvedValue(undefined);
  payLink.mockReset().mockResolvedValue({ invoiceId: "inv-1", payUrl: "https://pay.example/inv-1" });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("placeOrder — success", () => {
  it("accepts a valid order and returns order number, total and phone", async () => {
    const res = await submit();
    expect(res).toEqual({
      status: "success",
      orderNo: expect.stringMatching(/^BT-[0-9A-Z]+$/),
      total: 56000,
      phone: "99112233",
    });
  });

  it("recomputes prices on the server and ignores client-supplied prices", async () => {
    const res = await submit({
      lines: JSON.stringify([
        { slug: "d3", qty: 1, price: 1 },
        { slug: "d3-dha-omega", qty: 2, price: 0, lineTotal: 0 },
      ]),
    });
    expect(res).toMatchObject({ status: "success", total: 28000 + 50000 * 2 });
  });

  it("normalises phone spaces and dashes", async () => {
    const res = await submit({ phone: " 9911-22 33 " });
    expect(res).toMatchObject({ status: "success", phone: "99112233" });
  });

  it.each(["now", "on_delivery"])("accepts payment method %s", async (payment) => {
    expect((await submit({ payment })).status).toBe("success");
  });

  it("drops invalid lines but still succeeds when a valid one remains", async () => {
    const res = await submit({
      lines: JSON.stringify([{ slug: "fake", qty: 1 }, { slug: "d3-k1", qty: 0 }, { slug: "d3-k1", qty: 1 }]),
    });
    expect(res).toMatchObject({ status: "success", total: 36000 });
  });

  it("floors fractional quantities", async () => {
    const res = await submit({ lines: JSON.stringify([{ slug: "d3", qty: 2.9 }]) });
    expect(res).toMatchObject({ status: "success", total: 56000 });
  });

  it("accepts exactly MAX_QTY", async () => {
    const res = await submit({ lines: JSON.stringify([{ slug: "d3", qty: MAX_QTY }]) });
    expect(res).toMatchObject({ status: "success", total: 28000 * MAX_QTY });
  });

  it("saves the order with server-side line items", async () => {
    const res = await submit();
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith({
      orderNo: res.status === "success" ? res.orderNo : "",
      name: "Болд",
      phone: "99112233",
      district: "Баянзүрх",
      address: valid.address,
      paymentMethod: "on_delivery",
      total: 56000,
      items: [{ slug: "d3", name: "Babytol D3", qty: 2, price: 28000, lineTotal: 56000 }],
    });
  });

  it("generates a different order number each time", async () => {
    const [a, b] = await Promise.all([submit(), submit()]);
    expect(a.status === "success" && b.status === "success" && a.orderNo !== b.orderNo).toBe(true);
  });

  it("returns an error and keeps the form values when the order cannot be saved", async () => {
    save.mockRejectedValue(new Error("db down"));
    const res = await expectError({});
    expect(res.errors).toEqual({});
    expect(res.values).toMatchObject({ name: "Болд", phone: "99112233" });
    expect(payLink).not.toHaveBeenCalled();
  });
});

describe("placeOrder — payment", () => {
  it("does not create a payment link for pay-on-delivery", async () => {
    const res = await submit({ payment: "on_delivery" });
    expect(res).not.toHaveProperty("payUrl");
    expect(payLink).not.toHaveBeenCalled();
  });

  it("saves the order first, then returns the Bonum payment link", async () => {
    const res = await submit({ payment: "now" });
    if (res.status !== "success") throw new Error("expected success");
    expect(res.payUrl).toBe("https://pay.example/inv-1");
    expect(payLink).toHaveBeenCalledWith({ orderNo: res.orderNo, total: 56000 });
    expect(setBonumInvoice).toHaveBeenCalledWith(res.orderNo, "inv-1");
    expect(save.mock.invocationCallOrder[0]).toBeLessThan(payLink.mock.invocationCallOrder[0]);
  });

  it("still succeeds (order kept) when the payment link cannot be created", async () => {
    payLink.mockRejectedValue(new Error("bonum down"));
    const res = await submit({ payment: "now" });
    expect(res).toMatchObject({ status: "success", paymentUnavailable: true });
    expect(res).not.toHaveProperty("payUrl");
    expect(save).toHaveBeenCalledTimes(1);
  });
});

describe("placeOrder — validation", () => {
  it.each([
    ["name", { name: "" }],
    ["name", { name: " A " }],
    ["phone", { phone: "" }],
    ["phone", { phone: "9911223" }],
    ["phone", { phone: "991122334" }],
    ["phone", { phone: "9911abcd" }],
    ["phone", { phone: "+97699112233" }],
    ["district", { district: "" }],
    ["district", { district: "Токио" }],
    ["address", { address: "abc" }],
    ["address", { address: "    " }],
    ["payment", { payment: "" }],
    ["payment", { payment: "crypto" }],
  ] as const)("rejects invalid %s (%j)", async (field, overrides) => {
    const res = await expectError(overrides);
    expect(Object.keys(res.errors)).toEqual([field]);
    expect(res.message).toBeTruthy();
    expect(save).not.toHaveBeenCalled();
  });

  it.each([
    ["missing", null],
    ["empty", ""],
    ["invalid JSON", "{oops"],
    ["not an array", JSON.stringify({ slug: "d3", qty: 1 })],
    ["empty array", "[]"],
    ["unknown product", JSON.stringify([{ slug: "babytol-x", qty: 1 }])],
    ["zero qty", JSON.stringify([{ slug: "d3", qty: 0 }])],
    ["negative qty", JSON.stringify([{ slug: "d3", qty: -1 }])],
    ["over MAX_QTY", JSON.stringify([{ slug: "d3", qty: MAX_QTY + 1 }])],
    ["non-numeric qty", JSON.stringify([{ slug: "d3", qty: "many" }])],
    ["null entries", JSON.stringify([null, 1, "d3"])],
  ])("rejects lines: %s", async (_label, lines) => {
    const res = await expectError({ lines });
    expect(res.errors.lines).toBeTruthy();
  });

  it("reports all errors at once", async () => {
    const res = await expectError({ name: "", phone: "1", district: "", address: "", payment: "", lines: "[]" });
    expect(Object.keys(res.errors).sort()).toEqual(["address", "district", "lines", "name", "payment", "phone"]);
  });

  it("echoes back trimmed values (but never lines) so the form can be refilled", async () => {
    const res = await expectError({ name: "  Сараа  ", phone: "1" });
    expect(res.values).toStrictEqual({
      name: "Сараа",
      phone: "1",
      district: valid.district,
      address: valid.address,
      payment: valid.payment,
    });
  });
});
