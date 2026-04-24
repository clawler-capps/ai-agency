"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    question: "What best describes your business?",
    options: [
      { label: "A", text: "Construction / trades / ADU builder / real estate" },
      { label: "B", text: "Professional services (law, CPA, insurance)" },
      { label: "C", text: "Healthcare practice (multi-location)" },
      { label: "D", text: "Franchise group / manufacturing / agriculture" },
    ],
  },
  {
    id: 2,
    question: "How many hours per week does your team spend on repetitive, manual tasks?",
    options: [
      { label: "A", text: "Less than 5 hours — we're pretty automated" },
      { label: "B", text: "5–15 hours" },
      { label: "C", text: "15–30 hours" },
      { label: "D", text: "More than 30 hours — it's a real problem" },
    ],
  },
  {
    id: 3,
    question: "How do you currently handle new lead follow-up?",
    options: [
      { label: "A", text: "Manually when I see it — often hours or days later" },
      { label: "B", text: "A team member follows up but it's inconsistent" },
      { label: "C", text: "Basic CRM with some automation" },
      { label: "D", text: "Well-automated — leads get a response in minutes" },
    ],
  },
  {
    id: 4,
    question: "How does your team track performance and reporting?",
    options: [
      { label: "A", text: "Copy-pasting from 4 different systems into a spreadsheet" },
      { label: "B", text: "Disconnected tools — GA, QuickBooks, spreadsheets" },
      { label: "C", text: "Some dashboards but they're outdated or manual" },
      { label: "D", text: "Automated, real-time dashboards I check daily" },
    ],
  },
  {
    id: 5,
    question: "What happens with your meeting notes and action items?",
    options: [
      { label: "A", text: "Notes don't get taken — decisions get forgotten" },
      { label: "B", text: "Someone takes notes but they're never organized" },
      { label: "C", text: "We have a system but action items still get lost" },
      { label: "D", text: "Action items are automatically tracked and assigned" },
    ],
  },
  {
    id: 6,
    question: "What's your biggest blocker with AI/automation?",
    options: [
      { label: "A", text: "I don't know where to start or what would actually help" },
      { label: "B", text: "I've tried tools but couldn't get reliable results" },
      { label: "C", text: "I need to see clear ROI before I commit" },
      { label: "D", text: "I need help getting my team to adopt new tools" },
    ],
  },
  {
    id: 7,
    question: "If you could eliminate ONE type of task from your week, what would it be?",
    options: [
      { label: "A", text: "Manual data entry, copy-pasting, file management" },
      { label: "B", text: "Scheduling, follow-ups, appointment reminders" },
      { label: "C", text: "Pulling together reports and analytics" },
      { label: "D", text: "Answering the same customer questions over and over" },
    ],
  },
];

type Answer = { questionId: number; label: string };

