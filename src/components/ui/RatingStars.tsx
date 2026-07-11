import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingStars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? "fill-gold-500 text-gold-500" : "fill-none text-brand-200"}
        />
      ))}
    </div>
  );
}
