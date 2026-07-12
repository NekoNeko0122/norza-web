"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mountain, Landmark, Trees, ArrowRight, Car, Bus, Compass, ChevronDown } from "lucide-react";
import { destinations } from "@/data/destinations";
import DestinationArt from "@/components/ui/DestinationArt";
import Timeline from "./Timeline";
import AnimatedCounter from "./AnimatedCounter";

const FEATURES = [
  {
    category: "viewpoint" as const,
    gradient: ["#a855f7", "#6366f1"] as [string, string],
    icon: Mountain,
    title: "Geography",
    body: "Norzagaray sits at the edge of the Sierra Madre range, giving it a mix of flatland barangays and mountainous terrain toward Ipo and Angat dams.",
  },
  {
    category: "heritage" as const,
    gradient: ["#f472b6", "#a855f7"] as [string, string],
    icon: Landmark,
    title: "History",
    body: "The town played a role in the Philippine Revolution — Pinagrealan Cave sheltered Andres Bonifacio and the Katipuneros during the uprising against Spain.",
  },
  {
    category: "nature" as const,
    gradient: ["#22d3ee", "#f472b6"] as [string, string],
    icon: Trees,
    title: "Nature",
    body: "Home to rivers, waterfalls, and forest trails that have earned nicknames like \"Little El Nido\" for their crystal-clear water.",
  },
];

const ROUTES = [
  {
    icon: Car,
    title: "By Private Vehicle",
    body: "~1 hour from Metro Manila via NLEX (San Jose del Monte exit) or through Bocaue/Sta. Maria.",
  },
  {
    icon: Bus,
    title: "By Public Transport",
    body: "Bus or van to San Jose del Monte or Bocaue, then transfer to a Norzagaray-bound jeepney or UV Express.",
  },
  {
    icon: Compass,
    title: "Getting Around",
    body: "Many nature spots are easiest reached by private vehicle or habal-habal (motorcycle-for-hire) from the town proper.",
  },
];

const barangayCount = new Set(destinations.map((d) => d.barangay)).size;

export default function AboutContent() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="bg-grain relative flex min-h-[70vh] items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--color-tint)_0%,_var(--background)_55%,_var(--background)_100%)]">
        <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 animate-blob rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-600/20" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 animate-blob rounded-full bg-gold-400/30 blur-3xl [animation-delay:4s] dark:bg-gold-500/15" />

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:px-8">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 backdrop-blur"
          >
            About the Town
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-ink sm:text-7xl"
          >
            Welcome to <span className="text-gradient-brand italic">Norzagaray</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft"
          >
            A first-class municipality in Bulacan, Central Luzon — where the
            plains meet the Sierra Madre foothills. Roughly an hour from
            Metro Manila, Norzagaray is home to caves once used by
            revolutionaries, rivers that rival tropical getaways, and
            viewpoints overlooking two major dams.
          </motion.p>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-faint"
        >
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto -mt-10 max-w-4xl px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4 rounded-3xl border border-edge bg-surface p-6 shadow-lg shadow-brand-900/5 sm:grid-cols-4"
        >
          {[
            { value: 1787, suffix: "", label: "Founded" },
            { value: 60, prefix: "~", suffix: " min", label: "From Manila" },
            { value: barangayCount, suffix: "+", label: "Barangays Mapped" },
            { value: destinations.length, suffix: "+", label: "Destinations" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-semibold text-gradient-brand sm:text-3xl">
                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint sm:text-xs">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Story timeline */}
      <section className="mx-auto max-w-5xl px-6 py-24 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
            How We Got Here
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            The Story of Norzagaray
          </h2>
        </motion.div>
        <Timeline />
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-5xl px-6 py-8 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-3xl border border-edge bg-surface shadow-sm transition-shadow hover:shadow-xl hover:shadow-brand-500/10"
            >
              <DestinationArt
                gradient={f.gradient}
                category={f.category}
                className="h-28 w-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Getting there */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-edge bg-surface p-8 sm:p-10"
        >
          <h2 className="font-display text-2xl font-semibold text-ink">Getting to Norzagaray</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {ROUTES.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                  <r.icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{r.body}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-ink-soft">
            This guide currently features {destinations.length} destinations
            and keeps growing as more spots around town get mapped and
            documented — including hidden gems not yet listed on Google Maps.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/plan-your-trip"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Plan Your Trip <ArrowRight size={16} />
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 rounded-full border border-edge bg-tint/40 px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
            >
              Explore All Destinations
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
