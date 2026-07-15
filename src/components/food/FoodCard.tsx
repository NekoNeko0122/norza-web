"use client";

import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { FoodItem } from "@/data/food";
import { foodCategoryMeta } from "@/data/food";
import FoodArt from "@/components/ui/FoodArt";
import RatingStars from "@/components/ui/RatingStars";

export default function FoodCard({ food }: { food: FoodItem }) {
  const rating = food.googleRating ?? 0;
  const reviewCount = food.googleReviewCount ?? 0;
  const images = food.photoName
    ? [`/api/place-photo?name=${encodeURIComponent(food.photoName)}&w=800`]
    : food.images;

  return (
    <Link
      href={`/food/${food.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-edge bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-500/15"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <FoodArt
          gradient={food.gradient}
          category={food.category}
          images={images}
          className="h-full w-full transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
          {foodCategoryMeta[food.category].label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            {food.name}
          </h3>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-brand-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {food.shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-ink-soft">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-brand-500" />
            {food.barangay}
          </span>
          {rating > 0 ? (
            <span className="flex items-center gap-1.5">
              <RatingStars rating={rating} size={12} />
              <span className="font-medium text-ink">{rating}</span>
              {reviewCount > 0 && <span className="text-ink-faint">({reviewCount})</span>}
            </span>
          ) : (
            <span className="italic text-ink-faint">No reviews yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}
