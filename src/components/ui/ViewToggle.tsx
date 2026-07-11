"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, MapIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "list" | "map";

const options: { value: ViewMode; label: string; icon: LucideIcon }[] = [
  { value: "list", label: "List", icon: LayoutGrid },
  { value: "map", label: "Map", icon: MapIcon },
];

export default function ViewToggle({
  view,
  onChange,
  className,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
  className?: string;
}) {
  const layoutId = useId();

  return (
    <div className={cn("relative flex rounded-full border border-edge bg-surface p-1", className)}>
      {options.map((opt) => {
        const active = view === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active ? "text-white" : "text-ink-soft hover:text-brand-600"
            )}
          >
            {active && (
              <motion.span
                layoutId={`view-toggle-pill-${layoutId}`}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
              />
            )}
            <Icon size={15} /> {opt.label}
          </button>
        );
      })}
    </div>
  );
}
