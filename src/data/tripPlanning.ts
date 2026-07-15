import type { DestinationCategory } from "./destinations";

export interface OriginPoint {
  id: string;
  label: string;
  /** rough one-way drive time to Norzagaray by private car, in minutes (traffic varies) */
  baseTravelMinutes: number;
  distanceKm: number;
}

export const ORIGIN_POINTS: OriginPoint[] = [
  { id: "manila", label: "Manila / Metro Manila (South & Central)", baseTravelMinutes: 120, distanceKm: 55 },
  { id: "qc", label: "Quezon City", baseTravelMinutes: 90, distanceKm: 40 },
  { id: "caloocan-novaliches", label: "Caloocan / Novaliches", baseTravelMinutes: 60, distanceKm: 25 },
  { id: "sjdm", label: "San Jose del Monte, Bulacan", baseTravelMinutes: 30, distanceKm: 12 },
  { id: "sta-maria-bocaue", label: "Sta. Maria / Marilao / Bocaue, Bulacan", baseTravelMinutes: 45, distanceKm: 20 },
  { id: "malolos-baliwag", label: "Malolos / Baliwag, Bulacan", baseTravelMinutes: 60, distanceKm: 30 },
  { id: "other", label: "Somewhere else / Not sure", baseTravelMinutes: 90, distanceKm: 45 },
];

export type VehicleType = "private-car" | "motorcycle" | "van" | "public-transport";

export interface VehicleOption {
  id: VehicleType;
  label: string;
  note: string;
  /** multiplier on travel time estimates, 1 = baseline private car */
  speedFactor: number;
  transferBufferMinutes?: number;
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: "private-car", label: "Private Car", note: "Most flexible and comfortable for groups", speedFactor: 1 },
  { id: "motorcycle", label: "Motorcycle", note: "Great for narrow barangay roads, limited pax/cargo", speedFactor: 0.92 },
  { id: "van", label: "Van / Multicab (Group)", note: "Good for bigger groups, a bit slower on rough roads", speedFactor: 1.15 },
  { id: "public-transport", label: "Public Transport", note: "Bus/van plus jeepney or habal-habal transfers", speedFactor: 1.6, transferBufferMinutes: 30 },
];

export interface InterestOption {
  id: string;
  label: string;
  description: string;
  matchCategories?: DestinationCategory[];
  matchTags?: string[];
}

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: "nature", label: "Nature & Rivers", description: "Rivers, waterfalls, forest trails", matchCategories: ["nature"] },
  { id: "adventure", label: "Adventure & Caving", description: "Spelunking, hiking, cliff-jumping", matchCategories: ["adventure"], matchTags: ["cave", "spelunking", "cliff jumping"] },
  { id: "swimming", label: "River Swimming", description: "Cool off at clear river spots", matchTags: ["swimming"] },
  { id: "heritage", label: "Heritage & History", description: "Historic caves and revolution-era sites", matchCategories: ["heritage"] },
  { id: "religious", label: "Religious & Cultural", description: "Churches and cultural landmarks", matchCategories: ["religious"] },
  { id: "viewpoint", label: "Sightseeing & Viewpoints", description: "Scenic overlooks and photo spots", matchCategories: ["viewpoint"] },
  { id: "camping", label: "Camping & Farm Stays", description: "Overnight stays, open grounds, picnics", matchTags: ["camping", "farm", "picnic"] },
  { id: "family", label: "Family-Friendly", description: "Easy access, good for kids and elders", matchTags: ["family"] },
];

export const DIFFICULTY_LEVELS = [
  { id: "easy", label: "Easy only", description: "Relaxed, minimal walking or climbing" },
  { id: "moderate", label: "Easy + Moderate", description: "Some trekking or uneven terrain is fine" },
  { id: "challenging", label: "Bring it on", description: "Open to caving, hiking, and rough trails" },
] as const;

export const PACE_OPTIONS = [
  { id: "relaxed", label: "Relaxed", description: "1–2 stops a day, plenty of downtime" },
  { id: "packed", label: "Packed", description: "Fit in as much as reasonably possible" },
] as const;

export const CATEGORY_VISIT_HOURS: Record<DestinationCategory, number> = {
  nature: 2.5,
  adventure: 2.5,
  heritage: 1.5,
  religious: 0.75,
  park: 2,
  viewpoint: 1,
};

export const BASE_PACKING_LIST = [
  "Valid ID (some spots log visitors at the entrance)",
  "Small bills and coins, since entrance fees and vendors are usually cash-only",
  "Reusable water bottle",
  "Power bank, plus offline map screenshots or directions saved beforehand",
  "Basic first-aid kit and any personal medication",
  "Sunscreen and a hat",
  "A trash bag: pack out what you pack in",
];

export const CONDITIONAL_PACKING: Record<string, string[]> = {
  swimming: ["Swimwear and a dry bag", "Water shoes or sandals with grip", "A full change of clothes"],
  adventure: ["Closed-toe shoes with good grip", "A small flashlight or headlamp", "A light backpack"],
  camping: ["Tent or sleeping gear (or ask about on-site rentals)", "Insect repellent", "A light jacket for cool mountain nights"],
  nature: ["Insect repellent", "Quick-dry clothing"],
  religious: ["Modest clothing for church visits"],
};

export const GENERAL_REMINDERS = [
  "Mobile signal gets weak in the far mountain barangays, so screenshot directions and contact numbers beforehand.",
  "Roads to river and mountain spots can get rough or slippery after rain, so a private vehicle or habal-habal handles them better than a sedan.",
  "Coordinate with local guides or caretakers ahead of time for caving, camping, or larger group bookings.",
  "Bring exact change: entrance and environmental fees are usually small (₱10–₱60) and cash-only.",
  "Respect the environment: leave no trace, and ask permission before entering private farms or land.",
];
