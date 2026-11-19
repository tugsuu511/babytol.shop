import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  orderItems,
  orders,
  paymentEvents,
  type OrderStatus,
  type PaymentMethod,
  type PaymentStatus,
} from "@/db/schema";

// Захиалгын өгөгдлийн сантай харьцах бүх код энд. Зөвхөн сервер талд дуудагдана.

export type NewOrder = {
  orderNo: string;
  name: string;
  phone: string;
  district: string;
  address: string;
  paymentMethod: PaymentMethod;
  total: number;
  items: { slug: string; name: string; qty: number; price: number; lineTotal: number }[];
};

/** Захиалга ба мөрүүдийг нэг transaction-д хадгална — аль нэг нь бүтэхгүй бол хоёулаа буцна. */
export async function createOrder(o: NewOrder) {
  await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(orders)
      .values({
        orderNo: o.orderNo,
        name: o.name,
        phone: o.phone,
        district: o.district,
        address: o.address,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentMethod === "now" ? "pending" : "unpaid",
        total: o.total,
      })
      .returning({ id: orders.id });
    await tx.insert(orderItems).values(o.items.map((i) => ({ ...i, orderId: row.id })));
  });
}

export async function setBonumInvoice(orderNo: string, invoiceId: string) {
  await db.update(orders).set({ bonumInvoiceId: invoiceId, updatedAt: new Date() }).where(eq(orders.orderNo, orderNo));
}

/** Захиалагчид харуулах хэсэг — нэр, утас, хаяг агуулахгүй (дугаарыг мэддэг хэн ч нээж болох хуудас). */
export async function getOrderSummary(orderNo: string) {
  const [order] = await db
    .select({
      id: orders.id,
      orderNo: orders.orderNo,
      total: orders.total,
      paymentMethod: orders.paymentMethod,
      paymentStatus: orders.paymentStatus,
      status: orders.status,
    })
    .from(orders)
    .where(eq(orders.orderNo, orderNo))
    .limit(1);
  if (!order) return null;
  const items = await db
    .select({ slug: orderItems.slug, name: orderItems.name, qty: orderItems.qty, lineTotal: orderItems.lineTotal })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(orderItems.id);
  return { ...order, items };
}

export async function listOrders(limit = 100) {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
  if (rows.length === 0) return [];
  const items = await db
    .select()
    .from(orderItems)
    .where(
      inArray(
        orderItems.orderId,
        rows.map((r) => r.id),
      ),
    )
    .orderBy(orderItems.id);
  return rows.map((r) => ({ ...r, items: items.filter((i) => i.orderId === r.id) }));
}

export type AdminOrder = Awaited<ReturnType<typeof listOrders>>[number];

export async function updateOrderStatus(id: number, status: OrderStatus) {
  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
}

/** Админ гараар төлбөрийн төлөв солих (жишээ нь хүргэлтээр бэлнээр авсан). */
export async function updatePaymentStatus(id: number, paymentStatus: PaymentStatus) {
  await db
    .update(orders)
    .set({ paymentStatus, paidAt: paymentStatus === "paid" ? new Date() : null, updatedAt: new Date() })
    // Өөрчлөгдөөгүй бол paidAt-д хүрэхгүй
    .where(and(eq(orders.id, id), ne(orders.paymentStatus, paymentStatus)));
}

export type PaymentResult = {
  orderNo: string | null;
  type: string;
  status: string;
  paid: boolean;
  amount: number | null;
  payload: unknown;
};
export type PaymentOutcome = "paid" | "failed" | "ignored" | "amount_mismatch" | "unknown_order";

/**
 * Bonum-ийн webhook-ийн үр дүнг захиалгад тусгана. Давтан ирсэн ч аюулгүй (idempotent):
 * төлөгдсөн захиалгыг дахин өөрчлөхгүй, амжилтгүй мэдэгдэл нь төлөгдсөн захиалгыг буцаахгүй.
 * Дүн таарахгүй бол төлөгдсөн гэж тэмдэглэхгүй.
 */
export async function applyPaymentResult(r: PaymentResult): Promise<PaymentOutcome> {
  const outcome = await resolveOutcome(r);
  await db.insert(paymentEvents).values({
    orderNo: r.orderNo,
    type: r.type,
    status: r.status,
    outcome,
    payload: r.payload,
  });
  return outcome;
}

async function resolveOutcome(r: PaymentResult): Promise<PaymentOutcome> {
  if (r.type !== "PAYMENT" || !r.orderNo) return "ignored";
  const [order] = await db
    .select({ id: orders.id, total: orders.total })
    .from(orders)
    .where(eq(orders.orderNo, r.orderNo))
    .limit(1);
  if (!order) return "unknown_order";

  const now = new Date();
  if (r.paid) {
    if (r.amount !== order.total) return "amount_mismatch";
    await db
      .update(orders)
      .set({ paymentStatus: "paid", paidAt: now, updatedAt: now })
      .where(and(eq(orders.id, order.id), ne(orders.paymentStatus, "paid")));
    return "paid";
  }
  await db
    .update(orders)
    .set({ paymentStatus: "failed", updatedAt: now })
    .where(and(eq(orders.id, order.id), eq(orders.paymentStatus, "pending")));
  return "failed";
}
