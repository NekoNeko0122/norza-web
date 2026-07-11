import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function googleMapsUrl(lat: number, lng: number, query?: string) {
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}&query_place_id=`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function googleMapsDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

export function wazeUrl(lat: number, lng: number) {
  return `https://waze.com/ul?ll=${lat}%2C${lng}&navigate=yes&zoom=17`;
}

export function averageRating(reviews?: { rating: number }[]) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
