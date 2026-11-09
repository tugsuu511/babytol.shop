// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { placeOrder } from "@/app/actions/order";
import type { OrderState } from "@/lib/order";
import { MAX_QTY } from "@/lib/products";

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

let log: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  log = vi.spyOn(console, "log").mockImplementation(() => {});
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

  it("logs a structured order record with server-side line items", async () => {
    const res = await submit();
    expect(log).toHaveBeenCalledTimes(1);
    const [tag, json] = log.mock.calls[0] as [string, string];
    expect(tag).toBe("[order]");
    const record = JSON.parse(json);
    expect(record).toMatchObject({
      orderNo: res.status === "success" ? res.orderNo : "",
      name: "Болд",
      district: "Баянзүрх",
      total: 56000,
      items: [{ slug: "d3", name: "Babytol D3", qty: 2, price: 28000, lineTotal: 56000 }],
    });
    expect(new Date(record.createdAt).toString()).not.toBe("Invalid Date");
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
    expect(log).not.toHaveBeenCalled();
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
