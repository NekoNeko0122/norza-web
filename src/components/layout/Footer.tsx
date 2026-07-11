import Link from "next/link";
import { MapPinned, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-plum-950 text-white/80">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white">
                <MapPinned size={18} />
              </span>
              <span className="font-display text-lg font-semibold text-white">
                Norzagaray<span className="text-brand-400">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              A modern guide to the caves, rivers, waterfalls, and heritage
              spots of Norzagaray, Bulacan — built to grow as we discover more
              of this town together.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs font-bold transition-colors hover:bg-brand-500"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xs font-bold transition-colors hover:bg-brand-500"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-brand-500"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/50">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/destinations" className="hover:text-brand-300">All Destinations</Link></li>
              <li><Link href="/destinations?view=map" className="hover:text-brand-300">Interactive Map</Link></li>
              <li><Link href="/about" className="hover:text-brand-300">About Norzagaray</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/50">
              Local Tourism Office
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>Municipal Tourism Office</li>
              <li>Poblacion, Norzagaray, Bulacan</li>
              <li>(044) 791-6604</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Discover Norzagaray. Built with love for the town.</p>
          <p>Spot info evolving — help us keep it accurate.</p>
        </div>
      </div>
    </footer>
  );
}
