import { destinations, type Destination } from "@/data/destinations";
import {
  VEHICLE_OPTIONS,
  INTEREST_OPTIONS,
  CATEGORY_VISIT_HOURS,
  BASE_PACKING_LIST,
  CONDITIONAL_PACKING,
  GENERAL_REMINDERS,
  type VehicleType,
} from "@/data/tripPlanning";
import { NORZAGARAY_CENTER } from "@/lib/map";

const NORZAGARAY_CENTER_COORD = { lat: NORZAGARAY_CENTER[0], lng: NORZAGARAY_CENTER[1] };
import { averageRating } from "@/lib/utils";

export type DifficultyTolerance = "easy" | "moderate" | "challenging";
export type Pace = "relaxed" | "packed";

export interface TripInput {
  days: number;
  pax: number;
  originLabel: string;
  originLat: number;
  originLng: number;
  /** false when the origin has no road/bridge connection to Luzon at all
   * (different island region, or Batanes) */
  originRoadConnected: boolean;
  vehicleId: VehicleType;
  interestIds: string[];
  difficulty: DifficultyTolerance;
  pace: Pace;
}

export interface ItineraryStop {
  destination: Destination;
  arrival: string;
  departure: string;
  travelMinutesFromPrevious: number;
  visitHours: number;
}

export interface ItineraryDay {
  day: number;
  stops: ItineraryStop[];
  totalTravelMinutes: number;
  totalActivityHours: number;
}

export interface TripPlan {
  originLabel: string;
  /** where the driving leg actually starts from — same as originLabel
   * unless requiresFlightOrFerry, in which case it's "Manila/Clark" */
  groundOriginLabel: string;
  vehicleLabel: string;
  /** the on-the-ground driving leg only — from Manila/Clark when
   * requiresFlightOrFerry is true, since the origin itself isn't driveable */
  travelToNorzagarayMinutes: number;
  originDistanceKm: number;
  requiresFlightOrFerry: boolean;
  longDistanceNote?: string;
  days: ItineraryDay[];
  bonusSuggestions: Destination[];
  packingList: string[];
  reminders: string[];
  overallDifficulty: DifficultyTolerance;
}

/** distance past which a straight-line haversine estimate stops being a
 * believable "drive time" (a very long multi-day Luzon trip) */
const LONG_DISTANCE_KM_THRESHOLD = 300;

// used as the effective start of the ground leg when the real origin has no
// road connection to Luzon — most flights/ferries into Luzon land near here
const MANILA_COORD = { lat: 14.5995, lng: 120.9842 };
const MANILA_LABEL = "Manila/Clark";

const DIFFICULTY_RANK: Record<DifficultyTolerance, number> = { easy: 0, moderate: 1, challenging: 2 };

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function travelMinutesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }, speedFactor: number) {
  const roadKm = haversineKm(a, b) * 1.35; // road fudge factor
  const avgSpeedKmh = 24 / speedFactor;
  return Math.round((roadKm / avgSpeedKmh) * 60 + 8); // parking buffer
}

/** longer inter-city trips are relatively more direct (highways) and faster
 * on average than the short, winding local roads travelMinutesBetween models */
function longDistanceTravelMinutes(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  speedFactor: number
) {
  const straightKm = haversineKm(a, b);
  const roadKm = straightKm * 1.25;
  const avgSpeedKmh = 45 / speedFactor;
  const minutes = Math.round((roadKm / avgSpeedKmh) * 60 + 15);
  return { minutes, km: Math.round(straightKm) };
}

function visitHoursFor(d: Destination) {
  let hours = CATEGORY_VISIT_HOURS[d.category] ?? 1.5;
  if (d.tags.includes("camping")) hours += 1;
  if (d.tags.includes("hiking")) hours += 0.5;
  return hours;
}

