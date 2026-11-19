import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { orderStatusValues, paymentStatusValues } from "@/db/schema";
import { getAdmin } from "@/lib/auth/admin";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/order-labels";
import { paymentMethods } from "@/lib/order";
import { listOrders, type AdminOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { updateOrder } from "./actions";

export const metadata: Metadata = { title: "Захиалгууд — Babytol админ", robots: { index: false } };

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-[2rem] font-medium leading-[1.1] tracking-[-0.02em]">Захиалгууд</h1>
      <Suspense fallback={<p className="mt-6 text-sm text-ink-muted">Ачаалж байна…</p>}>
        <Orders />
      </Suspense>
    </div>
  );
}

const dateFmt = new Intl.DateTimeFormat("mn-MN", {
  timeZone: "Asia/Ulaanbaatar",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

async function Orders() {
  // Админ биш хүнд хуудас байгаа эсэхийг ч мэдэгдэхгүй (proxy нь нэвтрээгүйг sign-in рүү аль хэдийн шилжүүлсэн)
  if (!(await getAdmin())) notFound();
  const orders = await listOrders();

  if (orders.length === 0) return <p className="mt-6 text-[15px] text-ink-muted">Одоогоор захиалга алга.</p>;

  return (
    <>
      <p className="mt-2 text-sm text-ink-muted">Сүүлийн {orders.length} захиалга</p>
      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </ul>
    </>
  );
}

const select = "rounded-lg border border-[#dde1e6] bg-white px-2.5 py-2 text-sm";

function OrderCard({ order: o }: { order: AdminOrder }) {
  const paid = o.paymentStatus === "paid";
  return (
    <li className="rounded-2xl border border-[#dde1e6] bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-semibold tabular-nums">{o.orderNo}</p>
        <p className="text-xs tabular-nums text-ink-muted">{dateFmt.format(o.createdAt)}</p>
      </div>

      <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold">{o.name}</p>
          <p className="mt-0.5">
            <a href={`tel:${o.phone}`} className="tabular-nums underline">
              {o.phone}
            </a>
          </p>
          <p className="mt-1 text-ink-muted">
            {o.district} — {o.address}
          </p>
        </div>
        <div>
          <ul className="space-y-1">
            {o.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4">
                <span>
                  {i.name} <span className="text-ink-muted">× {i.qty}</span>
                </span>
                <span className="tabular-nums">{formatPrice(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex justify-between border-t border-[#dde1e6] pt-2 font-semibold">
            <span>Нийт</span>
            <span className="tabular-nums">{formatPrice(o.total)}</span>
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {paymentMethods.find((m) => m.value === o.paymentMethod)?.label} ·{" "}
            <span className={paid ? "font-semibold text-brand-green" : o.paymentStatus === "failed" ? "font-semibold text-brand-red" : ""}>
              {paymentStatusLabels[o.paymentStatus]}
            </span>
          </p>
        </div>
      </div>

      <form action={updateOrder} className="mt-4 flex flex-wrap items-end gap-3 border-t border-[#dde1e6] pt-4">
        <input type="hidden" name="id" value={o.id} />
        <label className="text-xs font-semibold">
          Захиалгын төлөв
          <select name="status" defaultValue={o.status} className={`${select} mt-1 block`}>
            {orderStatusValues.map((s) => (
              <option key={s} value={s}>
                {orderStatusLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold">
          Төлбөр
          <select name="paymentStatus" defaultValue={o.paymentStatus} className={`${select} mt-1 block`}>
            {paymentStatusValues.map((s) => (
              <option key={s} value={s}>
                {paymentStatusLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90">
          Хадгалах
        </button>
      </form>
    </li>
  );
}
