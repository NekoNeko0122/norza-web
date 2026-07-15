"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wallet,
  MapPinned,
  Clock,
  CheckCircle2,
  Utensils,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { FoodItem } from "@/data/food";
import { foodCategoryMeta } from "@/data/food";
import FoodArt from "@/components/ui/FoodArt";
import RatingStars from "@/components/ui/RatingStars";
import FoodCard from "@/components/food/FoodCard";

export default function FoodDetailContent({
  food,
  related,
  heroImages,
  rating = 0,
  reviewCount = 0,
  googleReviews,
}: {
  food: FoodItem;
  related: FoodItem[];
  heroImages?: string[];
  rating?: number;
  reviewCount?: number;
  googleReviews: ReactNode;
}) {
  return (
    <div className="pb-24">
      <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
        <FoodArt gradient={food.gradient} category={food.category} images={heroImages} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/85 via-plum-950/20 to-transparent" />

        <div className="absolute inset-x-0 top-0 mx-auto flex max-w-7xl items-center px-6 pt-6 sm:px-8">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link
              href="/food"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              <ArrowLeft size={15} /> Back to Food
            </Link>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-8 sm:px-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700"
          >
            {foodCategoryMeta[food.category].label}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl"
          >
            {food.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/85"
          >
            <span className="flex items-center gap-1.5">
              <MapPinned size={15} /> Barangay {food.barangay}
            </span>
            {rating > 0 && (
              <span className="flex items-center gap-1.5">
                <RatingStars rating={rating} size={14} />
                <span className="font-semibold">{rating}</span>
                <span className="text-white/60">({reviewCount} on Google)</span>
              </span>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-4 rounded-3xl border border-edge bg-surface p-6 shadow-sm sm:grid-cols-3"
          >
            <QuickStat icon={Wallet} label="Price Range" value={food.priceRange} />
            <QuickStat icon={MapPinned} label="Where to Find" value={food.whereToFind} />
            <QuickStat icon={Clock} label="Best Time" value={food.bestTime ?? "Anytime"} />
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h2 className="font-display text-2xl font-semibold text-ink">About this food</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{food.description}</p>
          </motion.section>

          {food.mustTry && food.mustTry.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <Utensils size={17} className="text-brand-500" /> Must-Try
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {food.mustTry.map((m, i) => (
                  <motion.span
                    key={m}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="rounded-full bg-tint px-3 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300"
                  >
                    {m}
                  </motion.span>
                ))}
              </div>
            </motion.section>
          )}

          {food.goodToKnow && food.goodToKnow.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-2xl font-semibold text-ink">Good to Know</h2>
              <ul className="mt-4 space-y-2.5">
                {food.goodToKnow.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="flex items-start gap-2.5 text-sm text-ink-soft"
                  >
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-500" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            {googleReviews}
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="rounded-3xl border border-edge bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={13} /> {foodCategoryMeta[food.category].label}
            </span>
            <p className="mt-4 text-sm leading-relaxed text-white/90">
              Planning a trip? Add stops like this to your day when you build a full itinerary with our trip planner.
            </p>
            <Link
              href="/plan-your-trip"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition-transform hover:scale-105"
            >
              Plan Your Trip
            </Link>
          </div>

          <Link
            href="/food"
            className="block rounded-3xl border border-edge bg-surface p-6 text-center text-sm font-semibold text-ink transition-colors hover:border-brand-300"
          >
            Explore More Food
          </Link>
        </motion.aside>
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="font-display text-2xl font-semibold text-ink">You might also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div>
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        <Icon size={13} className="text-brand-500" /> {label}
      </span>
      <p className="mt-1.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
