"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about", label: "About Norzagaray" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-[1500] transition-all duration-300",
        scrolled ? "glass-panel shadow-[0_8px_30px_rgba(176,19,94,0.08)]" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/30 transition-transform group-hover:scale-105">
            <MapPinned size={18} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Norzagaray<span className="text-brand-500">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-edge bg-surface/70 p-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm"
                    : "text-ink-soft hover:bg-tint hover:text-brand-600"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/destinations"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-105"
          >
            Plan Your Trip
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-edge bg-surface/80 text-ink"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-panel border-t border-edge px-5 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium",
                  pathname === link.href
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white"
                    : "text-ink-soft hover:bg-tint"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/destinations"
              className="mt-2 rounded-xl bg-ink px-4 py-3 text-center text-sm font-semibold text-background"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
