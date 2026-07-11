import HeroSection from "@/components/home/HeroSection";
import ExploreSection from "@/components/home/ExploreSection";
import StatsStrip from "@/components/home/StatsStrip";
import CategoryNav from "@/components/home/CategoryNav";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ExploreSection />
      <StatsStrip />
      <div className="py-20">
        <CategoryNav />
      </div>
      <FeaturedDestinations />
    </div>
  );
}
