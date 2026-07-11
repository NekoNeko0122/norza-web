"use client";

import { Polygon } from "react-leaflet";
import { NORZAGARAY_MASK_RINGS } from "@/lib/map";
import { NORZAGARAY_BOUNDARY } from "@/data/norzagaray-boundary";

export default function MapMask({ maskColor, outlineColor }: { maskColor: string; outlineColor: string }) {
  return (
    <>
      {/* covers everything outside the municipality with the page background,
          so panning/zooming never reveals surrounding towns */}
      <Polygon
        positions={NORZAGARAY_MASK_RINGS}
        pathOptions={{ stroke: false, fillColor: maskColor, fillOpacity: 1 }}
        interactive={false}
      />
      <Polygon
        positions={NORZAGARAY_BOUNDARY}
        pathOptions={{ color: outlineColor, weight: 2, opacity: 0.6, fillOpacity: 0 }}
        interactive={false}
      />
    </>
  );
}
