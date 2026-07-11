import { destinations } from "@/data/destinations";

const stats = [
  { label: "Listed Destinations", value: `${destinations.length}+` },
  { label: "Rivers & Waterfalls", value: `${destinations.filter((d) => d.category === "nature").length}` },
  { label: "Minutes from Manila", value: "~60" },
  { label: "Barangays Covered", value: `${new Set(destinations.map((d) => d.barangay)).size}` },
];

export default function StatsStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 sm:px-8">
      <div className="grid grid-cols-2 gap-4 rounded-3xl border border-edge bg-surface p-6 shadow-sm sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-semibold text-gradient-brand">{s.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-faint">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
