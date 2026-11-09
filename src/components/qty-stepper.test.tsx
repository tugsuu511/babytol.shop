import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QtyStepper } from "@/components/qty-stepper";
import { MAX_QTY } from "@/lib/cart";

function setup(props: Partial<React.ComponentProps<typeof QtyStepper>> = {}) {
  const onChange = vi.fn();
  render(<QtyStepper value={3} onChange={onChange} label="D3 — тоо ширхэг" {...props} />);
  return {
    onChange,
    minus: screen.getByRole("button", { name: "Хасах" }),
    plus: screen.getByRole("button", { name: "Нэмэх" }),
  };
}

describe("QtyStepper", () => {
  it("exposes an accessible group with the current value", () => {
    setup();
    expect(screen.getByRole("group", { name: "D3 — тоо ширхэг" })).toHaveTextContent("3");
  });

  it("emits value ± 1", async () => {
    const user = userEvent.setup();
    const { onChange, minus, plus } = setup();
    await user.click(plus);
    await user.click(minus);
    expect(onChange.mock.calls).toEqual([[4], [2]]);
  });

  it("disables minus at the default min of 1", () => {
    const { minus, plus } = setup({ value: 1 });
    expect(minus).toBeDisabled();
    expect(plus).toBeEnabled();
  });

  it("allows going to 0 when min is 0 (cart: 0 = remove)", async () => {
    const user = userEvent.setup();
    const { onChange, minus } = setup({ value: 1, min: 0 });
    expect(minus).toBeEnabled();
    await user.click(minus);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("disables plus at MAX_QTY", async () => {
    const user = userEvent.setup();
    const { onChange, plus } = setup({ value: MAX_QTY });
    expect(plus).toBeDisabled();
    await user.click(plus);
    expect(onChange).not.toHaveBeenCalled();
  });
});
