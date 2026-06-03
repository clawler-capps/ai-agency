"use client";

import { useEffect, useRef, useState } from "react";

// ── Step definitions (11 total) ───────────────────────────────────────────────
type StepType = "text" | "email" | "textarea" | "scale";

type Step = {
  key: keyof FormData;
  type: StepType;
  title: string;
  hint?: string;
  placeholder?: string;
  required: boolean;
};

const STEPS: Step[] = [
  { key: "name", type: "text", title: "What's your name?", placeholder: "Jane Smith", required: true },
  { key: "email", type: "email", title: "What's your email?", placeholder: "jane@yourbusiness.com", required: true },
  {
    key: "business",
    type: "textarea",
    title: "What does your business(s) do and who do you serve?",
    required: true,
  },
  {
    key: "hoursPerWeek",
    type: "text",
    title: "Roughly how many hours per week do you personally work?",
    placeholder: "e.g. 50",
    required: true,
  },
  {
    key: "timeDrains",
    type: "textarea",
    title: "What are your top 2–3 biggest time drains right now?",
    hint: "List the tasks, not just categories.",
    required: true,
  },
  {
    key: "tools",
    type: "textarea",
    title: "What tools and software does your business currently use?",
    hint: "List everything — CRM, scheduling, email, project management, billing, etc.",
    required: true,
  },
  {
    key: "aiTools",
    type: "textarea",
    title: "Are you currently using any AI tools? If so, which ones and for what?",
    hint: "Optional — leave blank if you're not using any yet.",
    required: false,
  },
  {
    key: "comfortLevel",
    type: "scale",
    title: "On a scale of 1–5, how comfortable are you with new software?",
    hint: "1 = I avoid it · 5 = I love testing tools",
    required: true,
  },
  {
    key: "automationBlocker",
    type: "textarea",
    title: "Is there something you know should be automated or systematized but hasn't been?",
    hint: "What's the reason it hasn't happened yet?",
    required: true,
  },
  {
    key: "team",
    type: "textarea",
    title: "Do you have a team? If so, how many people and what are their main roles?",
    required: true,
  },
  {
    key: "goals",
    type: "textarea",
    title: "Generally, what are you hoping to get out of this conversation?",
    required: true,
  },
];

