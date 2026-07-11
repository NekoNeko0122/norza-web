"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { categoryMeta } from "@/data/destinations";
import { useTheme } from "@/components/theme/ThemeProvider";
import MapMask from "./MapMask";
import MapZoomSlider from "./MapZoomSlider";
import {
  NORZAGARAY_BOUNDS,
  NORZAGARAY_MIN_ZOOM,
  NORZAGARAY_MAX_ZOOM,
  TILE_URLS,
  TILE_ATTRIBUTION,
} from "@/lib/map";

function pinIcon(color: string, verified: boolean) {
  const dash = verified ? "" : `stroke-dasharray="2.5,2.5"`;
  const svg = `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12.2 17 27 17 27s17-14.8 17-27C34 7.6 26.4 0 17 0z" fill="${color}"/>
      <circle cx="17" cy="17" r="9.5" fill="white" ${dash} stroke="${color}" stroke-width="${verified ? 0 : 1.6}"/>
      <circle cx="17" cy="17" r="5.5" fill="${color}"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "norza-pin",
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -40],
  });
}

function FlyToSelected({ target }: { target: Destination | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.coordinates.lat, target.coordinates.lng], 15, { duration: 0.8 });
    }
  }, [target, map]);
  return null;
}

export default function DestinationMap({
  destinations,
  selected,
  onSelect,
}: {
  destinations: Destination[];
  selected: Destination | null;
  onSelect: (d: Destination) => void;
}) {
  const { theme } = useTheme();

  return (
    <MapContainer
      bounds={NORZAGARAY_BOUNDS}
      minZoom={NORZAGARAY_MIN_ZOOM}
      maxZoom={NORZAGARAY_MAX_ZOOM}
      maxBounds={NORZAGARAY_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
    >
      <MapZoomSlider min={NORZAGARAY_MIN_ZOOM} max={NORZAGARAY_MAX_ZOOM} />
      <TileLayer
        key={theme}
        attribution={TILE_ATTRIBUTION}
        url={theme === "dark" ? TILE_URLS.dark : TILE_URLS.light}
        noWrap
      />
      <MapMask
        maskColor={theme === "dark" ? "#170a11" : "#fff5f8"}
        outlineColor={theme === "dark" ? "#ff92c4" : "#d81f74"}
      />
      <FlyToSelected target={selected} />
      {destinations.map((d) => (
        <Marker
          key={d.id}
          position={[d.coordinates.lat, d.coordinates.lng]}
          icon={pinIcon(d.onGoogleMaps ? "#d81f74" : "#8a1050", d.coordinatesVerified)}
          eventHandlers={{ click: () => onSelect(d) }}
        >
          <Popup>
            <div className="p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-500">
                {categoryMeta[d.category].label}
              </p>
              <p className="mt-1 font-display text-sm font-semibold text-ink">{d.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-ink-soft">{d.shortDescription}</p>
              <Link
                href={`/destinations/${d.slug}`}
                className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:underline"
              >
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
