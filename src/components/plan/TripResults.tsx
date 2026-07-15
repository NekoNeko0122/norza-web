"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Gauge,
  MapPin,
  Navigation,
  RotateCcw,
  Backpack,
  AlertTriangle,
  Sparkles,
  Car,
  type LucideIcon,
} from "lucide-react";
import type { TripInput, TripPlan } from "@/lib/itinerary";
import { categoryMeta } from "@/data/destinations";
import DestinationArt from "@/components/ui/DestinationArt";
import { googleMapsDirectionsUrl, wazeUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

function hoursMinutes(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

const difficultyColor: Record<string, string> = {
  easy: "text-emerald-600 bg-emerald-500/10",
  moderate: "text-amber-600 bg-amber-500/10",
  challenging: "text-red-600 bg-red-500/10",
};

export default function TripResults({
  plan,
  input,
  onStartOver,
}: {
  plan: TripPlan;
  input: TripInput;
  onStartOver: () => void;
}) {
  return (
    <div className="space-y-10">
      {/* summary */}
      <div className="rounded-3xl border border-edge bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white sm:p-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={13} /> Your Custom Itinerary
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          {input.days}-Day Norzagaray Getaway
        </h2>
        <p className="mt-2 text-white/85">
          For {input.pax} {input.pax === 1 ? "person" : "people"}, coming from {plan.originLabel} via {plan.vehicleLabel}.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryStat icon={Car} label="Travel to Norzagaray" value={`~${hoursMinutes(plan.travelToNorzagarayMinutes)}`} />
          <SummaryStat icon={MapPin} label="Stops Planned" value={`${plan.days.reduce((n, d) => n + d.stops.length, 0)}`} />
          <SummaryStat
            icon={Gauge}
            label="Overall Difficulty"
            value={plan.overallDifficulty[0].toUpperCase() + plan.overallDifficulty.slice(1)}
          />
          <SummaryStat icon={Clock} label="Days Planned" value={`${plan.days.length}`} />
        </div>
      </div>

      {/* per-day itinerary */}
      {plan.days.map((day, dayIdx) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: dayIdx * 0.05 }}
          className="rounded-3xl border border-edge bg-surface p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl font-semibold text-ink">Day {day.day}</h3>
            <span className="text-xs font-medium text-ink-faint">
              {hoursMinutes(day.totalTravelMinutes)} traveling · {day.totalActivityHours} hrs of activities
            </span>
          </div>
          {day.day === 1 && (
            <p className="mt-2 text-xs text-ink-soft">
              Suggested departure around 6:30 AM from {plan.originLabel} to arrive with the whole day ahead.
            </p>
          )}

          <div className="relative mt-6 space-y-6 border-l border-edge pl-6">
            {day.stops.map((stop, i) => {
              const rating = stop.destination.category;
              return (
                <div key={stop.destination.id} className="relative">
                  <span className="absolute -left-[29px] top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-[10px] font-bold text-white ring-4 ring-surface">
                    {i + 1}
                  </span>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <DestinationArt
                      gradient={stop.destination.gradient}
                      category={stop.destination.category}
                      images={stop.destination.images}
                      className="h-24 w-full shrink-0 rounded-2xl sm:w-32"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-tint px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:text-brand-300">
                          {categoryMeta[rating].label}
                        </span>
                        {stop.destination.difficulty && (
                          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize", difficultyColor[stop.destination.difficulty])}>
                            {stop.destination.difficulty}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/destinations/${stop.destination.slug}`}
                        className="mt-1.5 block font-display text-lg font-semibold text-ink hover:text-brand-600"
                      >
                        {stop.destination.name}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{stop.destination.shortDescription}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-faint">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {stop.arrival} – {stop.departure}
                        </span>
                        {i > 0 && (
                          <span className="flex items-center gap-1">
                            <Navigation size={12} /> {hoursMinutes(stop.travelMinutesFromPrevious)} from previous stop
                          </span>
                        )}
                        {stop.destination.entranceFee && <span>💵 {stop.destination.entranceFee}</span>}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={googleMapsDirectionsUrl(stop.destination.coordinates.lat, stop.destination.coordinates.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-edge px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand-300 hover:text-brand-600"
                        >
                          <Navigation size={12} /> Google Maps
                        </a>
                        <a
                          href={wazeUrl(stop.destination.coordinates.lat, stop.destination.coordinates.lng)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-edge px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand-300 hover:text-brand-600"
                        >
                          <Navigation size={12} /> Waze
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* bonus suggestions */}
      {plan.bonusSuggestions.length > 0 && (
        <div className="rounded-3xl border border-dashed border-brand-200 bg-tint/40 p-6 sm:p-8">
          <h3 className="font-display text-lg font-semibold text-ink">If You Have More Time</h3>
          <p className="mt-1 text-sm text-ink-soft">These also matched what you&apos;re looking for, but didn&apos;t fit your schedule.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {plan.bonusSuggestions.map((d) => (
              <Link
                key={d.id}
                href={`/destinations/${d.slug}`}
                className="rounded-full border border-edge bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-600"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* packing & reminders */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-edge bg-surface p-6 sm:p-8">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <Backpack size={18} className="text-brand-500" /> What to Bring
          </h3>
          <ul className="mt-4 space-y-2.5">
            {plan.packingList.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-edge bg-surface p-6 sm:p-8">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <AlertTriangle size={18} className="text-brand-500" /> Good to Remember
          </h3>
          <ul className="mt-4 space-y-2.5">
            {plan.reminders.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={onStartOver}
          className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface px-6 py-3 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-600"
        >
          <RotateCcw size={15} /> Plan Another Trip
        </button>
        <Link
          href="/destinations?view=map"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white"
        >
          Open the Full Map
        </Link>
      </div>
    </div>
  );
}

function SummaryStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3.5">
      <Icon size={16} className="text-white/80" />
      <p className="mt-1.5 font-display text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-white/70">{label}</p>
    </div>
  );
}
