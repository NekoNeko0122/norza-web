import HeroSection from "@/components/home/HeroSection";
import ExploreSection from "@/components/home/ExploreSection";
import StatsStrip from "@/components/home/StatsStrip";
import CategoryNav from "@/components/home/CategoryNav";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import ProponentsSection from "@/components/home/ProponentsSection";
import ContactSection from "@/components/home/ContactSection";

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
      <ProponentsSection />
      <ContactSection />
    </div>
  );
}
