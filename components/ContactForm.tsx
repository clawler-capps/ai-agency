"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  company: string;
  question: string;
  // Honeypots — kept empty by real users, hidden from view. Bots that
  // auto-fill every field give themselves away by populating these.
  website: string;
  fax: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  question: "",
  website: "",
  fax: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "Please enter a valid email address.";
    if (!form.question.trim()) return "Please include a short message.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Thank-you card ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto animate-fade-up">
        <div className="card p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/light">
            <svg
              className="h-8 w-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-3">
            Message received, {form.name.trim().split(" ")[0] || "there"}!
          </h2>
          <p className="text-muted leading-relaxed">
            Thanks for reaching out — it landed with us. We read every note personally
            and will get back to you as soon as we can, usually within a business day
            or two.
          </p>
        </div>
      </div>
    );
  }

  // ── Contact form ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto" noValidate>
      <div className="card p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            maxLength={120}
            placeholder="Jane Smith"
            className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            maxLength={200}
            placeholder="jane@yourbusiness.com"
            className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
          />
          <p className="mt-1.5 text-xs text-muted">
            This is just so we can write back — we never share it.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Company{" "}
            <span className="text-xs font-normal font-mono text-muted">(optional)</span>
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            maxLength={200}
            placeholder="Your business or organization"
            className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            How can we help? <span className="text-accent">*</span>
          </label>
          <textarea
            value={form.question}
            onChange={(e) => update("question", e.target.value)}
            required
            rows={5}
            maxLength={5000}
            placeholder="Tell us what's on your mind — a question, a project, anything at all."
            className="w-full resize-y px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors leading-relaxed"
          />
        </div>

        {/* Honeypots — visually hidden, off-screen, ignored by real users. Real
            people never see or fill these; bots that auto-complete every field
            populate them and get silently dropped server-side. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </label>
          <label>
            Fax
            <input
              type="text"
              name="fax"
              tabIndex={-1}
              autoComplete="off"
              value={form.fax}
              onChange={(e) => update("fax", e.target.value)}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-accent/30 bg-accent/light px-4 py-3 text-sm text-accent font-medium">
          {error}
        </div>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending…" : "Send message →"}
        </button>
        <p className="mt-3 text-center text-xs text-muted font-mono">
          WE READ EVERY NOTE · NO SPAM, EVER
        </p>
      </div>
    </form>
  );
}
