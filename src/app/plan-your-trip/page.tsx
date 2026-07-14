import type { Metadata } from "next";
import { Compass } from "lucide-react";
import TripPlannerWizard from "@/components/plan/TripPlannerWizard";

export const metadata: Metadata = {
  title: "Plan Your Trip | Discover Norzagaray",
  description: "Answer a few questions and get a full day-by-day Norzagaray itinerary, built around your group, timeline, and interests.",
};

export default function PlanYourTripPage() {
  return (
    <div className="pb-10">
      <section className="bg-grain relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--color-tint)_0%,_var(--background)_55%,_var(--background)_100%)] px-6 py-20 sm:px-8">
        <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 animate-blob rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-600/20" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 animate-blob rounded-full bg-gold-400/25 blur-3xl [animation-delay:4s] dark:bg-gold-500/10" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 backdrop-blur">
            <Compass size={13} /> Trip Planner
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold text-ink sm:text-6xl">
            Plan Your <span className="text-gradient-brand italic">Norzagaray</span> Getaway
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Tell us about your group, your ride, and what you're into, and
            we'll build a full itinerary with travel times, difficulty,
            directions, and what to pack.
          </p>
        </div>
      </section>

      <TripPlannerWizard />
    </div>
  );
}
