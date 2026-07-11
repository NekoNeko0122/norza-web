import { Trees, Compass, Landmark, Church, TreePine, Mountain, type LucideIcon } from "lucide-react";
import type { DestinationCategory } from "@/data/destinations";

const icons: Record<DestinationCategory, LucideIcon> = {
  nature: Trees,
  adventure: Compass,
  heritage: Landmark,
  religious: Church,
  park: TreePine,
  viewpoint: Mountain,
};

export default function DestinationArt({
  gradient,
  category,
  className,
}: {
  gradient: [string, string];
  category: DestinationCategory;
  Icon?: never;
  className?: string;
}) {
  const Icon = icons[category];
  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-xl" />
        <div className="absolute -bottom-8 -right-4 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
        <Icon className="relative text-white/90" size={44} strokeWidth={1.4} />
      </div>
    </div>
  );
}
