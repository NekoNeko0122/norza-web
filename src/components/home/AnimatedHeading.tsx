"use client";

import { useState } from "react";
import { motion, type Easing } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

const DISCOVER_LETTERS = "Discover".split("");
const WORD = "Norzagaray";
const WORD_LETTERS = WORD.split("");
const DISCOVER_LAST = DISCOVER_LETTERS.length - 1;
const WORD_LAST = WORD_LETTERS.length - 1;

// forward pass: lens sweeps across "Discover"
const FORWARD_STAGGER = 0.12;
const LETTER_POP_DUR = 0.5;
const LETTER_POP_PEAK = 0.6; // when each letter is "in focus"
const DESCEND_PAUSE = 0.4;
// backward pass: lens sweeps back across "Norzagaray"
const BACKWARD_STAGGER = 0.1;
const FADE_TAIL = 0.3;

const T_FORWARD_END = DISCOVER_LAST * FORWARD_STAGGER + LETTER_POP_DUR;
const BACKWARD_START = T_FORWARD_END + DESCEND_PAUSE;
const T_BACKWARD_END = BACKWARD_START + WORD_LAST * BACKWARD_STAGGER + LETTER_POP_DUR;
const TOTAL_DURATION = T_BACKWARD_END + FADE_TAIL;

export const HERO_HEADING_DONE = TOTAL_DURATION;

// rough vertical center of each line (matches leading-[1.03])
const LINE1_TOP = "0.52em";
const LINE2_TOP = "1.55em";

// matches the .text-gradient-brand CSS stops, computed per letter since
// background-clip: text doesn't inherit into animated child spans
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

// overshoot only on the way up so it doesn't wobble settling back down
const POP_EASE: Easing[] = [[0.34, 1.56, 0.64, 1], "easeOut"];

function letterPopTransition(delay: number) {
  return {
    delay,
    duration: LETTER_POP_DUR,
    ease: POP_EASE,
    times: [0, LETTER_POP_PEAK, 1],
  };
}

const letterPopAnimate = {
  opacity: [0, 1, 1],
  y: [6, 0, 0],
  filter: ["blur(10px)", "blur(0px)", "blur(0px)"],
  scale: [0.4, 1.18, 1],
};

const letterPopInitial = { opacity: 0, scale: 0.4, y: 6, filter: "blur(10px)" };

// one anchor per letter so the lens is always exactly where it's revealing
type LensPointKind = "entrance" | "letter" | "settle" | "descend" | "exit";

interface LensPoint {
  t: number;
  left: number;
  top: string;
  opacity: number;
  scale: number;
  rotate: number;
  kind: LensPointKind;
}

function buildLensPoints(): LensPoint[] {
  const points: LensPoint[] = [
    { t: 0, left: -8, top: LINE1_TOP, opacity: 0, scale: 0.5, rotate: -8, kind: "entrance" },
  ];

  DISCOVER_LETTERS.forEach((_, i) => {
    points.push({
      t: i * FORWARD_STAGGER + LETTER_POP_DUR * LETTER_POP_PEAK,
      left: 6 + 88 * (i / DISCOVER_LAST),
      top: LINE1_TOP,
      opacity: 1,
      scale: 1,
      rotate: 3,
      kind: "letter",
    });
  });

  points.push({ t: T_FORWARD_END, left: 94, top: LINE1_TOP, opacity: 1, scale: 1, rotate: -4, kind: "settle" });
  points.push({
    t: BACKWARD_START,
    left: 94,
    top: LINE2_TOP,
    opacity: 1,
    scale: 1.12,
    rotate: 10,
    kind: "descend",
  });

  WORD_LETTERS.forEach((_, i) => {
    const k = WORD_LAST - i; // reveal order: rightmost letter first
    points.push({
      t: BACKWARD_START + k * BACKWARD_STAGGER + LETTER_POP_DUR * LETTER_POP_PEAK,
      left: 94 - 96 * (k / WORD_LAST),
      top: LINE2_TOP,
      opacity: 1,
      scale: 1,
      rotate: -3,
      kind: "letter",
    });
  });

  points.push({ t: T_BACKWARD_END, left: -2, top: LINE2_TOP, opacity: 1, scale: 1, rotate: -3, kind: "settle" });
  // stay put here, just fade + shrink a little, no drift or spin on the way out
  points.push({ t: TOTAL_DURATION, left: -2, top: LINE2_TOP, opacity: 0, scale: 0.7, rotate: -3, kind: "exit" });

  return points;
}

const LENS_POINTS = buildLensPoints();
const LENS_TIMES = LENS_POINTS.map((p) => p.t / TOTAL_DURATION);
const LENS_LEFT = LENS_POINTS.map((p) => `${p.left}%`);
const LENS_TOP = LENS_POINTS.map((p) => p.top);
const LENS_OPACITY = LENS_POINTS.map((p) => p.opacity);
const LENS_SCALE = LENS_POINTS.map((p) => p.scale);
const LENS_ROTATE = LENS_POINTS.map((p) => p.rotate);

// letter-to-letter hops stay linear so they read as one glide; the entrance/
// descend/settle/exit beats keep an eased, weighted feel
function segmentEase(a: LensPointKind, b: LensPointKind): Easing {
  if (a === "entrance") return "easeOut";
  if (b === "exit") return "easeOut";
  if (a === "letter" && b === "letter") return "linear";
  return "easeInOut";
}

