"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TEAM_MEMBERS } from "@/data/team";
import CartoonAvatar from "@/components/ui/CartoonAvatar";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function ProponentsSection() {
  return (
    <section id="proponents" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-6 inline-flex flex-col items-center gap-4 rounded-3xl border border-edge bg-surface/70 px-6 py-5 shadow-sm backdrop-blur sm:hidden">
          <div className="flex items-center gap-5">
            <Image
              src="/logos/bcp-logo.png"
              alt="Bestlink College of the Philippines"
              width={367}
              height={367}
              className="h-14 w-14 shrink-0 object-contain"
            />
            <div className="h-10 w-px bg-edge" />
            <Image
              src="/logos/research-logo.png"
              alt="BCP Center for Research and Development"
              width={170}
              height={161}
              className="h-14 w-auto shrink-0 object-contain"
            />
          </div>
          <span className="max-w-xs text-center text-xs font-semibold uppercase tracking-wider text-brand-500">
            A Capstone Project by Bestlink College of the Philippines – Bulacan
          </span>
        </div>

        <div className="mb-6 hidden items-center justify-center gap-5 rounded-full border border-edge bg-surface/70 px-8 py-4 shadow-sm backdrop-blur sm:inline-flex">
          <Image
            src="/logos/bcp-logo.png"
            alt="Bestlink College of the Philippines"
            width={367}
            height={367}
            className="h-16 w-16 shrink-0 object-contain md:h-20 md:w-20"
          />
          <span className="max-w-xs text-xs font-semibold uppercase tracking-wider text-brand-500 md:max-w-sm">
            A Capstone Project by Bestlink College of the Philippines – Bulacan
          </span>
          <Image
            src="/logos/research-logo.png"
            alt="BCP Center for Research and Development"
            width={170}
            height={161}
            className="h-16 w-auto shrink-0 object-contain md:h-20"
          />
        </div>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          The Proponents
        </h2>
        <p className="mt-3 text-ink-soft">
          Built by a team dedicated to putting Norzagaray on the map.
        </p>
      </motion.div>

      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto mt-10 max-w-2xl divide-y divide-edge overflow-hidden rounded-3xl border border-edge bg-surface shadow-sm"
      >
        {TEAM_MEMBERS.map((member) => (
          <motion.li
            key={member.slug}
            variants={item}
            className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-tint/40 sm:px-6"
          >
            <CartoonAvatar slug={member.slug} name={member.name} size={52} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{member.name}</p>
              <p className="truncate text-xs text-ink-faint">{member.role}</p>
            </div>
            <Link
              href={`/team/${member.slug}`}
              aria-label={`View ${member.name}'s profile`}
              className="group grid h-10 w-10 shrink-0 place-items-center rounded-full border border-edge text-ink-soft transition-colors hover:border-brand-300 hover:bg-tint hover:text-brand-600"
            >
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
