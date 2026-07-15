"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/about", label: "About Norzagaray" },
  { href: "/team", label: "Meet the Team" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-[1500] transition-all duration-300",
        scrolled ? "glass-panel shadow-[0_8px_30px_rgba(176,19,94,0.08)]" : "bg-transparent"
      )}
    >
      <motion.div
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <motion.span
            initial={{ scale: 0, rotate: -35, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
            whileHover={{ rotate: -10, scale: 1.08 }}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/30"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/25 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <MapPinned size={18} />
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-display text-lg font-semibold tracking-tight text-ink"
          >
            Norzagaray<span className="text-brand-500">.</span>
          </motion.span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-edge bg-surface/70 p-1 md:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link key={link.href} href={link.href} className="relative px-1 py-1">
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 shadow-sm shadow-brand-500/30"
                  />
                )}
                <motion.span
                  whileHover={active ? undefined : { y: -1 }}
                  className={cn(
                    "relative z-10 block rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-ink-soft hover:bg-tint hover:text-brand-600"
                  )}
                >
                  {link.label}
                </motion.span>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/plan-your-trip"
              className="group relative inline-flex items-center overflow-hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-background transition-shadow hover:shadow-lg hover:shadow-brand-500/20"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 opacity-0 transition-all duration-500 group-hover:opacity-100" />
              Plan Your Trip
            </Link>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-edge bg-surface/80 text-ink"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="grid place-items-center"
                >
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                  className="grid place-items-center"
                >
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel overflow-hidden border-t border-edge md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm font-medium",
                      isActive(pathname, link.href)
                        ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white"
                        : "text-ink-soft hover:bg-tint"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 + links.length * 0.05 }}
              >
                <Link
                  href="/plan-your-trip"
                  className="mt-2 block rounded-xl bg-ink px-4 py-3 text-center text-sm font-semibold text-background"
                >
                  Plan Your Trip
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