const LENS_EASE: Easing[] = LENS_POINTS.slice(1).map((p, i) => segmentEase(LENS_POINTS[i].kind, p.kind));

// glint sweeps a few times, then freezes before the fade-out instead of
// looping forever (that used to keep sliding after everything else settled)
const GLINT_CYCLES = 4;
const GLINT_ACTIVE_DURATION = T_BACKWARD_END;
const GLINT_TIMES = Array.from({ length: GLINT_CYCLES * 2 + 1 }, (_, i) => i / (GLINT_CYCLES * 2));
const GLINT_X = GLINT_TIMES.map((_, i) => (i % 2 === 0 ? "-35%" : "35%"));
const GLINT_OPACITY = GLINT_TIMES.map((_, i) => (i % 2 === 0 ? 0.15 : 0.85));

function LensLayer() {
  return (
    <>
      {/* faint trailing ghost, sells motion on the fast passes */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute z-[9] -mt-[0.8em] h-[1.6em] w-[1.6em] rounded-full border border-brand-300/40 blur-[2px]"
        style={{ marginLeft: "-0.8em" }}
        initial={{ left: LENS_LEFT[0], top: LENS_TOP[0], opacity: 0, scale: 0.5 }}
        animate={{
          left: LENS_LEFT,
          top: LENS_TOP,
          opacity: LENS_OPACITY.map((o) => o * 0.4),
          scale: LENS_SCALE.map((s) => s * 0.85),
        }}
        transition={{ duration: TOTAL_DURATION, times: LENS_TIMES, delay: 0.07, ease: LENS_EASE }}
      />

      {/* the magnifying glass itself */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute z-10 -mt-[0.8em] h-[1.6em] w-[1.6em]"
        style={{ marginLeft: "-0.8em" }}
        initial={{ left: LENS_LEFT[0], top: LENS_TOP[0], opacity: 0, scale: 0.5, rotate: -8 }}
        animate={{ left: LENS_LEFT, top: LENS_TOP, opacity: LENS_OPACITY, scale: LENS_SCALE, rotate: LENS_ROTATE }}
        transition={{ duration: TOTAL_DURATION, times: LENS_TIMES, ease: LENS_EASE }}
      >
        <span className="relative block h-full w-full rounded-full border-2 border-brand-400/80 bg-gradient-to-br from-white/25 via-white/5 to-transparent shadow-[0_4px_18px_rgba(176,19,94,0.45)] backdrop-blur-[1px]">
          <span className="absolute inset-[18%] rounded-full bg-gradient-to-br from-white/55 via-white/10 to-transparent" />
          <motion.span
            aria-hidden
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              background:
                "linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.8) 48%, transparent 64%)",
            }}
            animate={{ opacity: GLINT_OPACITY, x: GLINT_X }}
            transition={{ duration: GLINT_ACTIVE_DURATION, times: GLINT_TIMES, ease: "easeInOut" }}
          />
          <span className="absolute bottom-[-0.62em] right-[-0.48em] h-[0.75em] w-[0.16em] origin-top rotate-45 rounded-full bg-gradient-to-b from-brand-300 via-brand-500 to-brand-700 shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
            <span className="absolute -bottom-[0.05em] left-1/2 h-[0.2em] w-[0.2em] -translate-x-1/2 rounded-full bg-brand-700" />
          </span>
        </span>
      </motion.span>
    </>
  );
}

const IDLE_WAVE_DUR = 1.8;
const IDLE_WAVE_STAGGER = 0.09;

export default function AnimatedHeading() {
  const { theme } = useTheme();
  const stops = theme === "dark" ? STOPS_DARK : STOPS_LIGHT;
  const [settled, setSettled] = useState(false);

  return (
    <h1 className="mt-7 font-display text-6xl font-semibold leading-[1.03] tracking-tight text-ink sm:text-7xl lg:text-8xl">
      <span className="relative isolate mx-auto block w-fit">
        <span className="relative mx-auto block w-fit">
          {DISCOVER_LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={letterPopInitial}
              animate={letterPopAnimate}
              transition={letterPopTransition(i * FORWARD_STAGGER)}
            >
              {letter}
            </motion.span>
          ))}
        </span>

        <span className="relative mx-auto block w-fit italic">
          {WORD_LETTERS.map((letter, i) => {
            const delay = BACKWARD_START + (WORD_LAST - i) * BACKWARD_STAGGER;
            return (
              <motion.span
                key={i}
                className="inline-block cursor-default"
                style={{ color: colorAt(stops, i / WORD_LAST) }}
                initial={letterPopInitial}
                animate={
                  settled
                    ? { opacity: 1, y: [0, -9, 0], rotate: [0, i % 2 === 0 ? 2 : -2, 0], scale: 1, filter: "blur(0px)" }
                    : letterPopAnimate
                }
                onAnimationComplete={i === 0 ? () => setSettled(true) : undefined}
                transition={
                  settled
                    ? {
                        duration: IDLE_WAVE_DUR,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * IDLE_WAVE_STAGGER,
                      }
                    : letterPopTransition(delay)
                }
              >
                {letter}
              </motion.span>
            );
          })}
        </span>

        <LensLayer />
      </span>
    </h1>
  );
}
