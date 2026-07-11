import { NORZAGARAY_BOUNDARY } from "@/data/norzagaray-boundary";

// Center kept near the town proper / destination cluster rather than the
// polygon centroid, since the municipality stretches far into the sparsely
// visited Sierra Madre watershed to the east.
export const NORZAGARAY_CENTER: [number, number] = [14.8985, 121.0895];

const lats = NORZAGARAY_BOUNDARY.map((p) => p[0]);
const lngs = NORZAGARAY_BOUNDARY.map((p) => p[1]);
const PAD = 0.01;

export const NORZAGARAY_BOUNDS: [[number, number], [number, number]] = [
  [Math.min(...lats) - PAD, Math.min(...lngs) - PAD],
  [Math.max(...lats) + PAD, Math.max(...lngs) + PAD],
];

// A huge outer ring so that, paired with the boundary as a hole, the mask
// polygon covers the entire visible world outside Norzagaray.
const WORLD_RING: [number, number][] = [
  [-85, -180],
  [-85, 180],
  [85, 180],
  [85, -180],
];

export const NORZAGARAY_MASK_RINGS: [number, number][][] = [WORLD_RING, NORZAGARAY_BOUNDARY];

export const NORZAGARAY_MIN_ZOOM = 10;
export const NORZAGARAY_MAX_ZOOM = 17;

export const TILE_URLS = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
