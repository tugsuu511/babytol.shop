import type { OrderStatus, PaymentStatus } from "@/db/schema";

// Төлөвүүдийн монгол нэр — захиалгын хуудас болон админ хэсэгт хэрэглэнэ.

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: "Шинэ",
  confirmed: "Баталгаажсан",
  shipped: "Хүргэлтэд гарсан",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "Төлөгдөөгүй",
  pending: "Төлбөр хүлээгдэж байна",
  paid: "Төлөгдсөн",
  failed: "Төлбөр амжилтгүй",
};
