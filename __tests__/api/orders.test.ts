import { afterEach, describe, expect, it } from "vitest";

import { GET } from "@/app/api/orders/[id]/route";
import { POST } from "@/app/api/orders/route";
import { menuItems } from "@/lib/db/menuData";
import { clearOrdersForTests } from "@/lib/db/ordersDb";

const validPayload = {
  items: [{ menuItem: menuItems[0], quantity: 2 }],
  deliveryDetails: {
    name: "Alex Doe",
    phone: "+919999999999",
    address: "42 Sunset Boulevard, Downtown",
    notes: "Call on arrival",
  },
};

describe("POST /api/orders", () => {
  afterEach(() => {
    clearOrdersForTests();
  });

  it("creates order with received status", async () => {
    const response = await POST(new Request("http://localhost:3000/api/orders", { method: "POST", body: JSON.stringify(validPayload) }));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("Order Received");
    expect(body.data.id).toEqual(expect.any(String));
  });

  it("fails on empty items", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/orders", {
        method: "POST",
        body: JSON.stringify({ ...validPayload, items: [] }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("fails on invalid phone", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...validPayload,
          deliveryDetails: { ...validPayload.deliveryDetails, phone: "12345" },
        }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("fails on short address", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...validPayload,
          deliveryDetails: { ...validPayload.deliveryDetails, address: "short" },
        }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("fails on missing name", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...validPayload,
          deliveryDetails: { ...validPayload.deliveryDetails, name: "" },
        }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("returns order by id", async () => {
    const createResponse = await POST(
      new Request("http://localhost:3000/api/orders", {
        method: "POST",
        body: JSON.stringify(validPayload),
      }),
    );
    const createBody = await createResponse.json();

    const getResponse = await GET(new Request("http://localhost:3000/api/orders/1"), {
      params: { id: createBody.data.id },
    });
    const getBody = await getResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getBody.data.id).toBe(createBody.data.id);
  });

  it("returns 404 for unknown id", async () => {
    const response = await GET(new Request("http://localhost:3000/api/orders/unknown"), {
      params: { id: "unknown-id" },
    });

    expect(response.status).toBe(404);
  });
});
