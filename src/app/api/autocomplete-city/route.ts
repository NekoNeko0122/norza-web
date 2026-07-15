import { NextRequest, NextResponse } from "next/server";
import { autocompleteCity } from "@/lib/googlePlaces";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input") ?? "";
  const suggestions = await autocompleteCity(input);

  if (suggestions === null) {
    return NextResponse.json({ error: "not_configured", suggestions: [] }, { status: 503 });
  }
  return NextResponse.json({ suggestions });
}
