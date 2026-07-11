"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryMeta, type DestinationCategory } from "@/data/destinations";
import ViewToggle, { type ViewMode } from "@/components/ui/ViewToggle";

export type { ViewMode };

export default function FilterBar({
  view,
  onViewChange,
  query,
  onQueryChange,
  category,
  onCategoryChange,
  resultCount,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  query: string;
  onQueryChange: (q: string) => void;
  category: DestinationCategory | "all";
  onCategoryChange: (c: DestinationCategory | "all") => void;
  resultCount: number;
}) {
  const categories: (DestinationCategory | "all")[] = ["all", ...(Object.keys(categoryMeta) as DestinationCategory[])];

  return (
    <div className="sticky top-[73px] z-30 -mx-6 border-b border-edge bg-surface/85 px-6 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-full border border-edge bg-tint/50 px-4 py-2.5 sm:max-w-sm sm:flex-1">
            <Search size={16} className="shrink-0 text-brand-400" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search destinations..."
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
              {resultCount} spot{resultCount !== 1 ? "s" : ""}
            </span>
            <ViewToggle view={view} onChange={onViewChange} />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                category === c
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-edge bg-surface text-ink-soft hover:border-brand-300"
              )}
            >
              {c === "all" ? "All" : categoryMeta[c].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
