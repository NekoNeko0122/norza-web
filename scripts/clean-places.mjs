// Removes low-quality auto-generated entries from destinations.ts / food.ts:
// no photo, too few Google reviews, national/international chains, or
// generic non-places (barangay names used as a business name, personal
// profiles, roads/highways/rotundas). Hand-researched entries are always
// left alone — they're identified by NOT having the auto-generated
// description marker. Re-run any time after npm run sync:places.
//
// Usage: node scripts/clean-places.mjs

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const MIN_REVIEWS = 5;
const AUTO_MARKER = "Full details sourced from Google Maps";

const OFFICIAL_BARANGAYS = [
  "bangkal",
  "baraka",
  "bigte",
  "bitungol",
  "friendship village resources",
  "matictic",
  "minuyan",
  "partida",
  "pinagtulayan",
  "poblacion",
  "san lorenzo",
  "san mateo",
  "tigbe",
  "norzagaray",
];

const CHAIN_PATTERN =
  /jollibee|mang inasal|goldilocks|mcdo(nald)?'?s?|\bkfc\b|chowking|greenwich|red ribbon|shakey'?s|pizza hut|dunkin|starbucks|7-?eleven|potato corner|minute burger|army navy|zark'?s|julie'?s bakeshop|max'?s restaurant|bench\b|generika|mercury drug|watsons|foodpanda|grab\b/i;

const INFRA_PATTERN =
  /\b(highway|rotunda|overpass|underpass|intersection|junction|flyover|terminal|tricycle|jeepney|parking)\b/i;

// cemeteries/memorial parks aren't tourist destinations even when Google
// files them under "park" — "memorial park" is the standard PH euphemism
const CEMETERY_PATTERN = /memorial park|cemetery|funeral/i;

// names with zero distinguishing information ("Park", "Hilltop") — real
// places, just not presentable without more specific naming
const BARE_GENERIC_NAMES = new Set(["park", "hilltop", "view deck", "viewpoint", "resort", "farm"]);

function isGenericName(name) {
  const n = name.trim().toLowerCase();
  return OFFICIAL_BARANGAYS.includes(n) || BARE_GENERIC_NAMES.has(n);
}

function shouldDrop(block) {
  if (!block.includes(AUTO_MARKER)) return false; // never touch hand-curated entries

  const name = block.match(/name: "([^"]+)"/)?.[1] ?? "";
  const hasPhoto = block.includes("photoName:");
  const reviewCount = parseInt(block.match(/googleReviewCount: (\d+)/)?.[1] ?? "0", 10);
  const tags = block.match(/tags: \[([^\]]*)\]/)?.[1] ?? "";

  if (!hasPhoto) return true;
  if (reviewCount < MIN_REVIEWS) return true;
  if (CHAIN_PATTERN.test(name)) return true;
  if (INFRA_PATTERN.test(name)) return true;
  if (CEMETERY_PATTERN.test(name)) return true;
  if (/cemetery|funeral_home/.test(tags)) return true;
  if (isGenericName(name)) return true;

  return false;
}

function clean(filePath) {
  let src = readFileSync(filePath, "utf8");
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  const norm = src.replace(/\r\n/g, "\n");

  // isolate the trailing "];\n\nexport function..." footer BEFORE splitting
  // entries, so it's never accidentally dropped along with the last entry
  const closerMatch = norm.match(/\n\];\n[\s\S]*$/);
  if (!closerMatch) {
    console.error(`Could not find array closer in ${filePath}, skipping`);
    return;
  }
  const footer = closerMatch[0]; // "\n];\n\nexport function ..."
  const body = norm.slice(0, closerMatch.index);

  const blocks = body.split(/\n(?=  \{\n    id: )/);
  const header = blocks[0]; // everything before the first entry (imports, interfaces, array opener)
  const entries = blocks.slice(1);

  let kept = 0;
  let dropped = 0;
  const keptEntries = entries.filter((b) => {
    if (shouldDrop(b)) {
      dropped++;
      return false;
    }
    kept++;
    return true;
  });

  const rebuilt = ([header, ...keptEntries].join("\n") + footer).replace(/\n/g, eol);
  writeFileSync(filePath, rebuilt);
  console.log(`${path.basename(filePath)}: kept ${kept}, dropped ${dropped}`);
}

clean(path.join(ROOT, "src", "data", "destinations.ts"));
clean(path.join(ROOT, "src", "data", "food.ts"));
