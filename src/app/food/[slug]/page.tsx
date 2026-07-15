import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { foodItems, getFoodItemBySlug } from "@/data/food";
import FoodDetailContent from "@/components/food/FoodDetailContent";
import GoogleReviewsSection from "@/components/ui/GoogleReviewsSection";
import { getPlaceReviews } from "@/lib/googlePlaces";

export function generateStaticParams() {
  return foodItems.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const food = getFoodItemBySlug(slug);
  if (!food) return {};
  return {
    title: `${food.name} | Discover Norzagaray`,
    description: food.shortDescription,
  };
}

export default async function FoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const food = getFoodItemBySlug(slug);
  if (!food) notFound();

  const related = foodItems.filter((f) => f.id !== food.id && f.category === food.category).slice(0, 3);

  const googleData = food.placeId ? await getPlaceReviews(food.placeId) : null;
  const googlePhotos = (googleData?.photos ?? []).map(
    (p) => `/api/place-photo?name=${encodeURIComponent(p.name)}&w=1600`
  );
  const heroImages = googlePhotos.length > 0 ? googlePhotos : food.images;

  return (
    <FoodDetailContent
      food={food}
      related={related}
      heroImages={heroImages}
      rating={googleData?.rating ?? 0}
      reviewCount={googleData?.userRatingCount ?? 0}
      googleReviews={<GoogleReviewsSection placeId={food.placeId} />}
    />
  );
}
