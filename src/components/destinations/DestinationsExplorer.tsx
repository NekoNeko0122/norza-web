"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { destinations as allDestinations, type Destination, type DestinationCategory } from "@/data/destinations";
import FilterBar, { type ViewMode } from "./FilterBar";
import DestinationCard from "./DestinationCard";
import DestinationListItem from "./DestinationListItem";

const DestinationMap = dynamic(() => import("./DestinationMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-tint text-sm text-brand-500">
      Loading map…
    </div>
  ),
});

export default function DestinationsExplorer() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<ViewMode>(
    searchParams.get("view") === "map" ? "map" : "list"
  );
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<DestinationCategory | "all">(
    (searchParams.get("category") as DestinationCategory) ?? "all"
  );
  const [selected, setSelected] = useState<Destination | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allDestinations.filter((d) => {
      const matchesCategory = category === "all" || d.category === category;
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.barangay.toLowerCase().includes(q) ||
        d.tags.some((t) => t.includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-6 pt-10 sm:px-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
          Explore
        </span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
          All Destinations
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Toggle between list and map view. Pins in a deeper shade with a dashed
          ring are community-registered spots not yet on Google Maps.
        </p>
      </div>

      <div className="mt-8">
        <FilterBar
          view={view}
          onViewChange={setView}
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          resultCount={filtered.length}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 sm:px-8">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-200 bg-tint/50 py-20 text-center">
            <p className="font-display text-lg font-semibold text-ink">No destinations found</p>
            <p className="mt-1 text-sm text-ink-faint">Try a different search or category.</p>
          </div>
        ) : view === "list" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
            <div className="order-2 max-h-[32rem] space-y-1.5 overflow-y-auto rounded-3xl border border-edge bg-surface p-3 lg:order-1 lg:max-h-[38rem]">
              {filtered.map((d) => (
                <DestinationListItem
                  key={d.id}
                  destination={d}
                  active={selected?.id === d.id}
                  onSelect={() => setSelected(d)}
                />
              ))}
            </div>
            <div className="isolate relative order-1 h-[26rem] lg:order-2 lg:h-[38rem]">
              <DestinationMap
                destinations={filtered}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
