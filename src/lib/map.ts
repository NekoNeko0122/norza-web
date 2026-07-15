import { NORZAGARAY_BOUNDARY } from "@/data/norzagaray-boundary";

// near the town proper, not the polygon centroid (that's pulled east by the
// mostly-empty Sierra Madre watershed part of the municipality)
export const NORZAGARAY_CENTER: [number, number] = [14.8985, 121.0895];

const lats = NORZAGARAY_BOUNDARY.map((p) => p[0]);
const lngs = NORZAGARAY_BOUNDARY.map((p) => p[1]);
const PAD = 0.01;

export const NORZAGARAY_BOUNDS: [[number, number], [number, number]] = [
  [Math.min(...lats) - PAD, Math.min(...lngs) - PAD],
  [Math.max(...lats) + PAD, Math.max(...lngs) + PAD],
];

// huge outer ring + the boundary as a hole = mask covering everything outside town
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
