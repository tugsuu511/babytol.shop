// Захиалгын маягтын сонголтууд — клиент (dialog) болон сервер (placeOrder) хоёул хэрэглэнэ.

export const districts = [
  "Баянзүрх",
  "Баянгол",
  "Сүхбаатар",
  "Чингэлтэй",
  "Хан-Уул",
  "Сонгинохайрхан",
  "Налайх",
  "Багануур",
  "Багахангай",
  "Орон нутаг",
] as const;

export const paymentMethods = [
  { value: "now", label: "Одоо төлөх" },
  { value: "on_delivery", label: "Хүргэлт очсоны дараа төлөх" },
] as const;

export type OrderField = "name" | "phone" | "district" | "address" | "payment" | "lines";

export type OrderState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      errors: Partial<Record<OrderField, string>>;
      values: Partial<Record<Exclude<OrderField, "lines">, string>>;
    }
  | { status: "success"; orderNo: string; total: number; phone: string };
