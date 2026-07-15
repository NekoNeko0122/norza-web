import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEAM_MEMBERS, getTeamMemberBySlug } from "@/data/team";
import TeamMemberContent from "@/components/team/TeamMemberContent";

export function generateStaticParams() {
  return TEAM_MEMBERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);
  if (!member) return {};
  return {
    title: `${member.name} | Meet the Team — Discover Norzagaray`,
    description: `${member.role} on the Discover Norzagaray capstone team.`,
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);
  if (!member) notFound();

  const index = TEAM_MEMBERS.findIndex((m) => m.slug === slug);
  const prev = TEAM_MEMBERS[(index - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length];
  const next = TEAM_MEMBERS[(index + 1) % TEAM_MEMBERS.length];

  return <TeamMemberContent member={member} prev={prev} next={next} />;
}
