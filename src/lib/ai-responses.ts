import { destinations, categoryMeta, type Destination } from "@/data/destinations";
import { BASE_PACKING_LIST, CONDITIONAL_PACKING, GENERAL_REMINDERS } from "@/data/tripPlanning";
import { TEAM_MEMBERS } from "@/data/team";

export interface PremadeQuestion {
  id: string;
  question: string;
}

export const premadeQuestions: PremadeQuestion[] = [
  { id: "must-visit", question: "What are the must-visit spots in Norzagaray?" },
  { id: "waterfalls", question: "Are there any waterfalls or rivers to swim in?" },
  { id: "how-to-get-there", question: "How do I get to Norzagaray from Manila?" },
  { id: "cave", question: "Tell me about Pinagrealan Cave." },
  { id: "fees", question: "Do these destinations have entrance fees?" },
  { id: "free", question: "What's free to visit here?" },
  { id: "family", question: "What's good for a family trip?" },
];

function listSpots(list: Destination[]) {
  return list
    .slice(0, 5)
    .map((d) => `• ${d.name}: ${d.shortDescription}`)
    .join("\n");
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findByKeyword(query: string): Destination[] {
  const q = query.toLowerCase();
  // below 4 chars, require a real word match ("hi" shouldn't match "hiking")
  const wordBoundary = new RegExp(`\\b${escapeRegExp(q)}\\b`);
  return destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.tags.some((t) => (q.length < 4 ? wordBoundary.test(t) : t.includes(q))) ||
      (q.length < 4 ? wordBoundary.test(d.category) : d.category.includes(q))
  );
}

// basic Tagalog/Taglish keywords added alongside the English ones below.
// this is just the offline fallback, Groq handles real conversation.

const GREETING_WORDS = ["hi", "hello", "hey", "hiya", "yo", "sup", "kumusta", "kamusta", "musta", "good morning", "good afternoon", "good evening"];
const THANKS_WORDS = ["thank", "thanks", "salamat", "appreciate"];
const FILLER_WORDS = ["ok", "okay", "sige", "cool", "nice", "haha", "hahaha", "lol", "ganda", "wow", "yes", "oo", "opo"];

const GREETING_REPLIES = [
  "Hey there! I'm Andrew, your Norzagaray guide. Want to explore what the town has to offer, like waterfalls, caves, or viewpoints? Or are you after something specific, like entrance fees or how to get here?",
  "Hi! Good to see you. Are you looking to explore Norzagaray's destinations, plan out a trip, or ask about something specific like fees or directions?",
  "Hello! I'm happy to help you plan your Norzagaray trip. What are you in the mood for: nature spots, heritage sites, a full itinerary, or something else?",
];

const FILLER_REPLIES = [
  "Anything else you'd like to know? I can talk about destinations, fees, directions, or help you plan a full trip.",
  "Got it! Want me to suggest some spots to visit, or help you plan your trip?",
];

function matchesAny(query: string, words: string[]): boolean {
  return words.some((w) => new RegExp(`\\b${escapeRegExp(w)}\\b`).test(query));
}

const TEAM_WORDS = [
  "proponent",
  "proponents",
  "team",
  "developer",
  "developers",
  "creator",
  "creators",
  "who made",
  "who built",
  "who created",
  "sino gumawa",
  "gumawa nito",
  "gumawa ng website",
  "sino may gawa",
  "may gawa",
  "sino gumawa nito",
];

function findTeamMember(query: string) {
  return TEAM_MEMBERS.find((m) => {
    const nameParts = m.name.toLowerCase().split(" ");
    return (
      query.includes(m.name.toLowerCase()) ||
      nameParts.some((p) => p.length > 3 && query.includes(p))
    );
  });
}

