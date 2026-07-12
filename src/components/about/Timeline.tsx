"use client";

import { motion } from "framer-motion";

const EVENTS = [
  {
    year: "1787",
    title: "The Parish is Founded",
    body: "St. Andrew the Apostle Parish is established under the Diocese of Malolos, marking the civic and spiritual heart of what would become Norzagaray.",
  },
  {
    year: "1896–1898",
    title: "A Revolutionary Hideout",
    body: "Pinagrealan Cave shelters Andres Bonifacio and the Katipuneros during the Philippine Revolution against Spanish colonial rule.",
  },
  {
    year: "20th Century",
    title: "A Farming and Dam Town",
    body: "The town grows around agriculture and the construction of the Angat and Ipo dams — key water sources for all of Metro Manila.",
  },
  {
    year: "Today",
    title: "Bulacan's Hidden Gem",
    body: "Caves, rivers, and mountain viewpoints once known only to locals are opening up to travelers looking for an escape close to Manila.",
  },
];

export default function Timeline() {
  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-brand-400 via-brand-500 to-brand-300/10" />
      <div className="space-y-10">
        {EVENTS.map((e, i) => (
          <motion.div
            key={e.year}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="relative pl-12"
          >
            <span className="absolute left-3 top-1 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-[10px] font-bold text-white ring-4 ring-background">
              {i + 1}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">{e.year}</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-ink">{e.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
