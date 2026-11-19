import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/order-labels";
import { getOrderSummary } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { AutoRefresh } from "./auto-refresh";

export const metadata: Metadata = { title: "Захиалгын төлөв — Babytol", robots: { index: false } };

// Bonum-ийн төлбөрийн хуудаснаас буцаж ирэх хуудас. Төлбөрийн үр дүн webhook-оор ирдэг тул
// "хүлээгдэж байна" үед хуудас өөрөө хэдэн секунд тутам шинэчлэгдэнэ.
export default function OrderPage({ params }: PageProps<"/order/[orderNo]">) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <Suspense fallback={<p className="text-sm text-ink-muted">Ачаалж байна…</p>}>
        <OrderStatus params={params} />
      </Suspense>
    </div>
  );
}

async function OrderStatus({ params }: Pick<PageProps<"/order/[orderNo]">, "params">) {
  const { orderNo } = await params;
  if (!/^BT-[0-9A-Z]+$/.test(orderNo)) notFound();
  const order = await getOrderSummary(orderNo);
  if (!order) notFound();

  const paid = order.paymentStatus === "paid";
  const pending = order.paymentStatus === "pending";
  const failed = order.paymentStatus === "failed";

  return (
    <>
      <h1 className="text-[2.25rem] font-medium leading-[1.1] tracking-[-0.02em]">
        {paid ? "Төлбөр амжилттай" : failed ? "Төлбөр амжилтгүй" : pending ? "Төлбөрийг шалгаж байна…" : "Захиалга хүлээн авлаа"}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted" role="status">
        {paid && "Баярлалаа! Бид тантай удахгүй холбогдож, хүргэлтийн цагийг тохирно."}
        {pending && "Төлбөр баталгаажмагц энэ хуудас автоматаар шинэчлэгдэнэ."}
        {failed && "Төлбөр хийгдээгүй байна. Таны захиалга хадгалагдсан — бид тантай холбогдож төлбөрийг тохирно."}
        {order.paymentStatus === "unpaid" && "Төлбөрийг хүргэлтийн үед төлнө. Бид тантай удахгүй холбогдоно."}
      </p>

      <dl className="mt-8 space-y-2 rounded-2xl bg-[#f7f8fa] p-5 text-sm">
        <Row label="Захиалгын дугаар" value={order.orderNo} />
        <Row label="Захиалгын төлөв" value={orderStatusLabels[order.status]} />
        <Row label="Төлбөр" value={paymentStatusLabels[order.paymentStatus]} />
      </dl>

      <ul className="mt-6 divide-y divide-[#dde1e6] border-y border-[#dde1e6] text-sm">
        {order.items.map((i) => (
          <li key={i.slug} className="flex justify-between gap-4 py-3">
            <span>
              {i.name} <span className="text-ink-muted">× {i.qty}</span>
            </span>
            <span className="font-semibold tabular-nums">{formatPrice(i.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-baseline justify-between">
        <span className="text-sm">Нийт дүн</span>
        <span className="text-2xl font-medium tabular-nums">{formatPrice(order.total)}</span>
      </p>

      <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-white hover:bg-ink/90">
        Нүүр хуудас руу
      </Link>
      {pending && <AutoRefresh />}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
