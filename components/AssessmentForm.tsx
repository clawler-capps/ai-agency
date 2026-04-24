"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    question: "What best describes your business?",
    options: [
      { label: "A", text: "Real estate / mortgage / title" },
      { label: "B", text: "Professional services (law, accounting, consulting)" },
      { label: "C", text: "Home services / contractors / trades" },
      { label: "D", text: "E-commerce / retail / hospitality" },
    ],
  },
  {
    id: 2,
    question: "How many hours per week does your team spend on repetitive, manual tasks?",
    options: [
      { label: "A", text: "Less than 5 hours" },
      { label: "B", text: "5–15 hours" },
      { label: "C", text: "15–30 hours" },
      { label: "D", text: "More than 30 hours" },
    ],
  },
  {
    id: 3,
    question: "How do you currently handle new lead follow-up?",
    options: [
      { label: "A", text: "I respond manually when I see it (often hours or days later)" },
      { label: "B", text: "I have a team member who follows up, but it's inconsistent" },
      { label: "C", text: "I use a basic CRM with some automation" },
      { label: "D", text: "I have a well-automated, fast follow-up system" },
    ],
  },
  {
    id: 4,
    question: "How do you track business performance and reporting?",
    options: [
      { label: "A", text: "Mostly in my head or spreadsheets I update manually" },
      { label: "B", text: "I use a few disconnected tools (GA, QuickBooks, etc.)" },
      { label: "C", text: "I have some dashboards but they're outdated or hard to use" },
      { label: "D", text: "I have automated, real-time reporting I check regularly" },
    ],
  },
  {
    id: 5,
    question: "How does your team handle repetitive customer questions?",
    options: [
      { label: "A", text: "We answer every question manually, same ones over and over" },
      { label: "B", text: "We have a FAQ page but still get lots of the same questions" },
      { label: "C", text: "We have templates but still customize each response" },
      { label: "D", text: "We have automation handling most common questions" },
    ],
  },
  {
    id: 6,
    question: "What's your biggest blocker when it comes to AI/automation?",
    options: [
      { label: "A", text: "I don't know where to start or what would actually help" },
      { label: "B", text: "I've tried tools but couldn't get them to work reliably" },
      { label: "C", text: "I'm worried about cost vs. return on investment" },
      { label: "D", text: "I need help convincing my team or partners to adopt new tools" },
    ],
  },
  {
    id: 7,
    question: "If you could eliminate ONE type of task from your week, what would it be?",
    options: [
      { label: "A", text: "Data entry, copy-pasting, and manual file management" },
      { label: "B", text: "Scheduling, follow-ups, and appointment reminders" },
      { label: "C", text: "Reporting, analytics, and pulling numbers together" },
      { label: "D", text: "Answering repetitive emails, texts, or DMs" },
    ],
  },
];

type Answer = { questionId: number; label: string };

