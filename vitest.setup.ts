import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Зарим тест (server action, цэвэр логик) `@vitest-environment node` дээр ажилладаг
const isDom = typeof window !== "undefined";

afterEach(() => {
  if (!isDom) return;
  cleanup();
  localStorage.clear();
  document.body.style.overflow = "";
});

// jsdom-д native <dialog>-ийн showModal/close бүрэн байхгүй байж болно — хамгийн бага polyfill.
if (isDom && typeof HTMLDialogElement !== "undefined" &&!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}
