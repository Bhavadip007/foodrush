import { NextResponse } from "next/server";

import { createOrder } from "@/lib/db/ordersDb";
import { orderSchema } from "@/lib/validators/orderValidator";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = orderSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid order payload",
        details: result.error.flatten(),
      },
      { status: 400 },
    );
  }

  const order = createOrder(result.data);
  return NextResponse.json({ success: true, data: order }, { status: 201 });
}
