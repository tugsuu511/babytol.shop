import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AddToCart } from "@/components/add-to-cart";
import { cart } from "@/lib/cart";
import { resetCart } from "@/test/utils";

beforeEach(() => {
  resetCart();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

const addBtn = () => screen.getByRole("button", { name: /Сагсанд нэмэх|Нэмэгдлээ/ });

describe("AddToCart", () => {
  it("adds the selected quantity, then resets the stepper to 1", () => {
    const add = vi.spyOn(cart, "add");
    render(<AddToCart slug="d3" name="Babytol D3" />);

    fireEvent.click(screen.getByRole("button", { name: "Нэмэх" }));
    fireEvent.click(screen.getByRole("button", { name: "Нэмэх" }));
    expect(screen.getByRole("group", { name: "Babytol D3 — тоо ширхэг" })).toHaveTextContent("3");

    fireEvent.click(addBtn());
    expect(add).toHaveBeenCalledWith("d3", 3);
    expect(screen.getByRole("group")).toHaveTextContent("1");
  });

  it("shows a confirmation for 1.8s and restarts the timer on repeated clicks", () => {
    render(<AddToCart slug="d3" name="Babytol D3" />);
    fireEvent.click(addBtn());
    expect(addBtn()).toHaveTextContent("✓ Нэмэгдлээ");

    act(() => vi.advanceTimersByTime(1500));
    fireEvent.click(addBtn());
    act(() => vi.advanceTimersByTime(1500));
    expect(addBtn()).toHaveTextContent("✓ Нэмэгдлээ");

    act(() => vi.advanceTimersByTime(300));
    expect(addBtn()).toHaveTextContent("Сагсанд нэмэх");
  });

  it("clears its timer on unmount", () => {
    const { unmount } = render(<AddToCart slug="d3" name="Babytol D3" />);
    fireEvent.click(addBtn());
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("applies the SKU colour", () => {
    render(<AddToCart slug="d3-k1" name="Babytol D3 + K1" color="#ED1072" hoverColor="#9D1F60" size="lg" />);
    expect(addBtn().style.getPropertyValue("--cta")).toBe("#ED1072");
    expect(addBtn().style.getPropertyValue("--cta-hover")).toBe("#9D1F60");
  });
});
