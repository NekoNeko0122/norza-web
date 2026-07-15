import type { Metadata } from "next";
import TeamIndexContent from "@/components/team/TeamIndexContent";

export const metadata: Metadata = {
  title: "Meet the Team | Discover Norzagaray",
  description: "Meet the proponents behind Discover Norzagaray, a Bestlink College of the Philippines capstone project.",
};

export default function TeamIndexPage() {
  return <TeamIndexContent />;
}
