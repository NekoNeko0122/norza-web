import type { AvatarGender } from "@/components/ui/CartoonAvatar";

export interface TeamMember {
  slug: string;
  name: string;
  gender: AvatarGender;
  role: string;
  program: string;
  bio: string;
  credentials: string[];
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    slug: "baby-jane-garcia",
    name: "Baby Jane Garcia",
    gender: "female",
    role: "Halik Sobrang Diin",
    program: "BS Tourism Management",
    bio: "Profile details coming soon — full bio to be added.",
    credentials: ["Bestlink College of the Philippines – Bulacan", "Tito Vic & Joey"],
  },
  {
    slug: "vonzell-mae-cabuguas",
    name: "Vonzell Mae Cabuguas",
    gender: "female",
    role: "Driftstar",
    program: "BS Tourism Management",
    bio: "Profile details coming soon — full bio to be added.",
    credentials: ["Bestlink College of the Philippines – Bulacan", "Willie Revillame"],
  },
  {
    slug: "grace-anne-certeza",
    name: "Grace Anne Certeza",
    gender: "female",
    role: "Bling-Bang-Bang-Born",
    program: "BS Tourism Management",
    bio: "Profile details coming soon — full bio to be added.",
    credentials: ["Bestlink College of the Philippines – Bulacan", "Ryzza Mae Dizon"],
  },
  {
    slug: "chrisdan-lyn-lirado",
    name: "Chrisdan Lyn Lirado",
    gender: "female",
    role: "Just Once",
    program: "BS Tourism Management",
    bio: "Profile details coming soon — full bio to be added.",
    credentials: ["Bestlink College of the Philippines – Bulacan", "Lexi Lore"],
  },
  {
    slug: "sherwin-rodriguez",
    name: "Sherwin Rodriguez",
    gender: "male",
    role: "Having You Near Me",
    program: "BS Tourism Management",
    bio: "Profile details coming soon — full bio to be added.",
    credentials: ["Bestlink College of the Philippines – Bulacan", "Jerald's Future"],
  },
];

export function getTeamMemberBySlug(slug: string) {
  return TEAM_MEMBERS.find((m) => m.slug === slug);
}
