import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CartButton, CartDrawer } from "@/components/cart-drawer";
import { cart } from "@/lib/cart";
import { resetCart } from "@/test/utils";

beforeEach(resetCart);

function renderShell() {
  render(
    <>
      <CartButton />
      <CartDrawer />
    </>,
  );
  const dialog = document.querySelector("dialog")!;
  return { dialog, user: userEvent.setup() };
}

describe("CartButton", () => {
  it("announces an empty cart", () => {
    render(<CartButton />);
    expect(screen.getByRole("button", { name: "Сагс, хоосон" })).toBeInTheDocument();
  });

  it("shows the item count", () => {
    render(<CartButton />);
    act(() => {
      cart.add("d3", 2);
      cart.add("d3-k1", 1);
    });
    expect(screen.getByRole("button", { name: "Сагс, 3 бүтээгдэхүүн" })).toHaveTextContent("3");
  });
});

describe("CartDrawer", () => {
  it("opens from the header button and closes with the close button", async () => {
    const { dialog, user } = renderShell();
    expect(dialog.open).toBe(false);

    await user.click(screen.getByRole("button", { name: /^Сагс,/ }));
    expect(dialog.open).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(within(dialog).getByRole("button", { name: "Сагс хаах" }));
    expect(dialog.open).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("shows an empty state with a link to the shop", () => {
    const { dialog } = renderShell();
    act(() => cart.open());
    expect(within(dialog).getByText("Сагс хоосон байна.")).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "Бүтээгдэхүүн сонгох" })).toHaveAttribute("href", "/#shop");
  });

  it("lists items with line totals and the grand total", () => {
    const { dialog } = renderShell();
    act(() => {
      cart.add("d3", 2);
      cart.add("dha-omega", 1);
      cart.open();
    });
    const items = within(dialog).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Babytol D3");
    expect(items[0]).toHaveTextContent("56,000₮");
    expect(items[1]).toHaveTextContent("Babytol DHA Omega");
    expect(within(dialog).getByText("Нийт дүн").nextElementSibling).toHaveTextContent("98,000₮");
    expect(within(dialog).getByRole("heading", { name: /Захиалгын сагс/ })).toHaveTextContent("(3)");
  });

  it("changes quantity, removes at 0, and removes via the remove button", async () => {
    const { dialog, user } = renderShell();
    act(() => {
      cart.add("d3", 1);
      cart.add("d3-k1", 1);
      cart.open();
    });

    const d3 = within(dialog).getByRole("group", { name: "Babytol D3 — тоо ширхэг" });
    await user.click(within(d3).getByRole("button", { name: "Нэмэх" }));
    expect(d3).toHaveTextContent("2");
    await user.click(within(d3).getByRole("button", { name: "Хасах" }));
    await user.click(within(d3).getByRole("button", { name: "Хасах" }));
    expect(within(dialog).queryByText("Babytol D3")).not.toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Устгах" }));
    expect(within(dialog).getByText("Сагс хоосон байна.")).toBeInTheDocument();
  });

  it("hands off to checkout", async () => {
    const { dialog, user } = renderShell();
    act(() => {
      cart.add("d3");
      cart.open();
    });
    await user.click(within(dialog).getByRole("button", { name: "Захиалга өгөх" }));
    expect(dialog.open).toBe(false);
    // Checkout нээлттэй байх хооронд хуудас гүйлгэгдэхгүй
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes when the backdrop (the dialog element itself) is clicked", async () => {
    const { dialog, user } = renderShell();
    act(() => cart.open());
    await user.click(dialog);
    expect(dialog.open).toBe(false);
  });
});
