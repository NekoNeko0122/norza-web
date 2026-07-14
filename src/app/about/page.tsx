import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About Norzagaray | Discover Norzagaray",
  description: "Get to know Norzagaray, Bulacan: its geography, history, and why it's worth visiting.",
};

export default function AboutPage() {
  return <AboutContent />;
}
