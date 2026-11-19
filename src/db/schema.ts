import { index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Өгөгдлийн сангийн бүтэц. Энд өөрчлөлт хийсний дараа:
//   npm run db:generate   → drizzle/ хавтаст migration SQL үүсгэнэ
//   npm run db:migrate    → түүнийг DB-д ажиллуулна

export const paymentMethodValues = ["now", "on_delivery"] as const;
/** unpaid: хүргэлтээр төлнө · pending: Bonum-ийн төлбөр хүлээгдэж байна · paid · failed */
export const paymentStatusValues = ["unpaid", "pending", "paid", "failed"] as const;
export const orderStatusValues = ["new", "confirmed", "shipped", "delivered", "cancelled"] as const;

export type PaymentMethod = (typeof paymentMethodValues)[number];
export type PaymentStatus = (typeof paymentStatusValues)[number];
export type OrderStatus = (typeof orderStatusValues)[number];

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const orders = pgTable(
  "orders",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderNo: text("order_no").notNull().unique(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    district: text("district").notNull(),
    address: text("address").notNull(),
    paymentMethod: text("payment_method", { enum: paymentMethodValues }).notNull(),
    paymentStatus: text("payment_status", { enum: paymentStatusValues }).notNull().default("unpaid"),
    status: text("status", { enum: orderStatusValues }).notNull().default("new"),
    /** Нийт дүн, төгрөгөөр */
    total: integer("total").notNull(),
    bonumInvoiceId: text("bonum_invoice_id"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("orders_created_at_idx").on(t.createdAt)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    /** Захиалах үеийн нэр, үнэ — дараа нь үнэ өөрчлөгдсөн ч захиалга хэвээр үлдэнэ */
    name: text("name").notNull(),
    qty: integer("qty").notNull(),
    price: integer("price").notNull(),
    lineTotal: integer("line_total").notNull(),
  },
  (t) => [index("order_items_order_id_idx").on(t.orderId)],
);

/** Bonum-оос ирсэн (checksum нь таарсан) webhook бүрийн түүхий бичлэг — маргаан гарвал шалгах баримт */
export const paymentEvents = pgTable(
  "payment_events",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderNo: text("order_no"),
    type: text("type").notNull(),
    status: text("status").notNull(),
    /** Захиалгад хэрхэн нөлөөлсөн: paid | failed | ignored | amount_mismatch | unknown_order */
    outcome: text("outcome").notNull(),
    payload: jsonb("payload").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("payment_events_order_no_idx").on(t.orderNo)],
);
