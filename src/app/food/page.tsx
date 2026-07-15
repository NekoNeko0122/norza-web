import { Suspense } from "react";
import type { Metadata } from "next";
import FoodExplorer from "@/components/food/FoodExplorer";

export const metadata: Metadata = {
  title: "Food | Discover Norzagaray",
  description: "Discover what to eat in Norzagaray, Bulacan: local dishes, delicacies, restaurants, cafés, and street food.",
};

export default function FoodPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <FoodExplorer />
    </Suspense>
  );
}
