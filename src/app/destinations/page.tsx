import { Suspense } from "react";
import type { Metadata } from "next";
import DestinationsExplorer from "@/components/destinations/DestinationsExplorer";

export const metadata: Metadata = {
  title: "All Destinations | Discover Norzagaray",
  description: "Browse every tourist spot in Norzagaray, Bulacan in list or interactive map view.",
};

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <DestinationsExplorer />
    </Suspense>
  );
}
