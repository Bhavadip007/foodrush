import { NextRequest, NextResponse } from "next/server";

import { menuItems } from "@/lib/db/menuData";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const data = category ? menuItems.filter((item) => item.category === category) : menuItems;

  return NextResponse.json({ success: true, data }, { status: 200 });
}
