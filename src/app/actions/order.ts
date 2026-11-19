"use server";

import { randomInt } from "node:crypto";
import { createPaymentLink } from "@/lib/bonum";
import { districts, paymentMethods, type OrderField as Field, type OrderState } from "@/lib/order";
import { createOrder, setBonumInvoice } from "@/lib/orders";
import { MAX_QTY, productBySlug } from "@/lib/products";

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/** BT- + цаг (base36) + санамсаргүй 4 тэмдэгт. Таахад хэцүү, DB-д unique. */
const newOrderNo = () =>
  `BT-${Date.now().toString(36)}${Array.from({ length: 4 }, () => randomInt(36).toString(36)).join("")}`.toUpperCase();

export async function placeOrder(_prev: OrderState, fd: FormData): Promise<OrderState> {
  const values = {
    name: text(fd, "name"),
    phone: text(fd, "phone").replace(/\s|-/g, ""),
    district: text(fd, "district"),
    address: text(fd, "address"),
    payment: text(fd, "payment"),
  };

  // Сагсны мөрүүд — үнийг клиентээс авахгүй, серверт products.ts-ээс дахин бодно
  let lines: { slug: string; qty: number }[] = [];
  try {
    const raw: unknown = JSON.parse(text(fd, "lines") || "[]");
    if (Array.isArray(raw)) {
      lines = raw.flatMap((l) => {
        const qty = Math.floor(Number(l?.qty));
        return typeof l?.slug === "string" && productBySlug(l.slug) && qty >= 1 && qty <= MAX_QTY
          ? [{ slug: l.slug, qty }]
          : [];
      });
    }
  } catch {
    lines = [];
  }

  const errors: Partial<Record<Field, string>> = {};
  if (values.name.length < 2) errors.name = "Нэрээ оруулна уу.";
  if (!/^[0-9]{8}$/.test(values.phone)) errors.phone = "8 оронтой утасны дугаар оруулна уу.";
  if (!districts.includes(values.district as (typeof districts)[number])) errors.district = "Дүүргээ сонгоно уу.";
  if (values.address.length < 5) errors.address = "Хүргэлтийн хаягаа дэлгэрэнгүй бичнэ үү.";
  const method = paymentMethods.find((m) => m.value === values.payment)?.value;
  if (!method) errors.payment = "Төлбөрийн хэлбэр сонгоно уу.";
  if (lines.length === 0) errors.lines = "Сагс хоосон байна.";

  if (!method || Object.keys(errors).length) {
    return { status: "error", message: "Мэдээллээ шалгаад дахин илгээнэ үү.", errors, values };
  }

  const items = lines.map((l) => {
    const p = productBySlug(l.slug)!;
    return { slug: l.slug, name: p.name, qty: l.qty, price: p.price, lineTotal: p.price * l.qty };
  });
  const total = items.reduce((n, i) => n + i.lineTotal, 0);
  const orderNo = newOrderNo();

  // 1. Эхлээд захиалгыг хадгална — төлбөрийн алхам бүтэлгүйтсэн ч утас, хаяг алдагдахгүй.
  try {
    await createOrder({
      orderNo,
      name: values.name,
      phone: values.phone,
      district: values.district,
      address: values.address,
      paymentMethod: method,
      total,
      items,
    });
  } catch (e) {
    console.error("[order] save failed", e);
    return {
      status: "error",
      message: "Захиалгыг хадгалж чадсангүй. Түр хүлээгээд дахин оролдоно уу.",
      errors: {},
      values,
    };
  }

  const done = { status: "success", orderNo, total, phone: values.phone } as const;
  if (method !== "now") return done;

  // 2. "Одоо төлөх" — Bonum invoice үүсгэж, төлбөрийн хуудасны холбоосыг буцаана.
  try {
    const { invoiceId, payUrl } = await createPaymentLink({ orderNo, total });
    await setBonumInvoice(orderNo, invoiceId);
    return { ...done, payUrl };
  } catch (e) {
    // Захиалга хадгалагдсан тул алдаа гэж буцаахгүй: ажилтан утсаар холбогдож төлбөрийг шийднэ.
    console.error("[order] payment link failed", orderNo, e);
    return { ...done, paymentUnavailable: true };
  }
}
