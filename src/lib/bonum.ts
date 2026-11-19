import { createHmac, timingSafeEqual } from "node:crypto";

// Bonum Gateway (https://psp.bonum.mn/bonum-gateway-apis.html) — e-commerce invoice.
// Урсгал: token авах → invoice үүсгэх → хэрэглэгчийг followUpLink рүү шилжүүлэх → үр дүн webhook-оор ирнэ.
//
// Орчны хувьсагч:
//   BONUM_APP_SECRET, BONUM_TERMINAL_ID, BONUM_CHECKSUM_KEY — Bonum-оос авна
//   BONUM_API_URL — анхдагч нь тестийн орчин; production-д https://apis.bonum.mn
//   SITE_URL — сайтын нийтийн хаяг (жишээ нь https://babytol.shop), callback URL үүсгэхэд хэрэглэнэ

const TEST_API = "https://testapi.bonum.mn";
export const CALLBACK_PATH = "/api/bonum/callback";

type Token = { accessToken: string; expiresAt: number };
const g = globalThis as typeof globalThis & { __bonumToken?: Token };

function config() {
  const appSecret = process.env.BONUM_APP_SECRET;
  const terminalId = process.env.BONUM_TERMINAL_ID;
  const siteUrl = process.env.SITE_URL;
  if (!appSecret || !terminalId || !siteUrl) {
    throw new Error("Bonum тохируулагдаагүй: BONUM_APP_SECRET, BONUM_TERMINAL_ID, SITE_URL шаардлагатай.");
  }
  return {
    appSecret,
    terminalId,
    siteUrl: siteUrl.replace(/\/+$/, ""),
    apiUrl: (process.env.BONUM_API_URL || TEST_API).replace(/\/+$/, ""),
  };
}

async function call<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`Bonum ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as T;
}

// Token үүсгэх нь rate limit-тэй тул хугацаа дуустал (30 мин) санах ойд хадгалж дахин ашиглана.
async function accessToken(c: ReturnType<typeof config>) {
  const cached = g.__bonumToken;
  if (cached && cached.expiresAt > Date.now()) return cached.accessToken;
  const t = await call<{ accessToken: string; expiresIn: number }>(`${c.apiUrl}/bonum-gateway/ecommerce/auth/create`, {
    headers: { Authorization: `AppSecret ${c.appSecret}`, "X-TERMINAL-ID": c.terminalId },
  });
  g.__bonumToken = { accessToken: t.accessToken, expiresAt: Date.now() + (t.expiresIn - 60) * 1000 };
  return t.accessToken;
}

/** Захиалгад Bonum invoice үүсгэж, төлбөрийн хуудасны холбоосыг буцаана. transactionId = захиалгын дугаар. */
export async function createPaymentLink(order: { orderNo: string; total: number }) {
  const c = config();
  const token = await accessToken(c);
  const invoice = await call<{ invoiceId: string; followUpLink: string }>(`${c.apiUrl}/bonum-gateway/ecommerce/invoices`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Accept-Language": "mn" },
    body: JSON.stringify({
      amount: order.total,
      // GET-ээр ирвэл захиалгын хуудас руу шилжүүлнэ, POST-оор ирвэл webhook гэж боловсруулна (route.ts)
      callback: `${c.siteUrl}${CALLBACK_PATH}?order=${encodeURIComponent(order.orderNo)}`,
      transactionId: order.orderNo,
      expiresIn: 1800,
    }),
  });
  if (!invoice.invoiceId || !invoice.followUpLink) throw new Error("Bonum: invoice хариу дутуу байна.");
  return { invoiceId: invoice.invoiceId, payUrl: invoice.followUpLink };
}

const hmac = (key: string, body: string) => createHmac("sha256", key).update(body, "utf8").digest("hex");

/**
 * Webhook-ийн `x-checksum-v2` толгойг шалгана: hex(HMAC-SHA256(BONUM_CHECKSUM_KEY, body)).
 * Bonum нь нягт (compact) JSON-ийг гарын үсэглэдэг тул түүхий body болон дахин нягтруулсан хувилбарыг хоёуланг нь шалгана.
 */
export function verifyChecksum(rawBody: string, checksum: string | null, key = process.env.BONUM_CHECKSUM_KEY) {
  if (!key || !checksum) return false;
  const given = Buffer.from(checksum.trim().toLowerCase());
  const candidates = [rawBody];
  try {
    candidates.push(JSON.stringify(JSON.parse(rawBody)));
  } catch {
    // JSON биш бол зөвхөн түүхий body
  }
  return candidates.some((body) => {
    const expected = Buffer.from(hmac(key, body));
    return expected.length === given.length && timingSafeEqual(expected, given);
  });
}

export type BonumWebhook = {
  type: string;
  status: string;
  orderNo: string | null;
  paid: boolean;
  amount: number | null;
};

/** Webhook-ийн биеэс бидэнд хэрэгтэй талбаруудыг ялгана. Буруу хэлбэртэй бол null. */
export function parseWebhook(payload: unknown): BonumWebhook | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as { type?: unknown; status?: unknown; body?: unknown };
  if (typeof p.type !== "string" || typeof p.status !== "string") return null;
  const body = (p.body && typeof p.body === "object" ? p.body : {}) as Record<string, unknown>;
  const amount = Number(body.amount);
  return {
    type: p.type,
    status: p.status,
    orderNo: typeof body.transactionId === "string" ? body.transactionId : null,
    // Амжилттай төлбөр: гадна талын status нь SUCCESS, биеийн status нь PAID
    paid: p.type === "PAYMENT" && p.status === "SUCCESS" && body.status === "PAID",
    amount: Number.isFinite(amount) ? amount : null,
  };
}
