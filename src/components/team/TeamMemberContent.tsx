"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, GraduationCap, Sparkles, BadgeCheck } from "lucide-react";
import type { TeamMember } from "@/data/team";
import CartoonAvatar from "@/components/ui/CartoonAvatar";

export default function TeamMemberContent({
  member,
  prev,
  next,
}: {
  member: TeamMember;
  prev: TeamMember;
  next: TeamMember;
}) {
  return (
    <div className="pb-24">
      <section className="bg-grain relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--color-tint)_0%,_var(--background)_55%,_var(--background)_100%)] px-6 py-20 sm:px-8">
        <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 animate-blob rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-600/20" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 animate-blob rounded-full bg-gold-400/30 blur-3xl [animation-delay:4s] dark:bg-gold-500/15" />

        <div className="relative mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/team"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-brand-600"
            >
              <ArrowLeft size={15} /> Meet the Team
            </Link>
          </motion.div>

          <div className="mt-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-3 -z-10 rounded-full bg-gradient-to-br from-brand-400/30 to-gold-400/20 blur-2xl" />
              <CartoonAvatar slug={member.slug} name={member.name} size={168} />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-edge bg-surface/70 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 backdrop-blur"
            >
              <Sparkles size={12} /> Proponent
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="mt-4 font-display text-4xl font-semibold text-ink sm:text-5xl"
            >
              {member.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.48 }}
              className="mt-2 text-lg font-medium text-gradient-brand"
            >
              {member.role}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="mt-1 flex items-center gap-1.5 text-sm text-ink-faint"
            >
              <GraduationCap size={14} /> {member.program}
            </motion.p>
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mt-10 max-w-2xl px-6 sm:px-8"
      >
        <div className="rounded-3xl border border-edge bg-surface p-6 shadow-xl shadow-brand-900/5 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-ink">About</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">{member.bio}</p>

          <h2 className="mt-6 font-display text-lg font-semibold text-ink">Credentials</h2>
          <ul className="mt-3 space-y-2.5">
            {member.credentials.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <BadgeCheck size={16} className="mt-0.5 shrink-0 text-brand-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-10 flex max-w-2xl items-stretch justify-between gap-3 px-6 sm:px-8"
      >
        <Link
          href={`/team/${prev.slug}`}
          className="group flex flex-1 items-center gap-3 rounded-2xl border border-edge bg-surface px-4 py-3 transition-colors hover:border-brand-300"
        >
          <ArrowLeft size={16} className="shrink-0 text-ink-faint transition-transform group-hover:-translate-x-0.5" />
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-ink-faint">Previous</p>
            <p className="truncate text-sm font-medium text-ink">{prev.name}</p>
          </div>
        </Link>
        <Link
          href={`/team/${next.slug}`}
          className="group flex flex-1 items-center justify-end gap-3 rounded-2xl border border-edge bg-surface px-4 py-3 text-right transition-colors hover:border-brand-300"
        >
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-ink-faint">Next</p>
            <p className="truncate text-sm font-medium text-ink">{next.name}</p>
          </div>
          <ArrowRight size={16} className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </div>
  );
}