function formatClock(minutesOfDay: number) {
  const m = ((Math.round(minutesOfDay) % 1440) + 1440) % 1440;
  let h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${min.toString().padStart(2, "0")} ${ampm}`;
}

function scoreDestination(d: Destination, interestIds: string[]): number {
  let score = d.featured ? 1 : 0;
  score += averageRating(d.reviews) * 0.3;
  if (interestIds.length === 0) return score + 1;
  for (const id of interestIds) {
    const interest = INTEREST_OPTIONS.find((i) => i.id === id);
    if (!interest) continue;
    if (interest.matchCategories?.includes(d.category)) score += 3;
    if (interest.matchTags?.some((t) => d.tags.includes(t))) score += 2;
  }
  return score;
}

export function generateTripPlan(input: TripInput): TripPlan {
  const vehicle = VEHICLE_OPTIONS.find((v) => v.id === input.vehicleId) ?? VEHICLE_OPTIONS[0];
  const originCoord = { lat: input.originLat, lng: input.originLng };
  const requiresFlightOrFerry = !input.originRoadConnected;

  // when there's no road connection at all, the "drive time" is computed
  // for the ground leg from Manila/Clark onward, not the impossible direct
  // route — a straight-line estimate across open water isn't a real number
  const groundOriginCoord = requiresFlightOrFerry ? MANILA_COORD : originCoord;
  const groundOriginLabel = requiresFlightOrFerry ? MANILA_LABEL : input.originLabel;

  const { minutes: baseTravelMinutes, km: groundDistanceKm } = longDistanceTravelMinutes(
    groundOriginCoord,
    NORZAGARAY_CENTER_COORD,
    vehicle.speedFactor
  );
  const travelToNorzagarayMinutes = baseTravelMinutes + (vehicle.transferBufferMinutes ?? 0);
  const originDistanceKm = requiresFlightOrFerry
    ? Math.round(haversineKm(originCoord, NORZAGARAY_CENTER_COORD))
    : groundDistanceKm;

  const longDistanceNote = requiresFlightOrFerry
    ? `${input.originLabel} has no road or bridge connection to Norzagaray — you'll need to fly or take a ferry into Manila or Clark first. The travel time and suggested departure below are just for the on-the-ground leg from there.`
    : groundDistanceKm > LONG_DISTANCE_KM_THRESHOLD
      ? `${groundDistanceKm} km is a long haul by road — for a trip this far, it's usually faster to fly or bus into Manila or Clark first, then continue to Norzagaray from there. The time below assumes driving the whole way.`
      : undefined;

  const allowedDifficulty = new Set(
    (["easy", "moderate", "challenging"] as DifficultyTolerance[]).filter(
      (d) => DIFFICULTY_RANK[d] <= DIFFICULTY_RANK[input.difficulty]
    )
  );

  const candidates = destinations
    .filter((d) => !d.difficulty || allowedDifficulty.has(d.difficulty as DifficultyTolerance))
    .map((d) => ({ destination: d, score: scoreDestination(d, input.interestIds) }))
    .sort((a, b) => b.score - a.score);

  const dayBudgetHours = input.pace === "packed" ? 9 : 6;
  const remaining = [...candidates];
  const days: ItineraryDay[] = [];

  for (let dayNum = 1; dayNum <= input.days && remaining.length > 0; dayNum++) {
    const anchor = remaining.shift()!;
    const stopsRaw: { destination: Destination; travelMinutes: number }[] = [
      { destination: anchor.destination, travelMinutes: 0 },
    ];
    let usedHours = visitHoursFor(anchor.destination);
    let lastCoord = anchor.destination.coordinates;

    while (remaining.length > 0) {
      const topPool = remaining.slice(0, 6);
      let bestIdx = -1;
      let bestTravel = Infinity;
      topPool.forEach((c, idx) => {
        const t = travelMinutesBetween(lastCoord, c.destination.coordinates, vehicle.speedFactor);
        if (t < bestTravel) {
          bestTravel = t;
          bestIdx = idx;
        }
      });
      if (bestIdx === -1) break;
      const candidate = topPool[bestIdx];
      const extraHours = visitHoursFor(candidate.destination) + bestTravel / 60;
      if (usedHours + extraHours > dayBudgetHours) break;

      stopsRaw.push({ destination: candidate.destination, travelMinutes: bestTravel });
      usedHours += extraHours;
      lastCoord = candidate.destination.coordinates;
      remaining.splice(remaining.indexOf(candidate), 1);
    }

    const firstLegTravel =
      dayNum === 1
        ? travelMinutesBetween(NORZAGARAY_CENTER_COORD, stopsRaw[0].destination.coordinates, vehicle.speedFactor)
        : travelMinutesBetween(NORZAGARAY_CENTER_COORD, stopsRaw[0].destination.coordinates, vehicle.speedFactor) * 0.6;

    let clock = dayNum === 1 ? 6 * 60 + 30 + travelToNorzagarayMinutes + firstLegTravel : 7 * 60 + firstLegTravel;

    const stops: ItineraryStop[] = stopsRaw.map((s, idx) => {
      if (idx > 0) clock += s.travelMinutes;
      const arrival = formatClock(clock);
      const hours = visitHoursFor(s.destination);
      clock += hours * 60;
      const departure = formatClock(clock);
      return {
        destination: s.destination,
        arrival,
        departure,
        travelMinutesFromPrevious: idx === 0 ? firstLegTravel : s.travelMinutes,
        visitHours: hours,
      };
    });

    days.push({
      day: dayNum,
      stops,
      totalTravelMinutes: stops.reduce((sum, s) => sum + s.travelMinutesFromPrevious, 0),
      totalActivityHours: Math.round(usedHours * 10) / 10,
    });
  }

  const scheduledIds = new Set(days.flatMap((d) => d.stops.map((s) => s.destination.id)));
  const bonusSuggestions = remaining
    .filter((c) => !scheduledIds.has(c.destination.id))
    .slice(0, 3)
    .map((c) => c.destination);

  const scheduledDestinations = days.flatMap((d) => d.stops.map((s) => s.destination));
  const difficultyPresent = scheduledDestinations
    .map((d) => d.difficulty)
    .filter((d): d is DifficultyTolerance => !!d);
  const overallDifficulty: DifficultyTolerance = difficultyPresent.length
    ? difficultyPresent.reduce((max, d) => (DIFFICULTY_RANK[d] > DIFFICULTY_RANK[max] ? d : max), "easy" as DifficultyTolerance)
    : "easy";

  const activeInterestIds = new Set(input.interestIds);
  if (overallDifficulty !== "easy") activeInterestIds.add("adventure");
  const packingList = Array.from(
    new Set([
      ...BASE_PACKING_LIST,
      ...Array.from(activeInterestIds).flatMap((id) => CONDITIONAL_PACKING[id] ?? []),
    ])
  );

  return {
    originLabel: input.originLabel,
    groundOriginLabel,
    vehicleLabel: vehicle.label,
    travelToNorzagarayMinutes,
    originDistanceKm,
    requiresFlightOrFerry,
    longDistanceNote,
    days,
    bonusSuggestions,
    packingList,
    reminders: GENERAL_REMINDERS,
    overallDifficulty,
  };
}
