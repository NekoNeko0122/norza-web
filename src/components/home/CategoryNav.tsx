import Link from "next/link";
import { Trees, Compass, Landmark, Church, TreePine, Mountain, type LucideIcon } from "lucide-react";
import { categoryMeta, destinations, type DestinationCategory } from "@/data/destinations";

const icons: Record<DestinationCategory, LucideIcon> = {
  nature: Trees,
  adventure: Compass,
  heritage: Landmark,
  religious: Church,
  park: TreePine,
  viewpoint: Mountain,
};

export default function CategoryNav() {
  const categories = Object.entries(categoryMeta) as [DestinationCategory, (typeof categoryMeta)[DestinationCategory]][];

  return (
    <section className="mx-auto max-w-7xl px-6 sm:px-8">
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Browse by Experience
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(([key, meta]) => {
          const Icon = icons[key];
          const count = destinations.filter((d) => d.category === key).length;
          return (
            <Link
              key={key}
              href={`/destinations?category=${key}`}
              className="group flex flex-col items-center gap-3 rounded-3xl border border-edge bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-600 transition-colors group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white dark:from-brand-900 dark:to-brand-800 dark:text-brand-300">
                <Icon size={22} />
              </span>
              <span className="text-sm font-semibold text-ink">{meta.label}</span>
              <span className="text-xs text-ink-faint">{count} spot{count !== 1 ? "s" : ""}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
