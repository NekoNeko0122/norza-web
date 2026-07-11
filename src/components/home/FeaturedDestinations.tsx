import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedDestinations } from "@/data/destinations";
import DestinationCard from "@/components/destinations/DestinationCard";

export default function FeaturedDestinations() {
  const featured = getFeaturedDestinations();

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
            Handpicked
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Featured Destinations
          </h2>
        </div>
        <Link
          href="/destinations"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
        >
          View all destinations
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((d) => (
          <DestinationCard key={d.id} destination={d} />
        ))}
      </div>
    </section>
  );
}
