"use server";

import { districts, paymentMethods, type OrderField as Field, type OrderState } from "@/lib/order";
import { MAX_QTY, productBySlug } from "@/lib/products";

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

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
  if (!paymentMethods.some((m) => m.value === values.payment)) errors.payment = "Төлбөрийн хэлбэр сонгоно уу.";
  if (lines.length === 0) errors.lines = "Сагс хоосон байна.";

  if (Object.keys(errors).length) {
    return { status: "error", message: "Мэдээллээ шалгаад дахин илгээнэ үү.", errors, values };
  }

  const items = lines.map((l) => {
    const p = productBySlug(l.slug)!;
    return { slug: l.slug, name: p.name, qty: l.qty, price: p.price, lineTotal: p.price * l.qty };
  });
  const total = items.reduce((n, i) => n + i.lineTotal, 0);
  const orderNo = `BT-${Date.now().toString(36).toUpperCase()}`;

  // TODO: Захиалгыг өгөгдлийн сан / имэйл / Telegram гэх мэт бодит газар хадгалах.
  // Одоогоор зөвхөн серверийн лог руу бичнэ.
  console.log("[order]", JSON.stringify({ orderNo, ...values, items, total, createdAt: new Date().toISOString() }));

  return { status: "success", orderNo, total, phone: values.phone };
}
