// Transforms scripts/places-raw-*.json (from sync-places.mjs) into the
// TypeScript entries appended to src/data/destinations.ts / food.ts.
// Filters to real Norzagaray results, maps Google's place types to our
// category enums, and skips anything whose Place ID we already have a
// hand-researched entry for (so richer manually-written entries aren't
// overwritten by the thinner auto-generated ones).

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const OFFICIAL_BARANGAYS = [
  "Bangkal",
  "Baraka",
  "Bigte",
  "Bitungol",
  "Friendship Village Resources",
  "Matictic",
  "Minuyan",
  "Partida",
  "Pinagtulayan",
  "Poblacion",
  "San Lorenzo",
  "San Mateo",
  "Tigbe",
];

const DEST_GRADIENTS = [
  ["#f472b6", "#a855f7"],
  ["#fb7185", "#f9a8d4"],
  ["#f9a8d4", "#c084fc"],
  ["#22d3ee", "#f472b6"],
  ["#a855f7", "#ec4899"],
  ["#38bdf8", "#e879f9"],
  ["#fda4af", "#fbcfe8"],
  ["#38bdf8", "#0ea5e9"],
  ["#818cf8", "#c084fc"],
  ["#86efac", "#22d3ee"],
  ["#fbbf24", "#f472b6"],
  ["#34d399", "#0ea5e9"],
];
const FOOD_GRADIENTS = [
  ["#ff9f6b", "#e8532e"],
  ["#c084fc", "#8b5cf6"],
  ["#ffd6e8", "#ff92c4"],
  ["#ffe4c7", "#f5c26b"],
  ["#ffec99", "#eba83f"],
  ["#ff8fa3", "#e0355a"],
  ["#7dd3c0", "#1f9b8e"],
  ["#a3d9a5", "#4c9a5b"],
];

function locality(p) {
  const c = (p.addressComponents || []).find((c) => (c.types || []).includes("locality"));
  return c ? c.longText : null;
}

function barangayOf(p) {
  const comps = p.addressComponents || [];
  const sub = comps.find((c) => (c.types || []).includes("sublocality_level_1") || (c.types || []).includes("sublocality"));
  if (sub && OFFICIAL_BARANGAYS.some((b) => sub.longText.includes(b) || b.includes(sub.longText))) {
    return OFFICIAL_BARANGAYS.find((b) => sub.longText.includes(b) || b.includes(sub.longText));
  }
  const addr = p.formattedAddress || "";
  const match = OFFICIAL_BARANGAYS.find((b) => addr.includes(b));
  if (match) return match;
  const loc = locality(p);
  if (loc && OFFICIAL_BARANGAYS.includes(loc)) return loc;
  return "Norzagaray";
}

