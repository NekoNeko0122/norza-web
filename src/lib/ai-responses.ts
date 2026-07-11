import { destinations, categoryMeta, type Destination } from "@/data/destinations";

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
    .map((d) => `• ${d.name} — ${d.shortDescription}`)
    .join("\n");
}

function findByKeyword(query: string): Destination[] {
  const q = query.toLowerCase();
  return destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.tags.some((t) => t.includes(q)) ||
      d.category.includes(q)
  );
}

export function generateAssistantReply(rawQuery: string): string {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return "Ask me anything about Norzagaray's destinations, or tap one of the suggestions below!";
  }

  if (query.includes("must") || query.includes("best") || query.includes("top")) {
    const featured = destinations.filter((d) => d.featured);
    return `Here are Norzagaray's must-visit spots:\n\n${listSpots(featured)}\n\nWant directions or details? Open any of these from the Destinations page.`;
  }

  if (query.includes("waterfall") || query.includes("falls") || query.includes("swim") || query.includes("river")) {
    const matches = destinations.filter(
      (d) => d.category === "nature" || d.tags.includes("swimming") || d.tags.includes("river")
    );
    return `Great choice — Norzagaray has some beautiful rivers and falls:\n\n${listSpots(matches)}\n\nBest visited in summer (March–May) when the water is clearest.`;
  }

  if (query.includes("how") && (query.includes("get") || query.includes("go") || query.includes("manila") || query.includes("travel"))) {
    return "Norzagaray is about an hour's drive from Metro Manila via NLEX (San Jose del Monte exit) or through Bocaue/Sta. Maria. Public commuters can ride a bus or van to San Jose del Monte or Bocaue, then transfer to a Norzagaray-bound jeepney or UV Express. Many of the nature spots (rivers, falls, view decks) are best reached with a private vehicle or habal-habal from the town proper.";
  }

  if (query.includes("cave") || query.includes("pinagrealan")) {
    const cave = destinations.find((d) => d.slug === "pinagrealan-cave");
    if (cave) {
      return `${cave.name}\n\n${cave.description}\n\nEntrance fee: ${cave.entranceFee}\nOpen: ${cave.openHours}`;
    }
  }

  if (query.includes("fee") || query.includes("cost") || query.includes("price") || query.includes("budget")) {
    const withFees = destinations.filter((d) => d.entranceFee && d.entranceFee !== "Free");
    return `Most spots charge a small entrance or environmental fee, usually ₱5–₱60:\n\n${withFees
      .map((d) => `• ${d.name} — ${d.entranceFee}`)
      .join("\n")}`;
  }

  if (query.includes("free")) {
    const free = destinations.filter((d) => d.entranceFee === "Free" || !d.entranceFee);
    if (free.length) {
      return `These spots are free to visit:\n\n${listSpots(free)}`;
    }
    return "Most destinations charge a small entrance fee (usually ₱5–₱60), but visiting the town proper and St. Andrew the Apostle Parish is free.";
  }

  if (query.includes("family") || query.includes("kids") || query.includes("child")) {
    const family = destinations.filter((d) => d.difficulty === "easy");
    return `For an easygoing family trip, try:\n\n${listSpots(family)}\n\nThese have gentler terrain and easier access than the hiking/spelunking spots.`;
  }

  if (query.includes("church") || query.includes("religious") || query.includes("heritage") || query.includes("history")) {
    const heritage = destinations.filter((d) => d.category === "religious" || d.category === "heritage");
    return `For history and heritage:\n\n${listSpots(heritage)}`;
  }

  // Try to match a specific destination or category by keyword
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

  return "I'm still learning about all of Norzagaray! Try asking about waterfalls, caves, entrance fees, or how to get here — or browse the full Destinations page for details on every spot.";
}
