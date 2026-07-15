import { Cookie, UtensilsCrossed, Store, Coffee, Soup, type LucideIcon } from "lucide-react";
import type { FoodCategory } from "@/data/food";

const icons: Record<FoodCategory, LucideIcon> = {
  delicacy: Cookie,
  dish: UtensilsCrossed,
  restaurant: Store,
  cafe: Coffee,
  "street-food": Soup,
};

export default function FoodArt({
  gradient,
  category,
  images,
  className,
}: {
  gradient: [string, string];
  category: FoodCategory;
  images?: string[];
  className?: string;
}) {
  const Icon = icons[category];
  const photo = images?.[0];

  if (photo) {
    return (
      <div
        className={className}
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- external, unpredictable hosts */}
        <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-xl" />
        <div className="absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
        <Icon className="relative text-white/90" size={44} strokeWidth={1.4} />
      </div>
    </div>
  );
}
