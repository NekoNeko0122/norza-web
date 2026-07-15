"use client";

import Link from "next/link";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FoodItem } from "@/data/food";
import { foodCategoryMeta } from "@/data/food";

export default function FoodListItem({
  food,
  active,
  onSelect,
}: {
  food: FoodItem;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={!food.coordinates}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors",
        active ? "border-brand-400 bg-tint" : "border-transparent hover:bg-tint/60",
        !food.coordinates && "cursor-default opacity-60"
      )}
    >
      <span
        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
        style={{ background: `linear-gradient(135deg, ${food.gradient[0]}, ${food.gradient[1]})` }}
      >
        <Utensils size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate font-display text-sm font-semibold text-ink">{food.name}</span>
        </span>
        <span className="mt-0.5 block text-xs text-ink-faint">
          {foodCategoryMeta[food.category].label} · {food.barangay}
          {!food.coordinates && " · not mapped"}
        </span>
        <Link
          href={`/food/${food.slug}`}
          className="mt-1 inline-block text-[11px] font-semibold text-brand-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          View details →
        </Link>
      </span>
    </button>
  );
}
