import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const KEY = "babytol-cart-v1";

// cart.ts нь модулийн түвшний төлөвтэй — тест бүрт шинэ instance ачаална.
async function loadCart(stored?: unknown) {
  if (stored !== undefined) {
    localStorage.setItem(KEY, typeof stored === "string" ? stored : JSON.stringify(stored));
  }
  vi.resetModules();
  const mod = await import("@/lib/cart");
  const hook = renderHook(() => mod.useCart());
  return { ...mod, hook, state: () => hook.result.current };
}

const stored = () => JSON.parse(localStorage.getItem(KEY) ?? "null");

beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());

describe("cart.add", () => {
  it("adds a new line, persists it and shows a toast", async () => {
    const { cart, state } = await loadCart();
    act(() => cart.add("d3", 2));

    expect(state().items).toHaveLength(1);
    expect(state().items[0]).toMatchObject({ slug: "d3", qty: 2, lineTotal: 56000 });
    expect(state().count).toBe(2);
    expect(state().total).toBe(56000);
    expect(state().toast).toMatchObject({ slug: "d3", qty: 2 });
    expect(stored()).toEqual([{ slug: "d3", qty: 2 }]);
  });

  it("defaults to qty 1", async () => {
    const { cart, state } = await loadCart();
    act(() => cart.add("d3-k1"));
    expect(state().items[0].qty).toBe(1);
  });

  it("increments an existing line instead of duplicating it", async () => {
    const { cart, state } = await loadCart();
    act(() => {
      cart.add("d3", 1);
      cart.add("d3", 3);
    });
    expect(state().items).toHaveLength(1);
    expect(state().items[0].qty).toBe(4);
  });

  it("clamps to MAX_QTY", async () => {
    const { cart, state, MAX_QTY } = await loadCart();
    act(() => {
      cart.add("d3", MAX_QTY - 1);
      cart.add("d3", 5);
      cart.add("d3-k1", 999);
    });
    expect(state().items.map((i) => i.qty)).toEqual([MAX_QTY, MAX_QTY]);
  });

  it("gives each toast a fresh id so the auto-hide timer restarts", async () => {
    vi.useFakeTimers();
    const { cart, state } = await loadCart();
    vi.setSystemTime(1000);
    act(() => cart.add("d3"));
    const first = state().toast!.id;
    vi.setSystemTime(2000);
    act(() => cart.add("d3"));
    expect(state().toast!.id).not.toBe(first);
  });

  it("keeps lines in insertion order and sums mixed totals", async () => {
    const { cart, state } = await loadCart();
    act(() => {
      cart.add("dha-omega", 1); // 42 000
      cart.add("d3", 2); // 56 000
      cart.add("d3-dha-omega", 1); // 50 000
    });
    expect(state().items.map((i) => i.slug)).toEqual(["dha-omega", "d3", "d3-dha-omega"]);
    expect(state().count).toBe(4);
    expect(state().total).toBe(148000);
  });
});

describe("cart.setQty", () => {
  it("updates, floors and clamps quantity", async () => {
    const { cart, state, MAX_QTY } = await loadCart();
    act(() => cart.add("d3"));
    act(() => cart.setQty("d3", 5.9));
    expect(state().items[0].qty).toBe(5);
    act(() => cart.setQty("d3", 1000));
    expect(state().items[0].qty).toBe(MAX_QTY);
  });

  it.each([0, -3, 0.4])("removes the line when qty is %d", async (q) => {
    const { cart, state } = await loadCart();
    act(() => cart.add("d3"));
    act(() => cart.setQty("d3", q));
    expect(state().items).toEqual([]);
    expect(stored()).toEqual([]);
  });

  it("ignores slugs that are not in the cart", async () => {
    const { cart, state } = await loadCart();
    act(() => cart.add("d3"));
    act(() => cart.setQty("d3-k1", 4));
    expect(state().items.map((i) => i.slug)).toEqual(["d3"]);
  });
});

