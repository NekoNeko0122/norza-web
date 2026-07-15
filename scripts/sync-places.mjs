// Syncs destinations.ts and food.ts from the Google Places API (New).
// Grid-searches the whole Norzagaray boundary box with Nearby Search
// (filtered by category types), dedupes by Place ID, then fetches full
// Place Details (rating, reviews, photos, hours, location) for every
// unique place found. Re-run any time to pick up new/updated places —
// this is a mechanical pull from Google, not a hand-curated list.
//
// Usage: node scripts/sync-places.mjs

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const envLocal = readFileSync(path.join(ROOT, ".env.local"), "utf8");
const apiKey = envLocal.match(/GOOGLE_PLACES_API_KEY=(.+)/)?.[1]?.trim();
if (!apiKey) {
  console.error("No GOOGLE_PLACES_API_KEY in .env.local");
  process.exit(1);
}

const BASE = "https://places.googleapis.com/v1";

// Norzagaray's bounding box (from src/lib/map.ts / the boundary polygon)
const BOUNDS = { minLat: 14.81782, maxLat: 14.9719, minLng: 121.02256, maxLng: 121.33453 };

const DESTINATION_TYPES = [
  "tourist_attraction",
  "park",
  "national_park",
  "hiking_area",
  "campground",
  "historical_landmark",
  "monument",
  "church",
  "museum",
];
const FOOD_TYPES = [
  "restaurant",
  "cafe",
  "bakery",
  "meal_takeaway",
  "meal_delivery",
  "fast_food_restaurant",
  "coffee_shop",
];

function buildGrid(spacingKm = 5, radiusKm = 3.6) {
  const latSpacing = spacingKm / 111; // ~111km per degree latitude
  const midLat = (BOUNDS.minLat + BOUNDS.maxLat) / 2;
  const kmPerLngDeg = 111 * Math.cos((midLat * Math.PI) / 180);
  const lngSpacing = spacingKm / kmPerLngDeg;

  const points = [];
  for (let lat = BOUNDS.minLat; lat <= BOUNDS.maxLat; lat += latSpacing) {
    for (let lng = BOUNDS.minLng; lng <= BOUNDS.maxLng; lng += lngSpacing) {
      points.push({ lat, lng });
    }
  }
  return { points, radiusMeters: radiusKm * 1000 };
}

async function nearbySearch(center, radiusMeters, includedTypes) {
  const res = await fetch(`${BASE}/places:searchNearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.location",
    },
    body: JSON.stringify({
      includedTypes,
      maxResultCount: 20,
      locationRestriction: {
        circle: { center: { latitude: center.lat, longitude: center.lng }, radius: radiusMeters },
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  nearbySearch failed at ${center.lat},${center.lng}:`, res.status, err.slice(0, 200));
    return [];
  }
  const data = await res.json();
  return data.places ?? [];
}

async function placeDetails(placeId) {
  const res = await fetch(`${BASE}/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": [
        "id",
        "displayName",
        "formattedAddress",
        "addressComponents",
        "location",
        "rating",
        "userRatingCount",
        "googleMapsUri",
        "types",
        "primaryType",
        "editorialSummary",
        "regularOpeningHours",
        "priceLevel",
        "photos",
      ].join(","),
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function collectUniquePlaces(types, label) {
  const { points, radiusMeters } = buildGrid();
  console.log(`\n=== ${label}: searching ${points.length} grid cells ===`);
  const found = new Map();
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const places = await nearbySearch(p, radiusMeters, types);
    for (const place of places) found.set(place.id, place);
    process.stdout.write(`\r  cell ${i + 1}/${points.length}, unique so far: ${found.size}   `);
    await sleep(80);
  }
  console.log(`\n  ${label}: ${found.size} unique places found`);
  return [...found.keys()];
}

async function fetchAllDetails(placeIds, label) {
  console.log(`\n=== ${label}: fetching details for ${placeIds.length} places ===`);
  const results = [];
  for (let i = 0; i < placeIds.length; i++) {
    const d = await placeDetails(placeIds[i]);
    if (d) results.push(d);
    process.stdout.write(`\r  ${i + 1}/${placeIds.length}   `);
    await sleep(80);
  }
  console.log("");
  return results;
}

const destinationIds = await collectUniquePlaces(DESTINATION_TYPES, "Destinations");
const foodIds = await collectUniquePlaces(FOOD_TYPES, "Food");

const destinationDetails = await fetchAllDetails(destinationIds, "Destinations");
const foodDetails = await fetchAllDetails(foodIds, "Food");

writeFileSync(
  path.join(ROOT, "scripts", "places-raw-destinations.json"),
  JSON.stringify(destinationDetails, null, 2)
);
writeFileSync(path.join(ROOT, "scripts", "places-raw-food.json"), JSON.stringify(foodDetails, null, 2));

console.log(`\nDone. Wrote ${destinationDetails.length} destinations, ${foodDetails.length} food places.`);
console.log("Raw data saved to scripts/places-raw-destinations.json and scripts/places-raw-food.json");
