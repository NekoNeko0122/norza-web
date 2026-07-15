import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Proxies Google Places (New) photo media server-side so the API key never
// reaches the browser — an <img src> can't attach the auth header Google
// wants, so this route fetches the bytes here and streams them back.
export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return new NextResponse(null, { status: 404 });

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const width = searchParams.get("w") ?? "1200";
  if (!name || !name.startsWith("places/")) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${encodeURIComponent(width)}&key=${apiKey}`,
      { next: { revalidate: 60 * 60 * 24 * 7 } }
    );
    if (!res.ok || !res.body) return new NextResponse(null, { status: 404 });

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