function slugify(name, used) {
  let base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  let slug = base;
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}-${n}`;
    n++;
  }
  used.add(slug);
  return slug;
}

function destCategory(p) {
  const t = p.primaryType || (p.types || [])[0] || "";
  const name = (p.displayName?.text || "").toLowerCase();
  if (t === "church" || t === "place_of_worship") return "religious";
  if (t === "campground" || t === "hiking_area") return "adventure";
  if (t === "park") return "park";
  if (t === "bridge") return "park";
  if (t === "historical_landmark" || t === "landmark" || t === "monument" || t === "museum") return "heritage";
  if (/view|tanawan|viewpoint|deck|hilltop/.test(name)) return "viewpoint";
  if (/camp|rappel|zip.?line|adventure|resort/.test(name)) return "adventure";
  return "nature";
}

function foodCategory(p) {
  const t = p.primaryType || (p.types || [])[0] || "";
  if (["coffee_shop", "cafe"].includes(t)) return "cafe";
  if (["bakery", "cake_shop", "dessert_shop", "ice_cream_shop"].includes(t)) return "delicacy";
  if (["fast_food_restaurant", "hamburger_restaurant", "meal_takeaway", "sandwich_shop"].includes(t)) return "street-food";
  return "restaurant";
}

const DEST_EXCLUDE_TYPES = new Set(["cemetery", "funeral_home", "real_estate_agency", "lodging", "school"]);
const FOOD_INCLUDE_TYPES = new Set([
  "restaurant",
  "cafe",
  "coffee_shop",
  "bakery",
  "cake_shop",
  "dessert_shop",
  "ice_cream_shop",
  "fast_food_restaurant",
  "hamburger_restaurant",
  "meal_takeaway",
  "sandwich_shop",
  "family_restaurant",
  "asian_restaurant",
  "filipino_restaurant",
  "breakfast_restaurant",
  "pizza_restaurant",
  "barbecue_restaurant",
  "seafood_restaurant",
]);

function openHoursText(p) {
  const desc = p.regularOpeningHours?.weekdayDescriptions;
  if (!desc || desc.length === 0) return undefined;
  return desc.join("; ");
}

function jsStr(s) {
  return JSON.stringify(s ?? "");
}

function Article(word) {
  return /^[aeiou]/i.test(word) ? "An" : "A";
}

function locationPhrase(barangay) {
  return barangay === "Norzagaray" ? "Norzagaray, Bulacan" : `Barangay ${barangay}, Norzagaray, Bulacan`;
}
function jsArr(arr) {
  if (!arr || arr.length === 0) return undefined;
  return `[${arr.map(jsStr).join(", ")}]`;
}

function destEntry(p, idx, used) {
  const name = p.displayName?.text?.trim();
  if (!name) return null;
  const slug = slugify(name, used);
  const barangay = barangayOf(p);
  const category = destCategory(p);
  const grad = DEST_GRADIENTS[idx % DEST_GRADIENTS.length];
  const lines = [];
  lines.push(`  {`);
  lines.push(`    id: ${jsStr(slug)},`);
  lines.push(`    slug: ${jsStr(slug)},`);
  lines.push(`    name: ${jsStr(name)},`);
  lines.push(`    category: ${jsStr(category)},`);
  lines.push(`    barangay: ${jsStr(barangay)},`);
  lines.push(`    address: ${jsStr(p.formattedAddress || `Barangay ${barangay}, Norzagaray, Bulacan`)},`);
  const kind = category === "religious" ? "place of worship" : category === "heritage" ? "heritage site" : `${category} spot`;
  const shortDesc = `${Article(kind)} ${kind} in ${locationPhrase(barangay)}.`;
  lines.push(`    shortDescription: ${jsStr(shortDesc)},`);
  lines.push(
    `    description: ${jsStr(
      `${name} is located in ${locationPhrase(barangay)}. Full details sourced from Google Maps; further description to be added.`
    )},`
  );
  lines.push(`    coordinates: { lat: ${p.location.latitude}, lng: ${p.location.longitude} },`);
  lines.push(`    coordinatesVerified: true,`);
  lines.push(`    onGoogleMaps: true,`);
  if (p.googleMapsUri) lines.push(`    googleMapsUrl: ${jsStr(p.googleMapsUri)},`);
  lines.push(`    placeId: ${jsStr(p.id)},`);
  const hours = openHoursText(p);
  if (hours) lines.push(`    openHours: ${jsStr(hours)},`);
  lines.push(`    reviews: [],`);
  lines.push(`    gradient: [${jsStr(grad[0])}, ${jsStr(grad[1])}],`);
  const tags = jsArr((p.types || []).filter((t) => !["point_of_interest", "establishment"].includes(t)));
  lines.push(`    tags: ${tags ?? "[]"},`);
  lines.push(`    featured: false,`);
  lines.push(`  },`);
  return lines.join("\n");
}

function foodEntry(p, idx, used) {
  const name = p.displayName?.text?.trim();
  if (!name) return null;
  const slug = slugify(name, used);
  const barangay = barangayOf(p);
  const category = foodCategory(p);
  const grad = FOOD_GRADIENTS[idx % FOOD_GRADIENTS.length];
  const lines = [];
  lines.push(`  {`);
  lines.push(`    id: ${jsStr(slug)},`);
  lines.push(`    slug: ${jsStr(slug)},`);
  lines.push(`    name: ${jsStr(name)},`);
  lines.push(`    category: ${jsStr(category)},`);
  lines.push(`    barangay: ${jsStr(barangay)},`);
  const kind = `${category} spot`;
  lines.push(`    shortDescription: ${jsStr(`${Article(kind)} ${kind} in ${locationPhrase(barangay)}.`)},`);
  lines.push(
    `    description: ${jsStr(
      `${name} is located in ${locationPhrase(barangay)}. Full details sourced from Google Maps; further description to be added.`
    )},`
  );
  lines.push(`    coordinates: { lat: ${p.location.latitude}, lng: ${p.location.longitude} },`);
  lines.push(`    coordinatesVerified: true,`);
  lines.push(`    placeId: ${jsStr(p.id)},`);
  const priceRangeByLevel = {
    PRICE_LEVEL_INEXPENSIVE: "₱ (budget-friendly)",
    PRICE_LEVEL_MODERATE: "₱₱ (moderate)",
    PRICE_LEVEL_EXPENSIVE: "₱₱₱ (higher-end)",
    PRICE_LEVEL_VERY_EXPENSIVE: "₱₱₱₱ (premium)",
  };
  lines.push(`    priceRange: ${jsStr(priceRangeByLevel[p.priceLevel] || "Varies")},`);
  lines.push(`    whereToFind: ${jsStr(p.formattedAddress || `Barangay ${barangay}, Norzagaray, Bulacan`)},`);
  const hours = openHoursText(p);
  if (hours) lines.push(`    bestTime: ${jsStr(hours)},`);
  const tags = jsArr((p.types || []).filter((t) => !["point_of_interest", "establishment", "food"].includes(t)));
  lines.push(`    tags: ${tags ?? "[]"},`);
  lines.push(`    gradient: [${jsStr(grad[0])}, ${jsStr(grad[1])}],`);
  lines.push(`    reviews: [],`);
  lines.push(`  },`);
  return lines.join("\n");
}

// ---- run ----

const rawDest = JSON.parse(readFileSync(path.join(ROOT, "scripts", "places-raw-destinations.json"), "utf8"));
const rawFood = JSON.parse(readFileSync(path.join(ROOT, "scripts", "places-raw-food.json"), "utf8"));

const existingDestSrc = readFileSync(path.join(ROOT, "src", "data", "destinations.ts"), "utf8");
const existingFoodSrc = readFileSync(path.join(ROOT, "src", "data", "food.ts"), "utf8");
const existingDestPlaceIds = new Set([...existingDestSrc.matchAll(/placeId:\s*"([^"]+)"/g)].map((m) => m[1]));
const existingFoodPlaceIds = new Set([...existingFoodSrc.matchAll(/placeId:\s*"([^"]+)"/g)].map((m) => m[1]));
const existingDestSlugs = new Set([...existingDestSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));
const existingFoodSlugs = new Set([...existingFoodSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]));

const destNorza = rawDest.filter((p) => {
  const loc = locality(p);
  if (loc !== "Norzagaray" && !["San Lorenzo", "Baraka"].includes(loc)) return false;
  const t = p.primaryType || (p.types || [])[0] || "";
  if (DEST_EXCLUDE_TYPES.has(t)) return false;
  if (existingDestPlaceIds.has(p.id)) return false;
  return true;
});

const foodNorza = rawFood.filter((p) => {
  if (locality(p) !== "Norzagaray") return false;
  const t = p.primaryType || (p.types || [])[0] || "";
  if (!FOOD_INCLUDE_TYPES.has(t)) return false;
  if (existingFoodPlaceIds.has(p.id)) return false;
  return true;
});

console.log(`New destinations to add: ${destNorza.length}`);
console.log(`New food to add: ${foodNorza.length}`);

const destOut = destNorza.map((p, i) => destEntry(p, i, existingDestSlugs)).filter(Boolean).join("\n");
const foodOut = foodNorza.map((p, i) => foodEntry(p, i, existingFoodSlugs)).filter(Boolean).join("\n");

function spliceIn(filePath, newBlock) {
  if (!newBlock) return;
  let src = readFileSync(filePath, "utf8");
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  const normalized = newBlock.replace(/\r\n/g, "\n").split("\n").join(eol);
  const closer = new RegExp(`${eol}\\];${eol}`);
  if (!closer.test(src)) {
    console.error(`Could not find closing "];" in ${filePath}, skipping splice`);
    return;
  }
  src = src.replace(closer, `${eol}${normalized}${eol}];${eol}`);
  writeFileSync(filePath, src);
}

spliceIn(path.join(ROOT, "src", "data", "destinations.ts"), destOut);
spliceIn(path.join(ROOT, "src", "data", "food.ts"), foodOut);
console.log(`Spliced ${destNorza.length} destinations and ${foodNorza.length} food places directly into the data files.`);
