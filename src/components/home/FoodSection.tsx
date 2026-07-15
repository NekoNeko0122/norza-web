import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedFoodItems } from "@/data/food";
import FoodCard from "@/components/food/FoodCard";

export default function FoodSection() {
  const featured = getFeaturedFoodItems().slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
            Taste of Norzagaray
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            What to Eat Around Town
          </h2>
        </div>
        <Link
          href="/food"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
        >
          See all food
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((f) => (
          <FoodCard key={f.id} food={f} />
        ))}
      </div>
    </section>
  );
}
