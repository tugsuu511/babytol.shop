import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as actions from "@/app/actions/order";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { cart, useCart } from "@/lib/cart";
import type { OrderState } from "@/lib/order";
import { resetCart } from "@/test/utils";

// Server action-ийг spy-аар ороож, default-оор бодит логикийг нь ажиллуулна.
vi.mock("@/app/actions/order", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/app/actions/order")>();
  return { placeOrder: vi.fn(actual.placeOrder) };
});
const placeOrder = vi.mocked(actions.placeOrder);

beforeEach(() => {
  resetCart();
  placeOrder.mockClear();
  vi.spyOn(console, "log").mockImplementation(() => {});
});

function Count() {
  const { count, isOpen } = useCart();
  return <span data-testid="cart">{`${count}/${isOpen}`}</span>;
}

function renderCheckout(lines: [string, number][] = [["d3", 2]]) {
  render(
    <>
      <CheckoutDialog />
      <Count />
    </>,
  );
  act(() => {
    lines.forEach(([slug, qty]) => cart.add(slug, qty));
    cart.openCheckout();
  });
  const dialog = document.querySelector("dialog")!;
  return { dialog, ui: within(dialog), user: userEvent.setup() };
}

async function fillValid(ui: ReturnType<typeof within>, user: ReturnType<typeof userEvent.setup>) {
  await user.type(ui.getByLabelText("Таны нэр"), "Болд");
  await user.type(ui.getByLabelText("Утасны дугаар"), "99112233");
  await user.selectOptions(ui.getByLabelText("Дүүрэг / байршил"), "Хан-Уул");
  await user.type(ui.getByLabelText("Хүргэлтийн дэлгэрэнгүй хаяг"), "15-р хороо, 7-р байр, 12 тоот");
}

describe("CheckoutDialog", () => {
  it("opens with the order summary and total", () => {
    const { dialog, ui } = renderCheckout([
      ["d3", 2],
      ["dha-omega", 1],
    ]);
    expect(dialog.open).toBe(true);
    expect(ui.getByText("3 бүтээгдэхүүн")).toBeInTheDocument();
    expect(ui.getByText("28,000₮ × 2 ширхэг")).toBeInTheDocument();
    expect(ui.getByRole("button", { name: /Захиалга илгээх\s*· 98,000₮/ })).toBeInTheDocument();
  });

  it("serialises only slug + qty into the hidden lines field", () => {
    const { dialog } = renderCheckout([["d3-k1", 3]]);
    const hidden = dialog.querySelector<HTMLInputElement>('input[name="lines"]')!;
    expect(JSON.parse(hidden.value)).toEqual([{ slug: "d3-k1", qty: 3 }]);
  });

  it("defaults payment to the first method", () => {
    const { ui } = renderCheckout();
    expect(ui.getByLabelText("Одоо төлөх")).toBeChecked();
    expect(ui.getByLabelText("Хүргэлт очсоны дараа төлөх")).not.toBeChecked();
  });

  it("submits a valid order, shows the confirmation and clears the cart", async () => {
    const { ui, user } = renderCheckout();
    await fillValid(ui, user);
    await user.click(ui.getByLabelText("Хүргэлт очсоны дараа төлөх"));
    await user.click(ui.getByRole("button", { name: /Захиалга илгээх/ }));

    const status = await ui.findByRole("status");
    expect(status).toHaveTextContent("Захиалга хүлээн авлаа");
    expect(status).toHaveTextContent("99112233");
    expect(status).toHaveTextContent(/BT-[0-9A-Z]+/);
    expect(status).toHaveTextContent("56,000₮");
    await waitFor(() => expect(screen.getByTestId("cart")).toHaveTextContent("0/false"));

    const fd = placeOrder.mock.calls[0][1] as FormData;
    expect(Object.fromEntries(fd)).toMatchObject({
      name: "Болд",
      phone: "99112233",
      district: "Хан-Уул",
      payment: "on_delivery",
      lines: JSON.stringify([{ slug: "d3", qty: 2 }]),
    });
  });

  it("shows server-side errors, keeps the cart, and refills the form", async () => {
    placeOrder.mockResolvedValueOnce({
      status: "error",
      message: "Мэдээллээ шалгаад дахин илгээнэ үү.",
      errors: { phone: "8 оронтой утасны дугаар оруулна уу.", lines: "Сагс хоосон байна." },
      values: { name: "Болд", phone: "99112233", district: "Хан-Уул", address: "Хаяг 12345", payment: "now" },
    } satisfies OrderState);

    const { ui, user } = renderCheckout();
    await fillValid(ui, user);
    await user.click(ui.getByRole("button", { name: /Захиалга илгээх/ }));

    expect(await ui.findByRole("alert")).toHaveTextContent("Мэдээллээ шалгаад дахин илгээнэ үү.");
    const phone = ui.getByLabelText("Утасны дугаар");
    expect(phone).toHaveAttribute("aria-invalid", "true");
    expect(phone).toHaveAccessibleDescription("8 оронтой утасны дугаар оруулна уу.");
    expect(ui.getByText("Сагс хоосон байна.")).toBeInTheDocument();
    expect(ui.getByLabelText("Таны нэр")).toHaveValue("Болд");
    expect(ui.getByLabelText("Таны нэр")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByTestId("cart")).toHaveTextContent("2/false");
  });

  it("shows a pending state while submitting", async () => {
    let resolve!: (s: OrderState) => void;
    placeOrder.mockReturnValueOnce(new Promise<OrderState>((r) => (resolve = r)));
    const { ui, user } = renderCheckout();
    await fillValid(ui, user);
    await user.click(ui.getByRole("button", { name: /Захиалга илгээх/ }));

    const btn = await ui.findByRole("button", { name: "Илгээж байна…" });
    expect(btn).toBeDisabled();
    await act(async () => resolve({ status: "success", orderNo: "BT-TEST", total: 56000, phone: "99112233" }));
    expect(await ui.findByText("BT-TEST")).toBeInTheDocument();
  });

  it("goes back to the cart via “Өөрчлөх”", async () => {
    const { dialog, ui, user } = renderCheckout();
    await user.click(ui.getByRole("button", { name: "Өөрчлөх" }));
    expect(dialog.open).toBe(false);
    expect(screen.getByTestId("cart")).toHaveTextContent("2/true");
  });

  it("shows an empty state when opened with an empty cart", () => {
    render(<CheckoutDialog />);
    act(() => cart.openCheckout());
    const ui = within(document.querySelector("dialog")!);
    expect(ui.getByText("Сагс хоосон байна.")).toBeInTheDocument();
    expect(ui.queryByRole("button", { name: /Захиалга илгээх/ })).not.toBeInTheDocument();
  });

  it("resets the form each time it is reopened", async () => {
    const { ui, user } = renderCheckout();
    await user.type(ui.getByLabelText("Таны нэр"), "Болд");
    await user.click(ui.getByRole("button", { name: "Хаах" }));
    act(() => cart.openCheckout());
    expect(within(document.querySelector("dialog")!).getByLabelText("Таны нэр")).toHaveValue("");
  });
});