export function generateAssistantReply(rawQuery: string): string {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return "Ask me anything about Norzagaray's destinations, or tap one of the suggestions below!";
  }

  if (matchesAny(query, GREETING_WORDS)) {
    return GREETING_REPLIES[Math.floor(Math.random() * GREETING_REPLIES.length)];
  }

  if (matchesAny(query, THANKS_WORDS)) {
    return "You're welcome! Let me know if there's anything else you'd like to know about Norzagaray.";
  }

  if (query.includes("your name") || query.includes("who are you") || query.includes("sino ka") || query.includes("sino ba")) {
    return "I'm Andrew, the guide for Discover Norzagaray! I can help you find destinations, check entrance fees, get directions, or plan a full trip. What do you need?";
  }

  if (query.includes("what can you do") || query.includes("paano ka") || query === "help" || query.includes("makakatulong")) {
    return "I can help you explore Norzagaray's caves, rivers, waterfalls, and heritage sites: ask me about must-visit spots, entrance fees, how to get here, packing tips, or say you want to plan a trip and I'll point you to the trip planner.";
  }

  const teamMember = findTeamMember(query);
  if (teamMember) {
    return `${teamMember.name}\n\n${teamMember.role} • ${teamMember.program}\n\n${teamMember.bio}\n\nSee the full team on the Team page (/team).`;
  }

  if (matchesAny(query, TEAM_WORDS)) {
    const list = TEAM_MEMBERS.map((m) => `• ${m.name} — ${m.role}`).join("\n");
    return `Discover Norzagaray was made by a team of BS Tourism Management students from Bestlink College of the Philippines, Bulacan:\n\n${list}\n\nVisit the Team page (/team) to learn more about each of them.`;
  }

  if (query.length <= 12 && matchesAny(query, FILLER_WORDS)) {
    return FILLER_REPLIES[Math.floor(Math.random() * FILLER_REPLIES.length)];
  }

  if (
    query.includes("must") ||
    query.includes("best") ||
    query.includes("top") ||
    query.includes("pinakamaganda") ||
    query.includes("dapat puntahan")
  ) {
    const featured = destinations.filter((d) => d.featured);
    return `Here are Norzagaray's must-visit spots:\n\n${listSpots(featured)}\n\nWant directions or details? Open any of these from the Destinations page.`;
  }

  if (
    query.includes("waterfall") ||
    query.includes("falls") ||
    query.includes("swim") ||
    query.includes("river") ||
    query.includes("talon") ||
    query.includes("ilog") ||
    query.includes("languyan") ||
    query.includes("lumangoy")
  ) {
    const matches = destinations.filter(
      (d) => d.category === "nature" || d.tags.includes("swimming") || d.tags.includes("river")
    );
    return `Great choice! Norzagaray has some beautiful rivers and falls:\n\n${listSpots(matches)}\n\nBest visited in summer (March–May) when the water is clearest.`;
  }

  if (
    (query.includes("how") && (query.includes("get") || query.includes("go") || query.includes("manila") || query.includes("travel"))) ||
    query.includes("paano pumunta") ||
    query.includes("paano makarating")
  ) {
    return "Norzagaray is about an hour's drive from Metro Manila via NLEX (San Jose del Monte exit) or through Bocaue/Sta. Maria. Public commuters can ride a bus or van to San Jose del Monte or Bocaue, then transfer to a Norzagaray-bound jeepney or UV Express. Many of the nature spots (rivers, falls, view decks) are best reached with a private vehicle or habal-habal from the town proper.";
  }

  if (query.includes("cave") || query.includes("pinagrealan") || query.includes("kuweba") || query.includes("yungib")) {
    const cave = destinations.find((d) => d.slug === "pinagrealan-cave");
    if (cave) {
      return `${cave.name}\n\n${cave.description}\n\nEntrance fee: ${cave.entranceFee}\nOpen: ${cave.openHours}`;
    }
  }

  if (
    query.includes("fee") ||
    query.includes("cost") ||
    query.includes("price") ||
    query.includes("budget") ||
    query.includes("magkano") ||
    query.includes("bayad") ||
    query.includes("presyo")
  ) {
    const withFees = destinations.filter((d) => d.entranceFee && d.entranceFee !== "Free");
    return `Most spots charge a small entrance or environmental fee, usually ₱5–₱60:\n\n${withFees
      .map((d) => `• ${d.name}: ${d.entranceFee}`)
      .join("\n")}`;
  }

  if (query.includes("free") || query.includes("libre")) {
    const free = destinations.filter((d) => d.entranceFee === "Free" || !d.entranceFee);
    if (free.length) {
      return `These spots are free to visit:\n\n${listSpots(free)}`;
    }
    return "Most destinations charge a small entrance fee (usually ₱5–₱60), but visiting the town proper and St. Andrew the Apostle Parish is free.";
  }

  if (query.includes("family") || query.includes("kids") || query.includes("child") || query.includes("pamilya") || query.includes("bata")) {
    const family = destinations.filter((d) => d.difficulty === "easy");
    return `For an easygoing family trip, try:\n\n${listSpots(family)}\n\nThese have gentler terrain and easier access than the hiking/spelunking spots.`;
  }

  if (
    query.includes("church") ||
    query.includes("religious") ||
    query.includes("heritage") ||
    query.includes("history") ||
    query.includes("simbahan") ||
    query.includes("kasaysayan")
  ) {
    const heritage = destinations.filter((d) => d.category === "religious" || d.category === "heritage");
    return `For history and heritage:\n\n${listSpots(heritage)}`;
  }

  if (
    query.includes("pack") ||
    query.includes("bring") ||
    query.includes("what to wear") ||
    query.includes("prepare") ||
    query.includes("dadalhin") ||
    query.includes("ihahanda")
  ) {
    return `Here's a general packing list for Norzagaray:\n\n${BASE_PACKING_LIST.map((i) => `• ${i}`).join("\n")}\n\nGoing swimming or caving? Use the trip planner (/plan-your-trip) for a packing list tailored to your specific stops. It also covers ${Object.keys(CONDITIONAL_PACKING).join(", ")} extras.`;
  }

  if (
    query.includes("itinerary") ||
    query.includes("plan my trip") ||
    query.includes("plan a trip") ||
    query.includes("trip plan") ||
    query.includes("help me plan") ||
    query.includes("plano")
  ) {
    return "I'd love to help you put together a day plan! Head to the Plan Your Trip page (/plan-your-trip): tell it where you're coming from, how many people, and what you're into, and it'll build a full itinerary with travel times and packing tips.";
  }

  if (
    query.includes("tip") ||
    query.includes("advice") ||
    query.includes("reminder") ||
    query.includes("safety") ||
    query.includes("careful") ||
    query.includes("paalala") ||
    query.includes("ingat")
  ) {
    return `A few things worth knowing before you go:\n\n${GENERAL_REMINDERS.map((r) => `• ${r}`).join("\n")}`;
  }

  if (
    query.includes("how far") ||
    query.includes("how long") ||
    query.includes("travel time") ||
    query.includes("distance") ||
    query.includes("gaano katagal") ||
    query.includes("gaano kalayo")
  ) {
    return "Travel time depends on where you're coming from: anywhere from 30 minutes (San Jose del Monte) to 2 hours (Metro Manila) by private car. Try the trip planner (/plan-your-trip) and enter your city for a precise, distance-based estimate.";
  }

  const directMatches = findByKeyword(query);
  if (directMatches.length) {
    return `${directMatches[0].name}\n\n${directMatches[0].shortDescription}\n\n${directMatches[0].description}`;
  }

  const categoryHit = Object.entries(categoryMeta).find(([key, meta]) =>
    query.includes(key) || query.includes(meta.label.toLowerCase())
  );
  if (categoryHit) {
    const [key] = categoryHit;
    const matches = destinations.filter((d) => d.category === key);
    return `Here's what we have under ${categoryMeta[key as keyof typeof categoryMeta].label}:\n\n${listSpots(matches)}`;
  }

  return "I'm still learning about all of Norzagaray! That question might be about something outside what's on this website, or something I just don't have info on yet. Try asking about waterfalls, caves, entrance fees, or how to get here, or browse the full Destinations page for details on every spot.";
}
