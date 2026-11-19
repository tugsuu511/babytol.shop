"use server";

import { refresh } from "next/cache";
import { orderStatusValues, paymentStatusValues, type OrderStatus, type PaymentStatus } from "@/db/schema";
import { getAdmin } from "@/lib/auth/admin";
import { updateOrderStatus, updatePaymentStatus } from "@/lib/orders";

// Server action нь нийтэд нээлттэй endpoint тул эрхийг action бүрт дахин шалгана.

export async function updateOrder(fd: FormData) {
  if (!(await getAdmin())) throw new Error("Unauthorized");

  const id = Number(fd.get("id"));
  if (!Number.isInteger(id) || id < 1) throw new Error("Invalid order id");

  const status = String(fd.get("status") ?? "");
  const paymentStatus = String(fd.get("paymentStatus") ?? "");
  if (orderStatusValues.includes(status as OrderStatus)) await updateOrderStatus(id, status as OrderStatus);
  if (paymentStatusValues.includes(paymentStatus as PaymentStatus)) {
    await updatePaymentStatus(id, paymentStatus as PaymentStatus);
  }
  refresh();
}
