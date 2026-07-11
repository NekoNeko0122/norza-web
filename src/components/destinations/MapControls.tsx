"use client";

import MapZoomSlider from "./MapZoomSlider";
import MapDragToggle from "./MapDragToggle";

export default function MapControls({
  min,
  max,
  compact = false,
}: {
  min: number;
  max: number;
  compact?: boolean;
}) {
  return (
    <div className="leaflet-top leaflet-right !mr-2.5 !mt-2.5 flex flex-col items-end gap-2.5">
      <MapZoomSlider min={min} max={max} compact={compact} />
      <MapDragToggle />
    </div>
  );
}
