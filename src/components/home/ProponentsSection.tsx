"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const PROPONENTS = [
  "Baby Jane Garcia",
  "Vonzell Mae Cabuguas",
  "Grace Anne Certeza",
  "Chrisdan Lyn Lirado",
  "Sherwin Rodriguez",
];

function initialsOf(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

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
    <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
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
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        {PROPONENTS.map((name) => (
          <motion.li
            key={name}
            variants={item}
            whileHover={{ y: -6, scale: 1.04 }}
            className="group flex items-center gap-3 rounded-full border border-edge bg-surface py-2.5 pl-2.5 pr-6 shadow-sm transition-colors hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
          >
            <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-sm font-semibold text-white">
              <span className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/25" />
              <span className="relative">{initialsOf(name)}</span>
            </span>
            <span className="font-medium text-ink">{name}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