export default function AssessmentForm() {
  const [step, setStep] = useState(0); // 0 = intro, 1–7 = questions, 8 = email, 9 = results
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuestion = questions[step - 1];
  const totalSteps = questions.length;
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100);

  function handleStart() {
    setStep(1);
  }

  function handleOptionSelect(label: string) {
    setSelectedOption(label);
  }

  function handleNext() {
    if (!selectedOption) return;
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, label: selectedOption }]);
    setSelectedOption(null);
    setStep((s) => s + 1);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const score = answers.filter((a) => a.label === "A" || a.label === "B").length;

    try {
      await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, assessmentScore: score, answers }),
      });
    } catch {
      // Non-blocking — show results regardless
    } finally {
      setSubmitting(false);
      setStep(9);
    }
  }

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 text-3xl mb-6">🤖</div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Free AI Opportunity Assessment
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-2">
          Answer 7 quick questions about your business. In 5 minutes we'll show
          you exactly where AI can save you the most time and money.
        </p>
        <p className="text-sm text-gray-500 mb-10">No tech knowledge required.</p>
        <button onClick={handleStart} className="btn-primary text-base px-10 py-4">
          Start the Assessment →
        </button>
      </div>
    );
  }

  // ── Questions ──────────────────────────────────────────────────────────────
  if (step >= 1 && step <= totalSteps) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Question {step} of {totalSteps}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-teal rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="card-surface p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-balance">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleOptionSelect(opt.label)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 ${
                  selectedOption === opt.label
                    ? "border-accent bg-accent/15 text-white"
                    : "border-surface-border bg-surface hover:border-accent/40 hover:bg-surface-elevated text-gray-300"
                }`}
              >
                <span className={`inline-block w-6 h-6 rounded-md text-xs font-bold mr-3 text-center leading-6 ${
                  selectedOption === opt.label ? "bg-accent text-white" : "bg-surface-border text-gray-400"
                }`}>
                  {opt.label}
                </span>
                {opt.text}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            {step > 1 ? (
              <button
                onClick={() => { setStep((s) => s - 1); setSelectedOption(null); }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            ) : <span />}
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className="btn-primary px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === totalSteps ? "See My Results →" : "Next Question →"}
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
        <div className="card-surface p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal/15 text-3xl flex items-center justify-center mx-auto mb-6">📬</div>
          <h2 className="text-2xl font-bold mb-2">Almost there!</h2>
          <p className="text-gray-400 mb-8">
            Enter your name and email to unlock your personalized AI opportunity
            summary.
          </p>
          <form onSubmit={handleEmailSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@yourbusiness.com"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-border text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            {submitError && <p className="text-sm text-red-400">{submitError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Show My Results →"}
            </button>
            <p className="text-xs text-gray-500 text-center">
              No spam. Unsubscribe any time.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (step === 9) {
    const highOpportunityCount = answers.filter(
      (a) => a.label === "A" || a.label === "B"
    ).length;
    const opportunityLevel =
      highOpportunityCount >= 5 ? "High" : highOpportunityCount >= 3 ? "Medium" : "Low";
    const opportunityColor =
      opportunityLevel === "High" ? "text-teal" : opportunityLevel === "Medium" ? "text-accent" : "text-gray-400";

    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-surface p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-teal/15 text-3xl flex items-center justify-center mx-auto mb-4">📈</div>
            <h2 className="text-2xl font-bold mb-2">
              {name ? `${name}, here's your summary` : "Your AI Opportunity Summary"}
            </h2>
            <p className="text-gray-400">Based on your answers, here's what we found:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-surface rounded-xl p-4 text-center">
              <div className={`text-3xl font-black ${opportunityColor}`}>{opportunityLevel}</div>
              <div className="text-xs text-gray-400 mt-1">AI Opportunity</div>
            </div>
            <div className="bg-surface rounded-xl p-4 text-center">
              <div className="text-3xl font-black gradient-text">{highOpportunityCount * 5}+</div>
              <div className="text-xs text-gray-400 mt-1">Est. hrs/mo to save</div>
            </div>
            <div className="bg-surface rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-teal">${(highOpportunityCount * 500).toLocaleString()}+</div>
              <div className="text-xs text-gray-400 mt-1">Est. monthly value</div>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-5 border border-accent/20 mb-8">
            <h3 className="font-semibold mb-3">
              {/* Placeholder — Tyler will replace with real scoring logic */}
              What this means for your business:
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-teal mt-0.5">✓</span>
                {opportunityLevel === "High"
                  ? "You have multiple high-impact automation opportunities — many of them are quick wins you can act on this week."
                  : opportunityLevel === "Medium"
                  ? "You have solid automation opportunities. A structured assessment will identify the fastest paths to ROI."
                  : "You're more automated than most — a full assessment will help you optimize and find the gaps."}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal mt-0.5">✓</span>
                This is a preliminary estimate. A full AI Business Assessment maps every process in detail and delivers exact ROI projections.
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-500 italic">
              * Placeholder results — Tyler will wire up real scoring logic before launch.
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-300 mb-4 font-medium">
              Want the full picture? Get your complete AI roadmap.
            </p>
            <Link href="/pricing" className="btn-primary text-base px-8 py-4 inline-flex">
              Book Your Full Assessment — $1,000
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Includes 30-min interview, detailed report, and follow-up call.
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
