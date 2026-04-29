import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MenuCard } from "@/components/menu/MenuCard";
import { menuItems } from "@/lib/db/menuData";

describe("MenuCard", () => {
  it("renders item details and add action", () => {
    const item = menuItems[0];
    const onAdd = vi.fn();

    render(
      <MenuCard item={item} quantity={0} onAdd={onAdd} onIncrement={vi.fn()} onDecrement={vi.fn()} />,
    );

    expect(screen.getByText(item.name)).toBeInTheDocument();
    expect(screen.getByText(item.description)).toBeInTheDocument();
    expect(screen.getByText("Popular")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: `Add ${item.name}` }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
