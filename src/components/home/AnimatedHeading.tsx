"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

const WORD = "Norzagaray";
const LETTER_STAGGER = 0.15;
const LETTER_DURATION = 0.8;
const WORD_START_DELAY = 0.5;

// mirrors the .text-gradient-brand CSS gradient stops — computed per letter
// since `background-clip: text` doesn't inherit into animated child spans
const STOPS_LIGHT: [number, string][] = [
  [0, "#d81f74"],
  [0.45, "#fb5fa8"],
  [1, "#eba83f"],
];
const STOPS_DARK: [number, string][] = [
  [0, "#fb5fa8"],
  [0.45, "#ff92c4"],
  [1, "#f5c26b"],
];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(a: string, b: string, t: number) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function colorAt(stops: [number, string][], t: number) {
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (t >= p0 && t <= p1) {
      const localT = (t - p0) / (p1 - p0);
      return lerpColor(c0, c1, localT);
    }
  }
  return stops[stops.length - 1][1];
}

export default function AnimatedHeading() {
  const { theme } = useTheme();
  const stops = theme === "dark" ? STOPS_DARK : STOPS_LIGHT;
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const total = (WORD_START_DELAY + (WORD.length - 1) * LETTER_STAGGER + LETTER_DURATION) * 1000;
    const t = setTimeout(() => setSettled(true), total);
    return () => clearTimeout(t);
  }, []);

  return (
    <h1 className="mt-7 font-display text-6xl font-semibold leading-[1.03] tracking-tight text-ink sm:text-7xl lg:text-8xl">
      <motion.span
        className="block"
        initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
        animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.65, 0, 0.15, 1] }}
      >
        Discover
      </motion.span>
      <span className="italic" style={{ perspective: 600 }}>
        {WORD.split("").map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block cursor-default"
            style={{ color: colorAt(stops, i / (WORD.length - 1)) }}
            initial={{ opacity: 0, y: 40, rotateX: -90 }}
            animate={
              settled
                ? { opacity: 1, y: [0, -10, 0], rotateX: 0 }
                : { opacity: 1, y: 0, rotateX: 0 }
            }
            whileHover={{ scale: 1.25, y: -14, transition: { duration: 0.2, ease: "easeOut" } }}
            transition={
              settled
                ? {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.09,
                  }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 16,
                    delay: WORD_START_DELAY + i * LETTER_STAGGER,
                    duration: LETTER_DURATION,
                  }
            }
          >
            {letter}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}
