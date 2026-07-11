"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Hand } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsTouchDevice } from "@/lib/useIsTouchDevice";

/**
 * On touch devices the map starts with dragging disabled so a single-finger
 * swipe scrolls the page instead of panning the map. This control lets
 * someone opt in to drag/pan while they're actively exploring the map, and
 * automatically opts back out once the map scrolls mostly out of view so
 * the rest of the page keeps scrolling normally.
 */
export default function MapDragToggle() {
  const map = useMap();
  const isTouch = useIsTouchDevice();
  const [enabled, setEnabled] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTouch) {
      map.dragging.enable();
      return;
    }
    if (enabled) {
      map.dragging.enable();
    } else {
      map.dragging.disable();
    }
  }, [isTouch, enabled, map]);

  useEffect(() => {
    if (!isTouch) return;
    const container = map.getContainer();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.4) setEnabled(false);
      },
      { threshold: [0, 0.4, 1] }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [isTouch, map]);

  useEffect(() => {
    const el = controlRef.current;
    if (!el) return;
    L.DomEvent.disableClickPropagation(el);
  }, []);

  if (!isTouch) return null;

  return (
    <div ref={controlRef} className="leaflet-control">
      <button
        onClick={() => setEnabled((e) => !e)}
        aria-label={enabled ? "Disable map drag" : "Enable map drag"}
        aria-pressed={enabled}
        title={enabled ? "Map drag on — tap to disable" : "Enable map drag"}
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full border shadow-lg backdrop-blur transition-colors",
          enabled
            ? "border-brand-500 bg-brand-500 text-white"
            : "border-edge bg-surface/95 text-ink-soft"
        )}
      >
        <Hand size={15} />
      </button>
    </div>
  );
}
