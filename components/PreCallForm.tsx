"use client";

import { useState } from "react";

type LongQuestion = {
  id: keyof FormState;
  label: string;
  hint?: string;
  optional?: boolean;
  type: "long" | "short";
};

// The nine long/short questions, in order. The 1–5 comfort scale (Q6) is
// rendered separately as a button row.
const longQuestions: LongQuestion[] = [
  {
    id: "business",
    label: "What does your business(es) do and who do you serve?",
    type: "long",
  },
  {
    id: "hoursPerWeek",
    label: "Roughly how many hours per week do you personally work?",
    type: "short",
  },
  {
    id: "timeDrains",
    label: "What are your top 2–3 biggest time drains right now?",
    hint: "List the tasks, not just categories.",
    type: "long",
  },
  {
    id: "tools",
    label: "What tools and software does your business currently use?",
    hint: "List everything — CRM, scheduling, email, project management, billing, etc.",
    type: "long",
  },
  {
    id: "aiTools",
    label: "Are you currently using any AI tools? If so, which ones and for what?",
    hint: "Optional — leave blank if you're not using any yet.",
    optional: true,
    type: "long",
  },
  {
    id: "automationBlocker",
    label:
      "Is there something you know should be automated or systematized but hasn't been? What's the reason it hasn't happened yet?",
    type: "long",
  },
  {
    id: "team",
    label: "Do you have a team? If so, how many people and what are their main roles?",
    type: "long",
  },
  {
    id: "goals",
    label: "Generally, what are you hoping to get out of this conversation?",
    type: "long",
  },
];

const comfortLabels: Record<number, string> = {
  1: "I avoid it",
  5: "I love testing tools",
};

type FormState = {
  name: string;
  email: string;
  business: string;
  hoursPerWeek: string;
  timeDrains: string;
  tools: string;
  aiTools: string;
  comfortLevel: number | null;
  automationBlocker: string;
  team: string;
  goals: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  business: "",
  hoursPerWeek: "",
  timeDrains: "",
  tools: "",
  aiTools: "",
  comfortLevel: null,
  automationBlocker: "",
  team: "",
  goals: "",
};

export default function PreCallForm() {
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
    for (const q of longQuestions) {
      if (q.optional) continue;
      if (!String(form[q.id]).trim()) return "Please answer all required questions.";
    }
    if (form.comfortLevel === null)
      return "Please rate how comfortable you are with new software.";
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
      const res = await fetch("/api/questionnaire", {
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
          : "We couldn't submit your answers. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Thank-you card ───────────────────────────────────────────────────────────
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
            Thank you, {form.name.trim().split(" ")[0] || "there"}!
          </h2>
          <p className="text-muted leading-relaxed">
            We&apos;ve received your answers and can&apos;t wait to connect. You&apos;ll
            hear from us soon.
          </p>
        </div>
      </div>
    );
  }

  // ── Questionnaire ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Contact */}
      <div className="card p-6 sm:p-8">
        <h2 className="text-lg font-bold text-ink mb-5">Your details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
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
              placeholder="jane@yourbusiness.com"
              className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Questions 1–5 */}
      {longQuestions.slice(0, 5).map((q, i) => (
        <QuestionCard key={q.id} q={q} index={i + 1} form={form} update={update} />
      ))}

      {/* Question 6 — comfort scale */}
      <div className="card p-6 sm:p-8">
        <fieldset>
          <legend className="text-base font-bold text-ink mb-1.5">
            <span className="font-mono text-accent mr-2">6.</span>
            On a scale of 1–5, how comfortable are you with new software?{" "}
            <span className="text-accent">*</span>
          </legend>
          <p className="text-sm text-muted mb-5">
            1 = I avoid it, 5 = I love testing tools.
          </p>
          <div className="flex gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((n) => {
              const selected = form.comfortLevel === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => update("comfortLevel", n)}
                  aria-pressed={selected}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-xl border py-4 transition-all duration-150 ${
                    selected
                      ? "border-accent bg-accent text-white shadow-sm"
                      : "border-border bg-paper text-ink/70 hover:border-ink/20 hover:bg-cream"
                  }`}
                >
                  <span className="text-xl font-black">{n}</span>
                  {comfortLabels[n] && (
                    <span
                      className={`text-[10px] sm:text-xs font-mono leading-tight text-center px-1 ${
                        selected ? "text-white/80" : "text-muted"
                      }`}
                    >
                      {comfortLabels[n]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Questions 7–9 */}
      {longQuestions.slice(5).map((q, i) => (
        <QuestionCard key={q.id} q={q} index={i + 7} form={form} update={update} />
      ))}

      {/* Error + submit */}
      {error && (
        <div className="rounded-xl border border-accent/30 bg-accent/light px-4 py-3 text-sm text-accent font-medium">
          {error}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit answers →"}
        </button>
        <p className="mt-3 text-center text-xs text-muted font-mono">
          TAKES ABOUT 5 MINUTES · YOUR ANSWERS STAY PRIVATE
        </p>
      </div>
    </form>
  );
}

function QuestionCard({
  q,
  index,
  form,
  update,
}: {
  q: LongQuestion;
  index: number;
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <div className="card p-6 sm:p-8">
      <label className="block">
        <span className="text-base font-bold text-ink text-balance">
          <span className="font-mono text-accent mr-2">{index}.</span>
          {q.label}{" "}
          {q.optional ? (
            <span className="text-xs font-normal font-mono text-muted">(optional)</span>
          ) : (
            <span className="text-accent">*</span>
          )}
        </span>
        {q.hint && <span className="mt-1.5 block text-sm text-muted">{q.hint}</span>}
        {q.type === "long" ? (
          <textarea
            value={String(form[q.id])}
            onChange={(e) => update(q.id, e.target.value as FormState[typeof q.id])}
            rows={4}
            required={!q.optional}
            className="mt-4 w-full resize-y px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors leading-relaxed"
          />
        ) : (
          <input
            type="text"
            value={String(form[q.id])}
            onChange={(e) => update(q.id, e.target.value as FormState[typeof q.id])}
            required={!q.optional}
            placeholder="e.g. 50"
            className="mt-4 w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
          />
        )}
      </label>
    </div>
  );
}
