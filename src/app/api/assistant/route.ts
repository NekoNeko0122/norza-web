import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { destinations, categoryMeta } from "@/data/destinations";
import { BASE_PACKING_LIST, GENERAL_REMINDERS, ORIGIN_POINTS } from "@/data/tripPlanning";

export const runtime = "nodejs";

function buildSystemPrompt() {
  const destinationLines = destinations
    .map((d) => {
      const parts = [
        `- ${d.name} (${categoryMeta[d.category].label}, Brgy. ${d.barangay})`,
        d.shortDescription,
        `Entrance: ${d.entranceFee ?? "not specified"}`,
        d.openHours ? `Hours: ${d.openHours}` : null,
        d.bestTimeToVisit ? `Best time: ${d.bestTimeToVisit}` : null,
        d.difficulty ? `Difficulty: ${d.difficulty}` : null,
        `Tags: ${d.tags.join(", ")}`,
      ].filter(Boolean);
      return parts.join(" | ");
    })
    .join("\n");

  const travelLines = ORIGIN_POINTS.map(
    (o) => `- From ${o.label}: ~${o.baseTravelMinutes} min by private car (${o.distanceKm} km)`
  ).join("\n");

  return `You are Andrew, a friendly and knowledgeable local guide for "Discover Norzagaray", a tourism website for Norzagaray, Bulacan, Philippines.

Answer questions about visiting Norzagaray using ONLY the destination facts listed below. Never invent entrance fees, hours, or details that aren't given. If a question is about Norzagaray but the answer isn't in the facts below, or the question is about something else entirely (unrelated to this website), say plainly that you don't have that information here rather than guessing, and gently steer back to what you can help with.

Keep replies conversational and concise, a few short sentences or a short bullet list, since this is a chat widget, not an essay. When relevant, point people to the Destinations page (/destinations) or the trip planner (/plan-your-trip).

If the user just greets you ("hi", "hello") or makes small talk, respond warmly like a normal assistant would: greet them back and ask what they'd like to do (explore destinations, plan a trip, ask about something specific) rather than immediately dumping information. Only give detailed facts or lists once they've actually asked for something. Any harmless casual conversation (how are you, jokes, thanks, "what can you do", chit-chat) deserves a genuine, friendly reply, not a refusal or a canned redirect. You can still nudge back toward Norzagaray afterward if it fits naturally.

Many visitors are Filipino and may write in Tagalog or Taglish (mixed Tagalog/English). Understand Tagalog fully, and reply in whatever language or mix the user used: if they write in Tagalog, reply in natural Tagalog or Taglish; if English, reply in English.

DESTINATIONS:
${destinationLines}

TYPICAL TRAVEL TIME (private car):
${travelLines}

GENERAL PACKING TIPS: ${BASE_PACKING_LIST.join("; ")}

GENERAL REMINDERS: ${GENERAL_REMINDERS.join(" ")}`;
}

interface HistoryMessage {
  role: "user" | "assistant";
  text: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { message?: string; history?: HistoryMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }

  try {
    const client = new Groq({ apiKey });

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: buildSystemPrompt() },
      ...(body.history ?? []).slice(-8).map((m) => ({
        role: m.role,
        content: m.text,
      })),
      { role: "user", content: message },
    ];

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 500,
      messages,
    });

    const reply = response.choices[0]?.message?.content ?? "";

    if (!reply) {
      return NextResponse.json({ error: "empty_reply" }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Assistant API error:", err);
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }
}
