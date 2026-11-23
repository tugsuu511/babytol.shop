import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OrgExplorer } from "@/components/about/org-explorer";

// next/font нь Next-ийн compiler-гүйгээр ажиллахгүй
vi.mock("next/font/google", () => ({ Dancing_Script: () => ({ className: "font-script" }) }));

beforeEach(() => {
  vi.useFakeTimers();
  window.history.replaceState(null, "", "/about");
  // Хөдөлгөөнгүй горим — шилжилт шууд хэрэгжинэ
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), media: q }) as MediaQueryList);
  window.scrollTo = vi.fn() as typeof window.scrollTo;
});
afterEach(() => vi.useRealTimers());

const renderExplorer = () =>
  render(<OrgExplorer maker={<p>maker-body</p>} supplier={<p>supplier-body</p>} />);

/** go() эхлээд гүйлгэж, гүйлгэлт тогтворжихыг хүлээдэг */
const settle = () => act(() => vi.runAllTimersAsync());

describe("OrgExplorer", () => {
  it.each([
    ["maker", 0, "maker-body"],
    ["supplier", 1, "supplier-body"],
  ] as const)("opens %s from the card's «Дэлгэрэнгүй» CTA", async (org, i, body) => {
    renderExplorer();
    fireEvent.click(screen.getAllByText("Дэлгэрэнгүй")[i]);
    await settle();

    expect(window.location.hash).toBe(`#${org}`);
    expect(screen.getByText(body)).toBeInTheDocument();
  });

  it("opens once from the heading button (click bubbles to the card)", async () => {
    const push = vi.spyOn(window.history, "pushState");
    renderExplorer();
    fireEvent.click(screen.getByRole("button", { name: "Нийлүүлэгч" }));
    await settle();

    expect(push).toHaveBeenCalledTimes(1);
    expect(screen.getByText("supplier-body")).toBeInTheDocument();
  });
});
