import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/menu/route";

describe("GET /api/menu", () => {
  it("returns menu with success shape", async () => {
    const request = new NextRequest("http://localhost:3000/api/menu");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
      }),
    );
  });

  it("filters menu by category", async () => {
    const request = new NextRequest("http://localhost:3000/api/menu?category=Sushi");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.every((item: { category: string }) => item.category === "Sushi")).toBe(true);
  });
});
