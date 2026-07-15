"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Compass } from "lucide-react";
import { foodItems, type FoodItem, type FoodCategory } from "@/data/food";
import FoodFilterBar, { type ViewMode } from "./FoodFilterBar";
import FoodCard from "./FoodCard";
import FoodListItem from "./FoodListItem";
import Pagination from "@/components/ui/Pagination";

const FoodMap = dynamic(() => import("./FoodMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-tint text-sm text-brand-500">
      Loading map…
    </div>
  ),
});

const PAGE_SIZE = 5;

export default function FoodExplorer() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<ViewMode>(searchParams.get("view") === "map" ? "map" : "list");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<FoodCategory | "all">(
    (searchParams.get("category") as FoodCategory) ?? "all"
  );
  const [beyondGuidebook, setBeyondGuidebook] = useState(false);
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foodItems.filter((f) => {
      if (beyondGuidebook) return !!f.beyondGuidebook;
      if (f.beyondGuidebook) return false;
      const matchesCategory = category === "all" || f.category === category;
      const matchesQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.barangay.toLowerCase().includes(q) ||
        f.tags.some((t) => t.includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category, beyondGuidebook]);

  useEffect(() => {
    setPage(1);
  }, [query, category, beyondGuidebook, view]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 sm:px-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
          Taste of Norzagaray
        </span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Food
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          From riverside grills to market-fresh kakanin, here's what to eat
          around Norzagaray, and where to find it. Toggle to the map to see
          exactly where each spot is.
        </p>
      </div>

      <div className="mt-8">
        <FoodFilterBar
          view={view}
          onViewChange={setView}
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          beyondGuidebook={beyondGuidebook}
          onBeyondGuidebookChange={setBeyondGuidebook}
          resultCount={filtered.length}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 sm:px-8">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-200 bg-tint/50 py-20 text-center">
            {beyondGuidebook ? (
              <>
                <Compass size={28} className="mx-auto text-brand-400" />
                <p className="mt-3 font-display text-lg font-semibold text-ink">
                  Beyond the Guidebooks is just getting started
                </p>
                <p className="mt-1 text-sm text-ink-faint">
                  We're out scouting uncharted food spots around Norzagaray to add here. Check back soon.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-lg font-semibold text-ink">No food found</p>
                <p className="mt-1 text-sm text-ink-faint">Try a different search or category.</p>
              </>
            )}
          </div>
        ) : view === "list" ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((f) => (
                <FoodCard key={f.id} food={f} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
            <div className="order-2 max-h-[32rem] space-y-1.5 overflow-y-auto rounded-3xl border border-edge bg-surface p-3 lg:order-1 lg:max-h-[38rem]">
              {filtered.map((f) => (
                <FoodListItem
                  key={f.id}
                  food={f}
                  active={selected?.id === f.id}
                  onSelect={() => f.coordinates && setSelected(f)}
                />
              ))}
            </div>
            <div className="isolate relative order-1 h-[26rem] lg:order-2 lg:h-[38rem]">
              <FoodMap items={filtered} selected={selected} onSelect={setSelected} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
