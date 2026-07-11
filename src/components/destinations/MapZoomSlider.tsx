"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Plus, Minus } from "lucide-react";

export default function MapZoomSlider({
  min,
  max,
  compact = false,
}: {
  min: number;
  max: number;
  compact?: boolean;
}) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on("zoom", onZoom);
    return () => {
      map.off("zoom", onZoom);
    };
  }, [map]);

  useEffect(() => {
    const el = controlRef.current;
    if (!el) return;
    // stop the map's own drag/scroll handlers from stealing pointer events
    // meant for this control (same trick Leaflet's built-in controls use)
    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.disableScrollPropagation(el);
  }, []);

  function setMapZoom(z: number) {
    const clamped = Math.min(max, Math.max(min, z));
    setZoom(clamped);
    map.setZoom(clamped);
  }

  return (
    <div
      ref={controlRef}
      className="leaflet-control flex flex-col items-center gap-1 rounded-2xl border border-edge bg-surface/95 p-1.5 shadow-lg backdrop-blur"
      onPointerDownCapture={(e) => e.stopPropagation()}
      onMouseDownCapture={(e) => e.stopPropagation()}
      onTouchStartCapture={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setMapZoom(zoom + 1)}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-tint hover:text-brand-600"
        aria-label="Zoom in"
      >
        <Plus size={14} />
      </button>

      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={zoom}
        onChange={(e) => setMapZoom(Number(e.target.value))}
        className="andrew-zoom-slider my-1 accent-brand-500"
        style={{
          writingMode: "vertical-lr",
          direction: "rtl",
          height: compact ? 48 : 90,
        }}
        aria-label="Map zoom level"
      />

      <button
        onClick={() => setMapZoom(zoom - 1)}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-tint hover:text-brand-600"
        aria-label="Zoom out"
      >
        <Minus size={14} />
      </button>
    </div>
  );
}
