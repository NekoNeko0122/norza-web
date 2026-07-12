"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Check, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import {
  ORIGIN_POINTS,
  VEHICLE_OPTIONS,
  INTEREST_OPTIONS,
  DIFFICULTY_LEVELS,
  PACE_OPTIONS,
} from "@/data/tripPlanning";
import type { DifficultyTolerance, Pace, TripInput, TripPlan } from "@/lib/itinerary";
import { generateTripPlan } from "@/lib/itinerary";
import { cn } from "@/lib/utils";
import TripResults from "./TripResults";

const STEPS = ["Trip Basics", "Interests", "Preferences", "Your Itinerary"];

const DEFAULT_INPUT: TripInput = {
  days: 1,
  pax: 2,
  originId: "sjdm",
  vehicleId: "private-car",
  interestIds: [],
  difficulty: "moderate",
  pace: "relaxed",
};

export default function TripPlannerWizard() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<TripInput>(DEFAULT_INPUT);
  const [plan, setPlan] = useState<TripPlan | null>(null);

  function toggleInterest(id: string) {
    setInput((prev) => ({
      ...prev,
      interestIds: prev.interestIds.includes(id)
        ? prev.interestIds.filter((i) => i !== id)
        : [...prev.interestIds, id],
    }));
  }

  function handleGenerate() {
    const result = generateTripPlan(input);
    setPlan(result);
    setStep(3);
  }

  function startOver() {
    setPlan(null);
    setInput(DEFAULT_INPUT);
    setStep(0);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 sm:px-8">
      {/* progress */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                i < step
                  ? "bg-brand-500 text-white"
                  : i === step
                    ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white ring-4 ring-tint"
                    : "border border-edge bg-surface text-ink-faint"
              )}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-px w-6 sm:w-12", i < step ? "bg-brand-500" : "bg-edge")} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <StepShell key="step0" title="Tell us about your trip">
            <div className="grid gap-8 sm:grid-cols-2">
              <Counter
                label="How many days?"
                value={input.days}
                min={1}
                max={4}
                onChange={(v) => setInput((p) => ({ ...p, days: v }))}
              />
              <Counter
                label="How many people?"
                value={input.pax}
                min={1}
                max={20}
                onChange={(v) => setInput((p) => ({ ...p, pax: v }))}
              />
            </div>

            <FieldLabel>Where are you coming from?</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {ORIGIN_POINTS.map((o) => (
                <SelectCard
                  key={o.id}
                  active={input.originId === o.id}
                  onClick={() => setInput((p) => ({ ...p, originId: o.id }))}
                  title={o.label}
                  subtitle={`~${o.baseTravelMinutes} min by car`}
                />
              ))}
            </div>

            <FieldLabel>What are you traveling in?</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {VEHICLE_OPTIONS.map((v) => (
                <SelectCard
                  key={v.id}
                  active={input.vehicleId === v.id}
                  onClick={() => setInput((p) => ({ ...p, vehicleId: v.id }))}
                  title={v.label}
                  subtitle={v.note}
                />
              ))}
            </div>

            <NextButton onClick={() => setStep(1)} />
          </StepShell>
        )}

        {step === 1 && (
          <StepShell key="step1" title="What do you want to experience?">
            <p className="-mt-4 text-sm text-ink-soft">
              Pick as many as you like — we'll build your days around them. Leave it blank and we'll surprise you.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {INTEREST_OPTIONS.map((opt) => {
                const active = input.interestIds.includes(opt.id);
                return (
                  <motion.button
                    key={opt.id}
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleInterest(opt.id)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left transition-colors",
                      active
                        ? "border-brand-500 bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20"
                        : "border-edge bg-surface text-ink hover:border-brand-300"
                    )}
                  >
                    <span className="block text-sm font-semibold">{opt.label}</span>
                    <span className={cn("mt-0.5 block text-xs", active ? "text-white/80" : "text-ink-faint")}>
                      {opt.description}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <BackButton onClick={() => setStep(0)} />
              <NextButton onClick={() => setStep(2)} />
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell key="step2" title="A few preferences">
            <FieldLabel>How adventurous are you feeling?</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-3">
              {DIFFICULTY_LEVELS.map((d) => (
                <SelectCard
                  key={d.id}
                  active={input.difficulty === d.id}
                  onClick={() => setInput((p) => ({ ...p, difficulty: d.id as DifficultyTolerance }))}
                  title={d.label}
                  subtitle={d.description}
                />
              ))}
            </div>

            <FieldLabel>What pace do you want?</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {PACE_OPTIONS.map((p) => (
                <SelectCard
                  key={p.id}
                  active={input.pace === p.id}
                  onClick={() => setInput((prev) => ({ ...prev, pace: p.id as Pace }))}
                  title={p.label}
                  subtitle={p.description}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <BackButton onClick={() => setStep(1)} />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20"
              >
                <Sparkles size={16} /> Generate My Itinerary
              </motion.button>
            </div>
          </StepShell>
        )}

        {step === 3 && plan && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TripResults plan={plan} input={input} onStartOver={startOver} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 rounded-3xl border border-edge bg-surface p-6 shadow-xl shadow-brand-900/5 sm:p-10"
    >
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      {children}
    </motion.div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 mt-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">{children}</p>;
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-4 rounded-2xl border border-edge bg-tint/30 px-4 py-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-ink-soft transition-colors hover:text-brand-600"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={14} />
        </button>
        <span className="flex-1 text-center font-display text-xl font-semibold text-ink">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-ink-soft transition-colors hover:text-brand-600"
          aria-label={`Increase ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function SelectCard({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left transition-colors",
        active ? "border-brand-500 bg-tint" : "border-edge bg-surface hover:border-brand-300"
      )}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-ink">
        {active && <Check size={14} className="text-brand-600" />}
        {title}
      </span>
      <span className="mt-0.5 block text-xs text-ink-faint">{subtitle}</span>
    </motion.button>
  );
}

function NextButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-end pt-2">
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-background"
      >
        Next <ArrowRight size={16} />
      </motion.button>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-edge bg-surface px-6 py-3 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-600"
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
}
