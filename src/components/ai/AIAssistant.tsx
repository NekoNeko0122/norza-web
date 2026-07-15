"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateAssistantReply, premadeQuestions } from "@/lib/ai-responses";
import AndrewMascot from "./AndrewMascot";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  text: "Hi, I'm Andrew! 🌸 Your Norzagaray guide. Ask me about destinations, fees, or how to get around, or tap a suggestion below.",
};

const STORAGE_KEY = "andrew-chat-v1";
const MIN_REPLY_DELAY = 450;

async function fetchLiveReply(message: string, history: ChatMessage[]): Promise<string | null> {
  try {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: history.slice(-8).map((m) => ({ role: m.role, text: m.text })),
      }),
    });
    if (!res.ok) return null;
    const data: { reply?: unknown } = await res.json();
    return typeof data.reply === "string" && data.reply.trim() ? data.reply : null;
  } catch {
    return null;
  }
}

// minimum visible "typing" delay, kept outside the component (timing math
// can't live in render/hook scope)
async function fetchLiveReplyWithMinDelay(message: string, history: ChatMessage[]): Promise<string | null> {
  const started = Date.now();
  const reply = await fetchLiveReply(message, history);
  const remaining = MIN_REPLY_DELAY - (Date.now() - started);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
  return reply;
}

function loadStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [GREETING];
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // bad storage, just start fresh
  }
  return [GREETING];
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadStoredMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [liveMode, setLiveMode] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // no storage, conversation just won't persist
    }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, typing]);

  async function ask(question: string) {
    if (!question.trim()) return;
    const historySoFar = messages;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const liveReply = await fetchLiveReplyWithMinDelay(question, historySoFar);

    setLiveMode(liveReply !== null);
    const reply = liveReply ?? generateAssistantReply(question);
    const botMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", text: reply };
    setTyping(false);
    setMessages((prev) => [...prev, botMsg]);
  }

  function resetChat() {
    setMessages([GREETING]);
    setLiveMode(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // nothing to clean up
    }
  }

  return (
    <>
      {/* floating bubble: rotating gradient ring behind a glassy core */}
      <div className="fixed bottom-5 right-5 z-[2000] h-14 w-14 sm:bottom-7 sm:right-7">
        <div
          className="animate-spin-slow absolute -inset-[5px] rounded-full opacity-90 blur-[1px]"
          style={{
            background:
              "conic-gradient(from 0deg, var(--color-brand-500), var(--color-gold-400), var(--color-brand-300), var(--color-brand-700), var(--color-brand-500))",
          }}
        />
        <div className="absolute -inset-3 -z-10 rounded-full bg-brand-500/30 blur-xl" />
        <motion.button
          onClick={() => setOpen((o) => !o)}
          animate={open ? { scale: 1, rotate: 0 } : { scale: [1, 1.045, 1] }}
          transition={{ duration: 2.6, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1, rotate: -4 }}
          whileTap={{ scale: 0.92, rotate: 0 }}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-surface shadow-lg shadow-brand-500/30"
          aria-label="Toggle Andrew, the Norzagaray guide assistant"
        >
          <span className="absolute inset-[3px] rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700" />
          <span className="absolute inset-[3px] rounded-full bg-gradient-to-t from-transparent via-transparent to-white/25" />
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <X size={20} className="text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="mascot"
                initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <AndrewMascot size={32} animated />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        {!open && (
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-surface"
          />
        )}
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{ height: "min(32rem, 70vh)", transformOrigin: "bottom right" }}
            className="fixed bottom-24 right-5 z-[2000] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-edge bg-surface shadow-2xl shadow-brand-900/20 sm:bottom-28 sm:right-7"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-4 text-white">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20">
                <AndrewMascot size={26} animated />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold leading-tight">Andrew</p>
                <p className="flex items-center gap-1.5 text-xs text-white/80">
                  <motion.span
                    animate={liveMode ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 1.6, repeat: liveMode ? Infinity : 0, ease: "easeInOut" }}
                    className={cn("h-1.5 w-1.5 rounded-full", liveMode ? "bg-emerald-300" : "bg-white/50")}
                  />
                  {liveMode ? "AI-powered guide" : "Your Norzagaray guide"}
                </p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: -35 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetChat}
                aria-label="Start a new conversation"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <RotateCcw size={15} />
              </motion.button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-tint/40 px-4 py-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className={cn("flex items-end gap-2", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "assistant" && (
                    <span className="mb-0.5 grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-400 to-brand-600">
                      <AndrewMascot size={14} />
                    </span>
                  )}
                  <p
                    className={cn(
                      "max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                      m.role === "user"
                        ? "rounded-br-sm bg-ink text-background"
                        : "rounded-bl-sm border border-edge bg-surface text-ink"
                    )}
                  >
                    {m.text}
                  </p>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-end justify-start gap-2"
                >
                  <span className="mb-0.5 grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-400 to-brand-600">
                    <AndrewMascot size={14} />
                  </span>
                  <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-edge bg-surface px-4 py-3 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-brand-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                      />
                    ))}
                  </span>
                </motion.div>
              )}
            </div>

            <div className="border-t border-edge bg-surface px-3 py-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {premadeQuestions.slice(0, 4).map((q) => (
                  <motion.button
                    key={q.id}
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => ask(q.question)}
                    className="rounded-full border border-edge bg-tint px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-tint-strong dark:text-brand-300"
                  >
                    {q.question}
                  </motion.button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a question..."
                  className="flex-1 rounded-full border border-edge bg-tint/60 px-4 py-2 text-sm text-ink outline-none transition-shadow focus:border-brand-400 focus:shadow-[0_0_0_3px_rgba(216,31,116,0.12)]"
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-white"
                  aria-label="Send"
                >
                  <Send size={15} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
