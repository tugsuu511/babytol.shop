"use client";

import { useSyncExternalStore } from "react";
import { MAX_QTY, productBySlug } from "@/lib/products";

// Захиалгын сагс — localStorage-д хадгалагдана, табууд хооронд синк хийнэ.
// useSyncExternalStore: сервер дээр хоосон сагс рендерлээд hydration-ий дараа хадгалсныг уншина.

export type CartLine = { slug: string; qty: number };
/** Сүүлд нэмсэн бүтээгдэхүүний мэдэгдэл (toast). id нь дахин нэмэхэд таймерыг шинэчлэхэд хэрэгтэй. */
export type CartToast = { id: number; slug: string; qty: number };
type CartState = { lines: CartLine[]; open: boolean; checkout: boolean; toast: CartToast | null };

const STORAGE_KEY = "babytol-cart-v1";
export { MAX_QTY };

const SERVER_STATE: CartState = { lines: [], open: false, checkout: false, toast: null };
let state: CartState = SERVER_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): CartLine[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((l): l is CartLine => typeof l?.slug === "string" && Number.isInteger(l?.qty))
      .filter((l) => productBySlug(l.slug) && l.qty > 0)
      .map((l) => ({ slug: l.slug, qty: Math.min(l.qty, MAX_QTY) }));
  } catch {
    return [];
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = { lines: readStorage(), open: false, checkout: false, toast: null };
}

function emit() {
  listeners.forEach((l) => l());
}

function setLines(lines: CartLine[]) {
  ensureLoaded();
  state = { ...state, lines };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Хувийн цонх гэх мэт — санах ойд л үлдэнэ
  }
  emit();
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY) return;
  state = { ...state, lines: readStorage() };
  emit();
}

function subscribe(listener: () => void) {
  ensureLoaded();
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  ensureLoaded();
  return state;
};
const getServerSnapshot = () => SERVER_STATE;

const clamp = (n: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(n)));

export const cart = {
  add(slug: string, qty = 1) {
    ensureLoaded();
    const existing = state.lines.find((l) => l.slug === slug);
    state = { ...state, toast: { id: Date.now(), slug, qty } };
    setLines(
      existing
        ? state.lines.map((l) => (l.slug === slug ? { ...l, qty: clamp(l.qty + qty) } : l))
        : [...state.lines, { slug, qty: clamp(qty) }],
    );
  },
  setQty(slug: string, qty: number) {
    ensureLoaded();
    const q = clamp(qty);
    setLines(
      q === 0
        ? state.lines.filter((l) => l.slug !== slug)
        : state.lines.map((l) => (l.slug === slug ? { ...l, qty: q } : l)),
    );
  },
  remove(slug: string) {
    ensureLoaded();
    setLines(state.lines.filter((l) => l.slug !== slug));
  },
  clear() {
    setLines([]);
  },
  open() {
    ensureLoaded();
    state = { ...state, open: true, toast: null };
    emit();
  },
  dismissToast() {
    if (!state.toast) return;
    state = { ...state, toast: null };
    emit();
  },
  close() {
    state = { ...state, open: false };
    emit();
  },
  /** Сагсыг хааж, захиалгын dialog нээнэ */
  openCheckout() {
    ensureLoaded();
    state = { ...state, open: false, checkout: true, toast: null };
    emit();
  },
  closeCheckout() {
    state = { ...state, checkout: false };
    emit();
  },
  /** Захиалгын dialog-оос сагс руу буцах ("Өөрчлөх") */
  backToCart() {
    state = { ...state, open: true, checkout: false };
    emit();
  },
};

export function useCart() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = s.lines.flatMap((l) => {
    const product = productBySlug(l.slug);
    return product ? [{ ...l, product, lineTotal: product.price * l.qty }] : [];
  });
  return {
    items,
    isOpen: s.open,
    isCheckoutOpen: s.checkout,
    toast: s.toast,
    count: items.reduce((n, i) => n + i.qty, 0),
    total: items.reduce((n, i) => n + i.lineTotal, 0),
  };
}
