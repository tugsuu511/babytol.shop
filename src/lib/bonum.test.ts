// @vitest-environment node
import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { parseWebhook, verifyChecksum } from "@/lib/bonum";

const KEY = "test-checksum-key";
const sign = (body: string, key = KEY) => createHmac("sha256", key).update(body).digest("hex");

const paid = {
  type: "PAYMENT",
  status: "SUCCESS",
  message: "ok",
  body: { amount: 56000, currency: "MNT", invoiceId: "abc", status: "PAID", transactionId: "BT-ABC123" },
};

describe("verifyChecksum", () => {
  const compact = JSON.stringify(paid);

  it("accepts a correct checksum of the raw body", () => {
    expect(verifyChecksum(compact, sign(compact), KEY)).toBe(true);
  });

  it("accepts a checksum of the compact JSON when the body arrives pretty-printed", () => {
    expect(verifyChecksum(JSON.stringify(paid, null, 2), sign(compact), KEY)).toBe(true);
  });

  it("accepts an upper-case hex checksum", () => {
    expect(verifyChecksum(compact, sign(compact).toUpperCase(), KEY)).toBe(true);
  });

  it.each([
    ["wrong key", sign(compact, "other-key")],
    ["tampered body", sign(compact.replace("56000", "1"))],
    ["garbage", "not-a-checksum"],
    ["empty", ""],
    ["missing", null],
  ])("rejects: %s", (_label, checksum) => {
    expect(verifyChecksum(compact, checksum, KEY)).toBe(false);
  });

  it("rejects everything when no key is configured", () => {
    expect(verifyChecksum(compact, sign(compact, ""), "")).toBe(false);
  });

  it("handles a non-JSON body without throwing", () => {
    expect(verifyChecksum("not json", sign("not json"), KEY)).toBe(true);
    expect(verifyChecksum("not json", sign("other"), KEY)).toBe(false);
  });
});

describe("parseWebhook", () => {
  it("reads a successful payment", () => {
    expect(parseWebhook(paid)).toEqual({ type: "PAYMENT", status: "SUCCESS", orderNo: "BT-ABC123", paid: true, amount: 56000 });
  });

  it("reads a failed payment as not paid", () => {
    const failed = { type: "PAYMENT", status: "FAILED", body: { transactionId: "BT-ABC123", amount: 56000, invoiceStatus: "EXPIRED" } };
    expect(parseWebhook(failed)).toMatchObject({ orderNo: "BT-ABC123", paid: false });
  });

  it("does not treat SUCCESS without a PAID body status as paid", () => {
    expect(parseWebhook({ ...paid, body: { ...paid.body, status: "EXPIRED" } })?.paid).toBe(false);
  });

  it("does not treat other webhook types as a payment", () => {
    expect(parseWebhook({ ...paid, type: "CARD-TOKEN" })?.paid).toBe(false);
  });

  it("tolerates a missing body", () => {
    expect(parseWebhook({ type: "PAYMENT", status: "SUCCESS" })).toEqual({
      type: "PAYMENT",
      status: "SUCCESS",
      orderNo: null,
      paid: false,
      amount: null,
    });
  });

  it.each([null, "x", 1, {}, { type: "PAYMENT" }, { status: "SUCCESS" }])("returns null for malformed payload %j", (p) => {
    expect(parseWebhook(p)).toBeNull();
  });
});
