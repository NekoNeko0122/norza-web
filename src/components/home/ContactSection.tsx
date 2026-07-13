"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Mail, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

const WEB3FORMS_ACCESS_KEY = "f3773848-b384-4135-97bb-77bce309fbef";

// TODO: swap these "#" placeholders for the real profile/account links
const SOCIALS = [
  { label: "Facebook", href: "http://pornhub.com/view_video.php?viewkey=66886d861e118", Icon: FaFacebookF, hoverBg: "hover:bg-[#1877F2]" },
  { label: "Instagram", href: "#", Icon: FaInstagram, hoverBg: "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]" },
  { label: "TikTok", href: "#", Icon: FaTiktok, hoverBg: "hover:bg-[#010101]" },
];

export default function ContactSection() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "New message from Discover Norzagaray",
          from_name: "Discover Norzagaray",
          name: form.name,
          email: form.email,
          subject_line: form.subject,
          message: form.message,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        setForm(EMPTY_FORM);
      } else {
        setStatus("error");
        setError("Something went wrong sending your message. Please try again later.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
            Get in Touch
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Contact the Team
          </h2>
          <p className="mt-4 max-w-md text-ink-soft">
            Spotted an error, have a suggestion, or know a hidden spot? We'd
            love to hear from you — send a message or find us directly below.
          </p>

          <a
            href="mailto:garciababyjane2020@gmail.com"
            className="mt-6 inline-flex items-center gap-2.5 text-sm font-medium text-ink-soft transition-colors hover:text-brand-600"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tint text-brand-600">
              <Mail size={15} />
            </span>
            emailngmgakopal@gmail.com
          </a>

          <a
            href="tel:09696969696"
            className="mt-3 flex items-center gap-2.5 text-sm font-medium text-ink-soft transition-colors hover:text-brand-600"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tint text-brand-600">
              <Phone size={15} />
            </span>
            09696969696
          </a>

          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Message us directly
            </p>
            <div className="mt-4 flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon, hoverBg }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -4, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className={`grid h-12 w-12 place-items-center rounded-full border border-edge bg-surface text-ink-soft shadow-sm transition-colors ${hoverBg} hover:border-transparent hover:text-white`}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 rounded-3xl border border-edge bg-surface p-6 shadow-xl shadow-brand-900/5 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-ink-soft">
                Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={update("name")}
                placeholder="Juan Dela Cruz"
                className="w-full rounded-xl border border-edge bg-tint/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-ink-soft">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-edge bg-tint/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="mb-1.5 block text-xs font-semibold text-ink-soft">
              Subject
            </label>
            <input
              id="subject"
              required
              value={form.subject}
              onChange={update("subject")}
              placeholder="What's this about?"
              className="w-full rounded-xl border border-edge bg-tint/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-xs font-semibold text-ink-soft">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={update("message")}
              placeholder="Tell us more..."
              className="w-full resize-none rounded-xl border border-edge bg-tint/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-400"
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === "sending"}
            whileHover={status !== "sending" ? { scale: 1.02 } : undefined}
            whileTap={status !== "sending" ? { scale: 0.97 } : undefined}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          >
            {status === "sending" ? (
              "Sending…"
            ) : (
              <>
                <Send size={15} /> Send Message
              </>
            )}
          </motion.button>

          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600"
            >
              <CheckCircle2 size={16} /> Message sent! We'll get back to you soon.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600"
            >
              <AlertCircle size={16} /> {error}
            </motion.p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
