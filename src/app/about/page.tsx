import type { Metadata } from "next";
import Link from "next/link";
import { Mountain, Landmark, Trees, ArrowRight, type LucideIcon } from "lucide-react";
import { destinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: "About Norzagaray | Discover Norzagaray",
  description: "Get to know Norzagaray, Bulacan — its geography, history, and why it's worth visiting.",
};

export default function AboutPage() {
  return (
    <div className="pb-24">
      <section className="bg-grain relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--color-tint)_0%,_var(--background)_50%,_var(--background)_100%)] px-6 py-24 sm:px-8">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 animate-blob rounded-full bg-brand-200/50 blur-3xl dark:bg-brand-600/20" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 backdrop-blur">
            About the Town
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold text-ink sm:text-6xl">
            Welcome to <span className="text-gradient-brand italic">Norzagaray</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            A first-class municipality in Bulacan, Central Luzon — where the
            plains meet the Sierra Madre foothills. Roughly an hour from
            Metro Manila, Norzagaray is home to caves once used by
            revolutionaries, rivers that rival tropical getaways, and
            viewpoints overlooking two major dams.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <InfoCard
            icon={Mountain}
            title="Geography"
            body="Norzagaray sits at the edge of the Sierra Madre range, giving it a mix of flatland barangays and mountainous terrain toward Ipo and Angat dams."
          />
          <InfoCard
            icon={Landmark}
            title="History"
            body="The town played a role in the Philippine Revolution — Pinagrealan Cave sheltered Andres Bonifacio and the Katipuneros during the uprising against Spain."
          />
          <InfoCard
            icon={Trees}
            title="Nature"
            body="Home to rivers, waterfalls, and forest trails that have earned nicknames like 'Little El Nido' for their crystal-clear water."
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8 sm:px-8">
        <div className="rounded-3xl border border-edge bg-surface p-8 sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Getting to Norzagaray</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            By private vehicle, Norzagaray is roughly an hour's drive from
            Metro Manila via NLEX (San Jose del Monte exit) or through
            Bocaue/Sta. Maria. Public commuters can take a bus or van to San
            Jose del Monte or Bocaue, then transfer to a Norzagaray-bound
            jeepney or UV Express. Many nature spots — rivers, falls, and
            view decks — are easiest to reach with a private vehicle or
            habal-habal (motorcycle-for-hire) from the town proper.
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">
            This guide currently features {destinations.length} destinations
            and keeps growing as more spots around town get mapped and
            documented — including hidden gems not yet listed on Google Maps.
          </p>
          <Link
            href="/destinations"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Explore All Destinations <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-edge bg-surface p-6">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
        <Icon size={20} />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
