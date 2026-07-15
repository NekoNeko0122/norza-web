"use client";

import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Destination } from "@/data/destinations";
import { categoryMeta } from "@/data/destinations";
import DestinationArt from "@/components/ui/DestinationArt";
import RatingStars from "@/components/ui/RatingStars";
import { averageRating } from "@/lib/utils";

export default function DestinationCard({ destination }: { destination: Destination }) {
  const rating = averageRating(destination.reviews);

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-edge bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-500/15"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <DestinationArt
          gradient={destination.gradient}
          category={destination.category}
          images={destination.images}
          className="h-full w-full transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
          {categoryMeta[destination.category].label}
        </span>
        {!destination.onGoogleMaps && (
          <span className="absolute right-3 top-3 rounded-full bg-plum-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
            Community pin
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            {destination.name}
          </h3>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-brand-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {destination.shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-ink-soft">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-brand-500" />
            {destination.barangay}
          </span>
          {rating > 0 ? (
            <span className="flex items-center gap-1.5">
              <RatingStars rating={rating} size={12} />
              <span className="font-medium text-ink">{rating}</span>
            </span>
          ) : (
            <span className="italic text-ink-faint">No reviews yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}
