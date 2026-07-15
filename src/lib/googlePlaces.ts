// Server-only helper for the Google Places API (New). Requires
// GOOGLE_PLACES_API_KEY to be set; every function returns null when the key
// is missing so pages can render fine without it, same pattern as the Groq
// AI assistant.

const PLACES_BASE = "https://places.googleapis.com/v1";

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

export interface GooglePlacePhoto {
  name: string;
  widthPx?: number;
  heightPx?: number;
}

export interface GooglePlaceData {
  placeId: string;
  displayName: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews: GoogleReview[];
  photos: GooglePlacePhoto[];
}

interface RawReview {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: { displayName?: string; photoUri?: string };
}

interface RawPhoto {
  name: string;
  widthPx?: number;
  heightPx?: number;
}

interface RawPlaceDetails {
  id: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: RawReview[];
  photos?: RawPhoto[];
}

export async function findPlaceId(query: string): Promise<{ placeId: string; displayName: string } | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${PLACES_BASE}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
      },
      body: JSON.stringify({ textQuery: query, regionCode: "PH" }),
    });
    if (!res.ok) return null;
    const data: { places?: { id: string; displayName?: { text?: string } }[] } = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return { placeId: place.id, displayName: place.displayName?.text ?? query };
  } catch {
    return null;
  }
}

export interface ResolvedCity {
  label: string;
  lat: number;
  lng: number;
  /** false when there's no road/bridge connection to mainland Luzon at all
   * (a different island region, or Batanes) — a "drive time" estimate would
   * be meaningless, this trip needs a flight or ferry to Luzon first */
  roadConnected: boolean;
}

const CITY_TYPES = new Set([
  "locality",
  "administrative_area_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "administrative_area_level_4",
]);

// mainland-Luzon regions reachable by the Pan-Philippine Highway network —
// anything NOT in this list is treated as requiring a flight/ferry, which
// is the safer default than falsely implying every place is driveable
const ROAD_CONNECTED_REGIONS = new Set([
  "ilocos region",
  "cagayan valley",
  "central luzon",
  "calabarzon",
  "bicol",
  "bicol region",
  "cordillera administrative region",
  "car",
  "national capital region",
  "metro manila",
  "ncr",
]);

// Batanes sits within the Cagayan Valley region administratively, but the
// island itself has no road/bridge to Luzon — flight/ferry only
const ISLAND_PROVINCE_EXCEPTIONS = new Set(["batanes"]);

interface RawPlaceGeo {
  displayName?: { text?: string };
  location?: { latitude: number; longitude: number };
  types?: string[];
  addressComponents?: { shortText?: string; longText?: string; types?: string[] }[];
}

function validateCityPlace(place: RawPlaceGeo | undefined, fallbackLabel: string): ResolvedCity | { error: string } {
  if (!place || !place.location) return { error: "not_found" };

  const isPH = place.addressComponents?.some(
    (c) => c.types?.includes("country") && (c.shortText === "PH" || c.longText === "Philippines")
  );
  if (!isPH) return { error: "not_in_philippines" };

  const isCityLike = place.types?.some((t) => CITY_TYPES.has(t));
  if (!isCityLike) return { error: "not_a_city" };

  const region = place.addressComponents
    ?.find((c) => c.types?.includes("administrative_area_level_1"))
    ?.longText?.toLowerCase();
  const province = place.addressComponents
    ?.find((c) => c.types?.includes("administrative_area_level_2"))
    ?.longText?.toLowerCase();
  const roadConnected = !!region && ROAD_CONNECTED_REGIONS.has(region) && !(province && ISLAND_PROVINCE_EXCEPTIONS.has(province));

  return {
    label: place.displayName?.text ?? fallbackLabel,
    lat: place.location.latitude,
    lng: place.location.longitude,
    roadConnected,
  };
}

const GEO_FIELDS = ["displayName", "location", "types", "addressComponents"];

/** Resolves a free-typed city/municipality name to real coordinates, only
 * accepting results that are actually inside the Philippines and actually
 * look like a city/municipality/province (not a business or random POI). */
export async function resolveCity(query: string): Promise<ResolvedCity | { error: string } | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${PLACES_BASE}/places:searchText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": ["places.id", "places.formattedAddress", ...GEO_FIELDS.map((f) => `places.${f}`)].join(","),
      },
      body: JSON.stringify({ textQuery: query, regionCode: "PH" }),
    });
    if (!res.ok) return { error: "lookup_failed" };

    const data: { places?: RawPlaceGeo[] } = await res.json();
    return validateCityPlace(data.places?.[0], query);
  } catch {
    return { error: "lookup_failed" };
  }
}

/** Same validation as resolveCity, but resolves an exact Place ID — used
 * when the user picks a suggestion from the autocomplete dropdown, since
 * that's unambiguous and skips a second fuzzy text search. */
export async function resolveCityByPlaceId(placeId: string): Promise<ResolvedCity | { error: string } | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": GEO_FIELDS.join(",") },
    });
    if (!res.ok) return { error: "lookup_failed" };
    const place: RawPlaceGeo = await res.json();
    return validateCityPlace(place, "");
  } catch {
    return { error: "lookup_failed" };
  }
}

export interface CitySuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

/** Live autocomplete predictions as the user types, restricted to PH
 * cities/municipalities/provinces. */
export async function autocompleteCity(input: string): Promise<CitySuggestion[] | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !input.trim()) return apiKey ? [] : null;

  try {
    const res = await fetch(`${PLACES_BASE}/places:autocomplete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey },
      body: JSON.stringify({
        input,
        includedRegionCodes: ["ph"],
        includedPrimaryTypes: ["locality", "administrative_area_level_2", "administrative_area_level_3"],
      }),
    });
    if (!res.ok) return [];

    const data: {
      suggestions?: {
        placePrediction?: {
          placeId: string;
          structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
        };
      }[];
    } = await res.json();

    return (data.suggestions ?? [])
      .map((s) => s.placePrediction)
      .filter((p): p is NonNullable<typeof p> => !!p)
      .map((p) => ({
        placeId: p.placeId,
        mainText: p.structuredFormat?.mainText?.text ?? "",
        secondaryText: p.structuredFormat?.secondaryText?.text ?? "",
      }));
  } catch {
    return [];
  }
}

export async function getPlaceReviews(placeId: string): Promise<GooglePlaceData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews,photos",
      },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const data: RawPlaceDetails = await res.json();

    return {
      placeId: data.id,
      displayName: data.displayName?.text ?? "",
      rating: data.rating,
      userRatingCount: data.userRatingCount,
      googleMapsUri: data.googleMapsUri,
      reviews: (data.reviews ?? []).map((r) => ({
        authorName: r.authorAttribution?.displayName ?? "Google user",
        authorPhotoUrl: r.authorAttribution?.photoUri,
        rating: r.rating ?? 0,
        text: r.text?.text ?? r.originalText?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime ?? "",
      })),
      photos: (data.photos ?? []).map((p) => ({
        name: p.name,
        widthPx: p.widthPx,
        heightPx: p.heightPx,
      })),
    };
  } catch {
    return null;
  }
}
