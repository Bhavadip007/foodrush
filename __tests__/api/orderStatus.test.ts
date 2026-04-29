import { afterEach, describe, expect, it } from "vitest";

import { PATCH } from "@/app/api/orders/[id]/route";
import { POST } from "@/app/api/orders/route";
import { menuItems } from "@/lib/db/menuData";
import { clearOrdersForTests } from "@/lib/db/ordersDb";

const basePayload = {
  items: [{ menuItem: menuItems[1], quantity: 1 }],
  deliveryDetails: {
    name: "Taylor",
    phone: "+14155550123",
    address: "200 River Street, NYC",
    notes: "",
  },
};

describe("PATCH /api/orders/:id", () => {
  afterEach(() => {
    clearOrdersForTests();
  });

  it("updates valid status", async () => {
    const create = await POST(
      new Request("http://localhost/api/orders", {
        method: "POST",
        body: JSON.stringify(basePayload),
      }),
    );
    const order = (await create.json()).data;

    const response = await PATCH(
      new Request("http://localhost/api/orders/id", {
        method: "PATCH",
        body: JSON.stringify({ status: "Preparing" }),
      }),
      { params: { id: order.id } },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.status).toBe("Preparing");
  });

  it("rejects invalid status", async () => {
    const response = await PATCH(
      new Request("http://localhost/api/orders/id", {
        method: "PATCH",
        body: JSON.stringify({ status: "Cooking" }),
      }),
      { params: { id: "x" } },
    );

    expect(response.status).toBe(400);
  });

  it("returns 404 on unknown id", async () => {
    const response = await PATCH(
      new Request("http://localhost/api/orders/id", {
        method: "PATCH",
        body: JSON.stringify({ status: "Preparing" }),
      }),
      { params: { id: "missing" } },
    );

    expect(response.status).toBe(404);
  });
});
