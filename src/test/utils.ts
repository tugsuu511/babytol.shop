import { act } from "@testing-library/react";
import { cart } from "@/lib/cart";

/** cart.ts-ийн модулийн төлөвийг тест хооронд цэвэрлэнэ (компонент тестэд). */
export function resetCart() {
  act(() => {
    cart.clear();
    cart.close();
    cart.closeCheckout();
    cart.dismissToast();
  });
  localStorage.clear();
}
