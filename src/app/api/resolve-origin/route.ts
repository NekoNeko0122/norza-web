import { NextRequest, NextResponse } from "next/server";
import { resolveCity, resolveCityByPlaceId } from "@/lib/googlePlaces";

export const runtime = "nodejs";

const ERROR_MESSAGES: Record<string, string> = {
  not_found: "We couldn't find that city or municipality. Check the spelling and try again.",
  not_in_philippines: "That doesn't look like a place in the Philippines. Try a nearby major city instead.",
  not_a_city: "That matched a specific place, not a city or municipality. Try just the city/municipality name.",
  lookup_failed: "Something went wrong looking that up. Please try again.",
};

export async function POST(req: NextRequest) {
  let body: { city?: string; placeId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const placeId = body.placeId?.trim();
  const city = body.city?.trim();
  if (!placeId && !city) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  const result = placeId ? await resolveCityByPlaceId(placeId) : await resolveCity(city!);

  if (result === null) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error, message: ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.lookup_failed },
      { status: 422 }
    );
  }

  return NextResponse.json(result);
}
