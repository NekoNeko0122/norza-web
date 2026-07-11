"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { useTheme } from "@/components/theme/ThemeProvider";
import MapMask from "@/components/destinations/MapMask";
import MapControls from "@/components/destinations/MapControls";
import {
  NORZAGARAY_BOUNDS,
  NORZAGARAY_MIN_ZOOM,
  NORZAGARAY_MAX_ZOOM,
  TILE_URLS,
  TILE_ATTRIBUTION,
} from "@/lib/map";

export default function MiniMap({
  lat,
  lng,
  color = "#d81f74",
}: {
  lat: number;
  lng: number;
  color?: string;
}) {
  const { theme } = useTheme();

  const icon = L.divIcon({
    html: `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12.2 17 27 17 27s17-14.8 17-27C34 7.6 26.4 0 17 0z" fill="${color}"/>
      <circle cx="17" cy="17" r="9.5" fill="white"/>
      <circle cx="17" cy="17" r="5.5" fill="${color}"/>
    </svg>`,
    className: "norza-pin",
    iconSize: [34, 44],
    iconAnchor: [17, 44],
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14.5}
      minZoom={NORZAGARAY_MIN_ZOOM}
      maxZoom={NORZAGARAY_MAX_ZOOM}
      maxBounds={NORZAGARAY_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={false}
      dragging={true}
      zoomControl={false}
      className="h-full w-full"
    >
      <MapControls min={NORZAGARAY_MIN_ZOOM} max={NORZAGARAY_MAX_ZOOM} compact />
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
      <Marker position={[lat, lng]} icon={icon} />
    </MapContainer>
  );
}