type FormData = {
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

const initialData: FormData = {
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

const TRANSITION_MS = 200;

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const totalSteps = STEPS.length;
  const step = STEPS[currentStep];
  const isLast = currentStep === totalSteps - 1;
  // Fills as the user progresses, reaching 100% on the final step.
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Hidden, share-only page: keep title + noindex without a server metadata
  // export (impossible in a client component).
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Pre-Call Questionnaire — Capps AI";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      document.head.removeChild(meta);
    };
  }, []);

  // Focus the active field after each transition settles.
  useEffect(() => {
    if (visible && !submitted) fieldRef.current?.focus();
  }, [visible, currentStep, submitted]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function transitionTo(change: () => void) {
    setError(null);
    setVisible(false);
    window.setTimeout(() => {
      change();
      setVisible(true);
    }, TRANSITION_MS);
  }

  function validateStep(index: number): string | null {
    const s = STEPS[index];
    if (s.type === "scale") {
      return s.required && data.comfortLevel === null ? "Please pick a number." : null;
    }
    if (!s.required) return null;
    const value = String(data[s.key] ?? "").trim();
    if (!value) return "This field is required.";
    if (s.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address.";
    }
    return null;
  }

  function handleNext() {
    const err = validateStep(currentStep);
    if (err) {
      setError(err);
      return;
    }
    if (!isLast) transitionTo(() => setCurrentStep((s) => s + 1));
  }

  function handleBack() {
    if (currentStep > 0) transitionTo(() => setCurrentStep((s) => s - 1));
  }

  function handleScale(n: number) {
    update("comfortLevel", n);
    setError(null);
    transitionTo(() => setCurrentStep((s) => s + 1));
  }

  async function handleSubmit() {
    const err = validateStep(currentStep);
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Something went wrong.");
      }
      setSubmitted(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "We couldn't submit your answers. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Enter advances on single-line fields; on textareas, Enter adds a newline and
  // Cmd/Ctrl+Enter advances (or submits on the last step).
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter") return;
    if (step.type === "textarea") {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        isLast ? handleSubmit() : handleNext();
      }
      return;
    }
    e.preventDefault();
    isLast ? handleSubmit() : handleNext();
  }

  return (
    <div className="relative min-h-screen bg-paper bg-hero-texture">
      {/* Progress bar — full width, very top of page */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-border">
        <div
          className="h-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Brand mark */}
      <div className="fixed top-5 left-5 z-40 flex items-center gap-1.5">
        <span className="text-lg font-bold text-ink tracking-tight">Capps</span>
        <span className="text-lg font-bold text-accent tracking-tight">AI</span>
      </div>

      <div className="flex min-h-screen items-center justify-center px-5 py-24 sm:px-8">
        {submitted ? (
          <div className="w-full max-w-xl animate-fade-up">
            <div className="card p-10 sm:p-14 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/light">
                <svg
                  className="h-8 w-8 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-3">
                Thank you, {data.name.trim().split(" ")[0] || "there"}!
              </h1>
              <p className="text-muted leading-relaxed">
                We&apos;ve received your answers and will come to our call ready. You&apos;ll
                hear from us soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Back */}
            <div className="mb-6 h-6">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm font-medium text-muted hover:text-ink transition-colors"
                >
                  ← Back
                </button>
              )}
            </div>

            {/* Card content (fade + slide) */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
              }}
            >
              <p className="eyebrow mb-4">
                {currentStep + 1} of {totalSteps}
              </p>

              <label
                htmlFor={`field-${step.key}`}
                className="block text-2xl sm:text-3xl font-black text-ink tracking-tight text-balance leading-snug"
              >
                {step.title}
              </label>

              {step.hint && (
                <p className="mt-3 text-base text-muted leading-relaxed">{step.hint}</p>
              )}

              {/* Field */}
              <div className="mt-8">
                {step.type === "textarea" && (
                  <textarea
                    id={`field-${step.key}`}
                    ref={(el) => {
                      fieldRef.current = el;
                    }}
                    value={String(data[step.key] ?? "")}
                    onChange={(e) => update(step.key, e.target.value as FormData[typeof step.key])}
                    onKeyDown={handleKeyDown}
                    rows={4}
                    placeholder="Type your answer here…"
                    className="w-full resize-y rounded-2xl border border-border bg-cream px-5 py-4 text-lg leading-relaxed text-ink placeholder-muted/40 focus:border-accent focus:outline-none transition-colors"
                  />
                )}

                {(step.type === "text" || step.type === "email") && (
                  <input
                    id={`field-${step.key}`}
                    ref={(el) => {
                      fieldRef.current = el;
                    }}
                    type={step.type}
                    value={String(data[step.key] ?? "")}
                    onChange={(e) => update(step.key, e.target.value as FormData[typeof step.key])}
                    onKeyDown={handleKeyDown}
                    placeholder={step.placeholder}
                    className="w-full border-b-2 border-border bg-transparent px-1 py-3 text-xl sm:text-2xl text-ink placeholder-muted/40 focus:border-accent focus:outline-none transition-colors"
                  />
                )}

                {step.type === "scale" && (
                  <div className="flex gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const selected = data.comfortLevel === n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => handleScale(n)}
                          aria-pressed={selected}
                          className={`flex-1 rounded-2xl border py-6 text-2xl font-black transition-all duration-150 ${
                            selected
                              ? "border-accent bg-accent text-white shadow-sm"
                              : "border-border bg-cream text-ink/70 hover:border-ink/20 hover:bg-paper"
                          }`}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="mt-4 text-sm font-medium text-accent">{error}</p>
              )}

              {/* Actions */}
              {step.type !== "scale" && (
                <div className="mt-8">
                  {isLast ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn-primary px-8 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting…" : "Submit →"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary px-8 py-4 text-base"
                    >
                      Next →
                    </button>
                  )}

                  {/* Enter hint — single-line fields only */}
                  {step.type !== "textarea" && (
                    <p className="mt-3 text-xs text-muted font-mono">
                      Press Enter ↵
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
