"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const INSET = 6; // px gap kept between the thumb and the track edge on both sides

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const trackRef = useRef<HTMLButtonElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const [travel, setTravel] = useState(0);

  useLayoutEffect(() => {
    function measure() {
      if (!trackRef.current || !thumbRef.current) return;
      const trackWidth = trackRef.current.clientWidth;
      const thumbWidth = thumbRef.current.offsetWidth;
      // computed live from the actual rendered box, never a hardcoded guess
      setTravel(Math.max(0, trackWidth - thumbWidth - INSET * 2));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <motion.button
      ref={trackRef}
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      initial="rest"
      animate="rest"
      className="relative inline-flex h-10 w-20 shrink-0 items-center overflow-hidden rounded-full border border-edge bg-surface-2 shadow-inner"
      style={{ paddingLeft: INSET, paddingRight: INSET }}
    >
      <motion.span
        variants={{ rest: { opacity: 0.7 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-500"
      >
        <Sun size={15} className={isDark ? "text-ink-faint" : "text-brand-500"} />
      </motion.span>
      <motion.span
        variants={{ rest: { opacity: 0.7 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
      >
        <Moon size={15} className={isDark ? "text-brand-300" : "text-ink-faint"} />
      </motion.span>

      <motion.span
        ref={thumbRef}
        variants={{
          rest: { x: isDark ? travel : 0, scale: 1 },
          hover: { x: isDark ? travel : 0, scale: 1.06 },
        }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
      >
        <motion.span
          animate={{ rotate: isDark ? 0 : 360 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="grid place-items-center"
        >
          {isDark ? <Moon size={13} /> : <Sun size={13} />}
        </motion.span>
      </motion.span>
    </motion.button>
  );
}
