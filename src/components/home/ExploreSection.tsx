"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { destinations, type Destination } from "@/data/destinations";
import ViewToggle, { type ViewMode } from "@/components/ui/ViewToggle";
import DestinationCard from "@/components/destinations/DestinationCard";

const DestinationMap = dynamic(() => import("@/components/destinations/DestinationMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-tint text-sm text-brand-500">
      Loading map…
    </div>
  ),
});

export default function ExploreSection() {
  const [view, setView] = useState<ViewMode>("map");
  const [selected, setSelected] = useState<Destination | null>(null);

  return (
    <section className="py-16">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6 sm:px-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-500">
            <MapPin size={13} /> Explore Norzagaray
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            A living map of the town
          </h2>
          <p className="mt-2 max-w-lg text-ink-soft">
            Every destination pinned to its real spot on a map of Norzagaray
            only. Switch to list view any time.
          </p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div className="mt-8">
        {view === "map" ? (
          <div className="isolate relative h-[520px] w-full sm:h-[640px]">
            <DestinationMap destinations={destinations} selected={selected} onSelect={setSelected} />
          </div>
        ) : (
          <div className="mx-auto grid max-w-7xl gap-5 px-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
            {destinations.slice(0, 6).map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-6 text-center sm:px-8">
        <Link
          href="/destinations"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
        >
          Open the full destinations map & list
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
