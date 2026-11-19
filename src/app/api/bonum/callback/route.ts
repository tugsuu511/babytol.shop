import { parseWebhook, verifyChecksum } from "@/lib/bonum";
import { applyPaymentResult } from "@/lib/orders";

// Bonum-ийн callback. Нэг хаяг хоёр үүрэгтэй:
//   POST — webhook (төлбөрийн үр дүн). Checksum таарсан үед л захиалгыг шинэчилнэ.
//   GET  — төлбөрийн хуудаснаас хэрэглэгч буцаж ирэх үед захиалгын хуудас руу шилжүүлнэ.

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyChecksum(raw, request.headers.get("x-checksum-v2"))) {
    return Response.json({ error: "invalid checksum" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }
  const hook = parseWebhook(payload);
  if (!hook) return Response.json({ error: "invalid payload" }, { status: 400 });

  // DB алдаа гарвал 500 буцна — Bonum дахин илгээх боломжтой, боловсруулалт нь idempotent.
  const outcome = await applyPaymentResult({ ...hook, payload });
  if (outcome === "amount_mismatch" || outcome === "unknown_order") {
    console.error("[bonum] webhook", outcome, hook.orderNo, hook.amount);
  }
  return Response.json({ ok: true });
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const orderNo = url.searchParams.get("order") ?? "";
  const path = /^BT-[0-9A-Z]+$/.test(orderNo) ? `/order/${orderNo}` : "/";
  // Proxy-ийн ард request.url дотоод хаяг байж болох тул SITE_URL-ийг илүүд үзнэ
  return Response.redirect(new URL(path, process.env.SITE_URL || url.origin), 303);
}
