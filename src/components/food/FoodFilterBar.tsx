"use client";

import { Search, X, Compass } from "lucide-react";
import { foodCategoryMeta, type FoodCategory } from "@/data/food";
import { cn } from "@/lib/utils";
import ViewToggle, { type ViewMode } from "@/components/ui/ViewToggle";

export type { ViewMode };

export default function FoodFilterBar({
  view,
  onViewChange,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  beyondGuidebook,
  onBeyondGuidebookChange,
  resultCount,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  query: string;
  onQueryChange: (q: string) => void;
  category: FoodCategory | "all";
  onCategoryChange: (c: FoodCategory | "all") => void;
  beyondGuidebook: boolean;
  onBeyondGuidebookChange: (v: boolean) => void;
  resultCount: number;
}) {
  const categories: (FoodCategory | "all")[] = ["all", ...(Object.keys(foodCategoryMeta) as FoodCategory[])];

  return (
    <div className="sticky top-[73px] z-30 border-b border-edge bg-surface/85 px-6 py-4 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-full border border-edge bg-tint/50 px-4 py-2.5 sm:max-w-sm sm:flex-1">
            <Search size={16} className="shrink-0 text-brand-400" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search food, delicacies, dishes..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            {query && (
              <button onClick={() => onQueryChange("")} aria-label="Clear search">
                <X size={14} className="text-ink-faint hover:text-brand-500" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs font-medium text-ink-faint">
              {resultCount} item{resultCount !== 1 ? "s" : ""}
            </span>
            <ViewToggle view={view} onChange={onViewChange} />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              disabled={beyondGuidebook}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                category === c
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-edge bg-surface text-ink-soft hover:border-brand-300",
                beyondGuidebook && "pointer-events-none opacity-40"
              )}
            >
              {c === "all" ? "All" : foodCategoryMeta[c].label}
            </button>
          ))}

          <span className="mx-1 h-5 w-px shrink-0 bg-edge" />

          <button
            onClick={() => onBeyondGuidebookChange(!beyondGuidebook)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
              beyondGuidebook
                ? "border-transparent bg-gradient-to-r from-gold-500 to-brand-500 text-white shadow-sm"
                : "border-edge bg-surface text-ink-soft hover:border-brand-300"
            )}
          >
            <Compass size={13} /> Beyond the Guidebooks
          </button>
        </div>
      </div>
    </div>
  );
}
