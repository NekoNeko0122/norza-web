// Backfills photoName / googleRating / googleReviewCount onto every
// destination/food entry that has a placeId, so list-page cards can show a
// real Google photo + rating without a live fetch per card. Reuses the
// places-raw-*.json cache from sync-places.mjs when available, otherwise
// fetches Place Details directly. Re-run any time.
//
// Usage: node scripts/backfill-photos.mjs

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const apiKey = readFileSync(path.join(ROOT, ".env.local"), "utf8").match(/GOOGLE_PLACES_API_KEY=(.+)/)?.[1]?.trim();
if (!apiKey) {
  console.error("No GOOGLE_PLACES_API_KEY in .env.local");
  process.exit(1);
}

function loadRawCache(file) {
  const p = path.join(ROOT, "scripts", file);
  if (!existsSync(p)) return new Map();
  const arr = JSON.parse(readFileSync(p, "utf8"));
  return new Map(arr.map((x) => [x.id, x]));
}

async function fetchDetails(placeId) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "id,rating,userRatingCount,photos",
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function backfill(filePath, cacheFile) {
  const cache = loadRawCache(cacheFile);
  let src = readFileSync(filePath, "utf8");
  const eol = src.includes("\r\n") ? "\r\n" : "\n";

  const placeIds = [...src.matchAll(/placeId: "([^"]+)"/g)].map((m) => m[1]);
  console.log(`\n${path.basename(filePath)}: ${placeIds.length} entries with a placeId`);

  let updated = 0;
  for (const placeId of placeIds) {
    // skip if already backfilled (photoName/googleRating already present right after this placeId)
    const alreadyDone = new RegExp(`placeId: "${placeId}"[^\\n]*${eol}[^\\n]*photoName:`).test(src);
    if (alreadyDone) continue;

    let data = cache.get(placeId);
    if (!data) {
      data = await fetchDetails(placeId);
      await sleep(90);
    }
    if (!data) continue;

    const photo = data.photos?.[0]?.name;
    const parts = [];
    if (photo) parts.push(`photoName: "${photo}",`);
    if (typeof data.rating === "number") parts.push(`googleRating: ${data.rating},`);
    if (typeof data.userRatingCount === "number") parts.push(`googleReviewCount: ${data.userRatingCount},`);
    if (parts.length === 0) continue;

    const insertion = parts.map((p) => `    ${p}`).join(eol);
    const needle = `placeId: "${placeId}",`;
    src = src.replace(needle, `${needle}${eol}${insertion}`);
    updated++;
    process.stdout.write(`\r  backfilled ${updated}/${placeIds.length}   `);
  }
  console.log("");
  writeFileSync(filePath, src);
  console.log(`  wrote ${updated} updates to ${path.basename(filePath)}`);
}

await backfill(path.join(ROOT, "src", "data", "destinations.ts"), "places-raw-destinations.json");
await backfill(path.join(ROOT, "src", "data", "food.ts"), "places-raw-food.json");
console.log("\nDone.");
