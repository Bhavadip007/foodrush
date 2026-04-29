import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CartItem } from "@/components/cart/CartItem";
import { menuItems } from "@/lib/db/menuData";

describe("CartItem", () => {
  it("renders quantity and handles stepper actions", () => {
    const onIncrease = vi.fn();
    const onDecrease = vi.fn();
    const onRemove = vi.fn();

    render(
      <CartItem
        item={{ menuItem: menuItems[1], quantity: 2 }}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
      />,
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(onIncrease).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "-" }));
    expect(onDecrease).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: `Remove ${menuItems[1].name}` }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