describe("cart.remove / cart.clear", () => {
  it("removes a single line", async () => {
    const { cart, state } = await loadCart();
    act(() => {
      cart.add("d3");
      cart.add("d3-k1");
    });
    act(() => cart.remove("d3"));
    expect(state().items.map((i) => i.slug)).toEqual(["d3-k1"]);
  });

  it("clears everything", async () => {
    const { cart, state } = await loadCart();
    act(() => {
      cart.add("d3");
      cart.add("d3-k1");
    });
    act(() => cart.clear());
    expect(state()).toMatchObject({ items: [], count: 0, total: 0 });
    expect(stored()).toEqual([]);
  });
});

describe("drawer / checkout / toast flags", () => {
  it("open() opens the drawer and hides the toast", async () => {
    const { cart, state } = await loadCart();
    act(() => cart.add("d3"));
    act(() => cart.open());
    expect(state().isOpen).toBe(true);
    expect(state().toast).toBeNull();
    act(() => cart.close());
    expect(state().isOpen).toBe(false);
  });

  it("openCheckout() closes the drawer and opens checkout; backToCart() reverses it", async () => {
    const { cart, state } = await loadCart();
    act(() => cart.open());
    act(() => cart.openCheckout());
    expect(state()).toMatchObject({ isOpen: false, isCheckoutOpen: true, toast: null });
    act(() => cart.backToCart());
    expect(state()).toMatchObject({ isOpen: true, isCheckoutOpen: false });
    act(() => {
      cart.openCheckout();
      cart.closeCheckout();
    });
    expect(state().isCheckoutOpen).toBe(false);
  });

  it("dismissToast() clears the toast and is a no-op without one", async () => {
    const { cart, state, hook } = await loadCart();
    const before = hook.result.current;
    act(() => cart.dismissToast());
    expect(hook.result.current).toBe(before); // no re-render
    act(() => cart.add("d3"));
    act(() => cart.dismissToast());
    expect(state().toast).toBeNull();
    expect(state().items).toHaveLength(1);
  });
});

describe("persistence", () => {
  it("restores a saved cart on load", async () => {
    const { state } = await loadCart([
      { slug: "d3", qty: 2 },
      { slug: "dha-omega", qty: 1 },
    ]);
    expect(state().count).toBe(3);
    expect(state().total).toBe(28000 * 2 + 42000);
  });

  it("drops corrupted, unknown or invalid lines from storage", async () => {
    const { state, MAX_QTY } = await loadCart([
      { slug: "d3", qty: 99 }, // → MAX_QTY
      { slug: "not-a-product", qty: 1 },
      { slug: "d3-k1", qty: 0 },
      { slug: "d3-k1", qty: -2 },
      { slug: "d3-k1", qty: 1.5 },
      { slug: 42, qty: 1 },
      { qty: 1 },
      null,
      "d3",
      { slug: "dha-omega", qty: "3" },
      { slug: "d3-dha-omega", qty: 1 },
    ]);
    expect(state().items.map(({ slug, qty }) => ({ slug, qty }))).toEqual([
      { slug: "d3", qty: MAX_QTY },
      { slug: "d3-dha-omega", qty: 1 },
    ]);
  });

  it.each(["{not json", '{"slug":"d3"}', "42", "null"])("treats %j in storage as an empty cart", async (raw) => {
    const { state } = await loadCart(raw);
    expect(state().items).toEqual([]);
  });

  it("keeps working in memory when localStorage.setItem throws", async () => {
    const { cart, state } = await loadCart();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError");
    });
    act(() => cart.add("d3", 3));
    expect(state().count).toBe(3);
  });

  it("syncs when another tab changes the cart", async () => {
    const { state } = await loadCart();
    act(() => {
      localStorage.setItem(KEY, JSON.stringify([{ slug: "d3-k1", qty: 4 }]));
      window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    });
    expect(state().items).toMatchObject([{ slug: "d3-k1", qty: 4 }]);
  });

  it("ignores storage events for other keys", async () => {
    const { state, hook } = await loadCart();
    const before = hook.result.current;
    act(() => {
      localStorage.setItem(KEY, JSON.stringify([{ slug: "d3", qty: 1 }]));
      window.dispatchEvent(new StorageEvent("storage", { key: "something-else" }));
    });
    expect(hook.result.current).toBe(before);
    expect(state().items).toEqual([]);
  });

  it("removes the storage listener once the last subscriber unmounts", async () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { hook } = await loadCart();
    hook.unmount();
    expect(remove).toHaveBeenCalledWith("storage", expect.any(Function));
  });
});
