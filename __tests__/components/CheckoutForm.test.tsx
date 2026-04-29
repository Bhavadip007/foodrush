import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";

describe("CheckoutForm", () => {
  it("shows validation for empty name", async () => {
    render(<CheckoutForm onSubmit={vi.fn()} isSubmitting={false} />);

    fireEvent.change(screen.getByPlaceholderText("John Carter"), { target: { value: "A" } });
    fireEvent.blur(screen.getByPlaceholderText("John Carter"));

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 2 characters.")).toBeInTheDocument();
    });
  });

  it("shows validation for invalid phone", async () => {
    render(<CheckoutForm onSubmit={vi.fn()} isSubmitting={false} />);

    fireEvent.change(screen.getByPlaceholderText("+919999999999"), { target: { value: "123" } });
    fireEvent.blur(screen.getByPlaceholderText("+919999999999"));

    await waitFor(() => {
      expect(screen.getByText("Enter a valid phone number.")).toBeInTheDocument();
    });
  });

  it("submits valid values", async () => {
    const onSubmit = vi.fn(async () => undefined);
    render(<CheckoutForm onSubmit={onSubmit} isSubmitting={false} />);

    fireEvent.change(screen.getByPlaceholderText("John Carter"), { target: { value: "John Carter" } });
    fireEvent.change(screen.getByPlaceholderText("+919999999999"), { target: { value: "+919999999999" } });
    fireEvent.change(screen.getByPlaceholderText("221B Baker Street, London..."), {
      target: { value: "221B Baker Street, London" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Place Order/i }).closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