export default function AssessmentForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = questions.length;
  const currentQuestion = questions[step - 1];
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100);

  function handleNext() {
    if (!selectedOption) return;
    setAnswers((prev) => {
      const without = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [...without, { questionId: currentQuestion.id, label: selectedOption }];
    });
    setSelectedOption(null);
    setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => s - 1);
    setSelectedOption(null);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const score = answers.filter((a) => a.label === "A" || a.label === "B").length;
    try {
      await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, assessmentScore: score, answers }),
      });
    } catch {
      // Non-blocking — proceed to results
    } finally {
      setSubmitting(false);
      setStep(9);
    }
  }

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="text-center py-12">
        <p className="eyebrow mb-6">Free · 5 minutes · No tech knowledge needed</p>
        <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-5">
          Free AI Opportunity Assessment
        </h1>
        <p className="text-lg text-muted max-w-lg mx-auto mb-10 leading-relaxed">
          Answer 7 questions about how your business runs. We&apos;ll show you exactly
          where AI can save the most time and money.
        </p>
        <button onClick={() => setStep(1)} className="btn-primary text-base px-10 py-4">
          Start the Assessment →
        </button>
      </div>
    );
  }

  // ── Questions ──────────────────────────────────────────────────────────────
  if (step >= 1 && step <= totalSteps) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-mono text-muted mb-2">
            <span>Question {step} of {totalSteps}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6 text-balance">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedOption(opt.label)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 ${
                  selectedOption === opt.label
                    ? "border-accent bg-accent/light text-ink"
                    : "border-border bg-cream hover:border-ink/20 text-ink/80"
                }`}
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono font-bold mr-3 ${
                  selectedOption === opt.label
                    ? "bg-accent text-white"
                    : "bg-border text-muted"
                }`}>
                  {opt.label}
                </span>
                {opt.text}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            {step > 1 ? (
              <button onClick={handleBack} className="btn-ghost text-sm">
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className="btn-primary px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === totalSteps ? "See My Results →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Email capture ──────────────────────────────────────────────────────────
  if (step === totalSteps + 1) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-8 text-center">
          <p className="eyebrow mb-4">Almost there</p>
          <h2 className="text-2xl font-bold text-ink mb-2">Unlock your results</h2>
          <p className="text-muted text-sm mb-8 leading-relaxed">
            Enter your name and email to get your personalized AI opportunity summary —
            and we&apos;ll send you a copy.
          </p>
          <form onSubmit={handleEmailSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@yourbusiness.com"
                className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Show My Results →"}
            </button>
            <p className="text-xs text-muted text-center font-mono">
              NO SPAM. UNSUBSCRIBE ANY TIME.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (step === 9) {
    const highOpportunityCount = answers.filter((a) => a.label === "A" || a.label === "B").length;
    const level = highOpportunityCount >= 5 ? "High" : highOpportunityCount >= 3 ? "Medium" : "Early Stage";
    const levelColor = level === "High" ? "text-accent" : level === "Medium" ? "text-blue-DEFAULT" : "text-muted";

    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 mb-6">
          <p className="eyebrow mb-4">
            {name ? `${name}'s` : "Your"} Assessment Results
          </p>
          <h2 className="text-2xl font-bold text-ink mb-6">Your AI Opportunity Summary</h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-paper rounded-xl p-4 text-center border border-border">
              <div className={`text-2xl font-black ${levelColor}`}>{level}</div>
              <div className="text-xs text-muted font-mono mt-1">AI OPPORTUNITY</div>
            </div>
            <div className="bg-paper rounded-xl p-4 text-center border border-border">
              <div className="text-2xl font-black text-ink">{highOpportunityCount * 5}+</div>
              <div className="text-xs text-muted font-mono mt-1">HRS/MO TO SAVE</div>
            </div>
            <div className="bg-paper rounded-xl p-4 text-center border border-border">
              <div className="text-2xl font-black text-green-DEFAULT">${(highOpportunityCount * 500).toLocaleString()}+</div>
              <div className="text-xs text-muted font-mono mt-1">EST. MONTHLY VALUE</div>
            </div>
          </div>

          <div className="bg-green-light border border-green-border rounded-xl p-5 mb-8">
            <p className="text-sm font-semibold text-ink mb-2">What this means:</p>
            <p className="text-sm text-ink/80 leading-relaxed">
              {level === "High"
                ? "You have multiple high-impact automation opportunities. Many are quick wins you can act on this week."
                : level === "Medium"
                ? "You have solid automation opportunities. A full assessment will identify the fastest paths to ROI."
                : "You're more automated than most. A full assessment will find the remaining gaps."}
            </p>
            <p className="mt-3 text-xs text-muted font-mono italic">
              * PLACEHOLDER RESULTS — real scoring logic to be added before launch.
            </p>
          </div>

          <div className="text-center">
            <p className="text-ink font-semibold mb-4">
              Want your complete AI roadmap with exact ROI numbers?
            </p>
            <Link href="/pricing" className="btn-primary text-base px-8 py-4 inline-flex">
              Book Your Full Assessment — $1,000
            </Link>
            <p className="mt-3 text-sm text-muted">
              20–30 min interview · Gamma report · 30-min follow-up call
            </p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            Or book a free intro call first
          </a>
        </div>
      </div>
    );
  }

  return null;
}
