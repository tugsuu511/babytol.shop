import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CartToast } from "@/components/cart-toast";
import { cart, useCart } from "@/lib/cart";
import { resetCart } from "@/test/utils";

beforeEach(() => {
  resetCart();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

function Flags() {
  const { isOpen, isCheckoutOpen } = useCart();
  return <span data-testid="flags">{`${isOpen}/${isCheckoutOpen}`}</span>;
}

describe("CartToast", () => {
  it("renders nothing until something is added", () => {
    render(<CartToast />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows the added product, qty and price", () => {
    render(<CartToast />);
    act(() => cart.add("d3-k1", 2));
    const toast = screen.getByRole("status");
    expect(toast).toHaveTextContent("Сагсанд нэмэгдлээ");
    expect(toast).toHaveTextContent("Babytol D3 + K1");
    expect(toast).toHaveTextContent("2 ширхэг · 72,000₮");
    expect(screen.getByRole("button", { name: "Сагс харах (2)" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Захиалах · 72,000₮" })).toBeInTheDocument();
  });

  it("auto-hides after 4.5s", () => {
    render(<CartToast />);
    act(() => cart.add("d3"));
    act(() => vi.advanceTimersByTime(4499));
    expect(screen.getByRole("status")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("stays while hovered and hides on mouse leave", () => {
    render(<CartToast />);
    act(() => cart.add("d3"));
    fireEvent.mouseEnter(screen.getByRole("status"));
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByRole("status")).toBeInTheDocument();
    fireEvent.mouseLeave(screen.getByRole("status"));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("can be dismissed manually", () => {
    render(<CartToast />);
    act(() => cart.add("d3"));
    fireEvent.click(screen.getByRole("button", { name: "Мэдэгдэл хаах" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("opens the cart or checkout", () => {
    render(
      <>
        <CartToast />
        <Flags />
      </>,
    );
    act(() => cart.add("d3"));
    fireEvent.click(screen.getByRole("button", { name: /Сагс харах/ }));
    expect(screen.getByTestId("flags")).toHaveTextContent("true/false");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    act(() => {
      cart.close();
      cart.add("d3");
    });
    fireEvent.click(screen.getByRole("button", { name: /Захиалах/ }));
    expect(screen.getByTestId("flags")).toHaveTextContent("false/true");
  });
});
