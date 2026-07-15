"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { TEAM_MEMBERS } from "@/data/team";
import CartoonAvatar from "@/components/ui/CartoonAvatar";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 280, damping: 24 } },
};

export default function TeamIndexContent() {
  return (
    <div className="pb-24">
      <section className="bg-grain relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--color-tint)_0%,_var(--background)_55%,_var(--background)_100%)] px-6 py-20 sm:px-8">
        <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 animate-blob rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-600/20" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 animate-blob rounded-full bg-gold-400/30 blur-3xl [animation-delay:4s] dark:bg-gold-500/15" />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 backdrop-blur"
          >
            <Sparkles size={13} /> Behind the Project
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-semibold text-ink sm:text-6xl"
          >
            Meet the <span className="text-gradient-brand italic">Team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            The proponents who researched, designed, and built Discover Norzagaray as a Bestlink College of the Philippines capstone project.
          </motion.p>
        </div>
      </section>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto mt-4 grid max-w-4xl gap-5 px-6 sm:grid-cols-2 sm:px-8"
      >
        {TEAM_MEMBERS.map((member) => (
          <motion.div key={member.slug} variants={item}>
            <Link
              href={`/team/${member.slug}`}
              className="group flex items-center gap-4 rounded-3xl border border-edge bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
            >
              <CartoonAvatar slug={member.slug} name={member.name} size={64} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-semibold text-ink">{member.name}</p>
                <p className="truncate text-sm text-brand-600 dark:text-brand-300">{member.role}</p>
              </div>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
