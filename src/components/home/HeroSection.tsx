"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, MapPin, Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AnimatedHeading, { HERO_HEADING_DONE } from "./AnimatedHeading";

const Hero3DScene = dynamic(() => import("./Hero3DScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

const REVEAL_STAGGER = 0.12;

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function revealTransition(step: number) {
  return {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as const,
    delay: HERO_HEADING_DONE + step * REVEAL_STAGGER,
  };
}

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query ? `/destinations?q=${encodeURIComponent(query)}` : "/destinations");
  }

  return (
    <section className="bg-grain relative flex min-h-[94vh] items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--color-tint)_0%,_var(--background)_55%,_var(--background)_100%)]">
      <div className="absolute inset-0">
        <Hero3DScene />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center sm:px-8">
        <motion.span
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={revealTransition(0)}
          className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 backdrop-blur"
        >
          <Compass size={13} /> Bulacan&apos;s Hidden Gem
        </motion.span>

        <AnimatedHeading />

        <motion.p
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={revealTransition(1)}
          className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
        >
          Caves once walked by revolutionaries, rivers as clear as El Nido,
          and mountain viewpoints just an hour from Manila. Explore
          Norzagaray, Bulacan&apos;s tourist spots on an interactive map made for
          travelers.
        </motion.p>

        <motion.form
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={revealTransition(2)}
          onSubmit={handleSearch}
          className="mt-8 flex w-full max-w-md items-center gap-2 rounded-full border border-edge bg-surface/85 p-1.5 pl-5 shadow-lg shadow-brand-500/10 backdrop-blur"
        >
          <Search size={17} className="text-brand-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search caves, falls, viewpoints..."
            className="flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Search
          </button>
        </motion.form>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={reveal}
          transition={revealTransition(3)}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-105"
          >
            Explore Destinations
          </Link>
          <Link
            href="/destinations?view=map"
            className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface/70 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition-transform hover:scale-105"
          >
            <MapPin size={16} className="text-brand-500" /> View the Map
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={reveal}
        transition={revealTransition(4)}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-float text-ink-faint"
      >
        <ChevronDown size={20} />
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
