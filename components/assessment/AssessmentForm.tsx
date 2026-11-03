"use client";

import { useEffect, useMemo, useState } from "react";
import { questions } from "./questions";
import { Answer, AssessmentResult, scoreAssessment, TIER_META, PILLAR_LABELS } from "./scoring";
import ShareBadge from "./ShareBadge";

import { BOOKING_URL, BOOKING_EMBED_URL } from "@/lib/booking";
import {
  DEFAULT_HOURLY_VALUE,
  ROLES,
  chatgptUrl,
  claudeUrl,
  estimateValue,
  matchOpportunity,
  tonightPrompt,
  usd,
} from "@/lib/snapshot";

type Phase = "intro" | "questions" | "details" | "computing" | "gate" | "results";

// How soon the report email arrives. Keep in line with measured send times.
const REPORT_ETA = "usually within 2 minutes";

export default function AssessmentForm() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0); // 0-indexed into questions[]
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [fax, setFax] = useState(""); // honeypot
  const [bottleneck, setBottleneck] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [hourlyValue, setHourlyValue] = useState("");
  const [role, setRole] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const result = useMemo<AssessmentResult | null>(() => {
    if (answers.length < questions.length) return null;
    return scoreAssessment(answers);
  }, [answers]);

  const totalSteps = questions.length;
  const currentQuestion = questions[step];
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  // Pre-select the user's previous choice if they navigate back.
  useEffect(() => {
    if (phase !== "questions" || !currentQuestion) return;
    const prior = answers.find((a) => a.questionId === currentQuestion.id);
    setSelected(prior?.label ?? null);
  }, [step, phase, answers, currentQuestion]);

  // ── Phase transitions ─────────────────────────────────────────────────────
  function handleNext() {
    if (!selected || !currentQuestion) return;
    const updated = [
      ...answers.filter((a) => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, label: selected },
    ];
    setAnswers(updated);

    if (step + 1 < totalSteps) {
      setStep(step + 1);
      setSelected(null);
    } else {
      // Done with multiple choice — ask about their biggest time drain.
      setPhase("details");
    }
  }

  function handleDetailsNext(e: React.FormEvent) {
    e.preventDefault();
    setPhase("computing");
    setTimeout(() => setPhase("gate"), 1500);
  }

  // Same math the report email uses, shown on the results screen.
  const hours = Math.min(Math.max(parseFloat(hoursPerWeek) || 0.5, 0.5), 80);
  const rate = Math.min(Math.max(parseFloat(hourlyValue) || DEFAULT_HOURLY_VALUE, 10), 1000);
  const value = estimateValue(Math.round(hours * 2) / 2, Math.round(rate));
  const topOpportunity = matchOpportunity(bottleneck);
  const prompt = tonightPrompt(bottleneck.trim(), value.hoursPerWeek, result?.industry);

  function handleBack() {
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep(step - 1);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setSubmitError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      // The server re-scores from the raw answers, so only those are sent.
      const res = await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          website,
          role,
          bottleneck,
          hoursPerWeek,
          hourlyValue,
          consent,
          answers,
          fax,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setSubmitError(
          data?.error ?? "We couldn't save your results just now. Please try again in a moment."
        );
        return;
      }
      setPhase("results");
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // INTRO
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="text-center py-12">
        <p className="eyebrow mb-6">Free · About 3 minutes · No tech knowledge needed</p>
        <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-5">
          Free AI Opportunity Snapshot
        </h1>
        <p className="text-lg text-muted max-w-lg mx-auto mb-10 leading-relaxed">
          {totalSteps} quick questions — starting with the easy stuff. We&apos;ll score
          your business across the 5 pillars of AI readiness and show you what your
          biggest time drain is costing you, in dollars, right on the next screen.
        </p>
        <button
          onClick={() => { setPhase("questions"); setStep(0); }}
          className="btn-primary text-base px-10 py-4"
        >
          Start the Snapshot →
        </button>
        <p className="mt-4 text-xs text-muted font-mono">
          FIRST QUESTION IS A 1-CLICK PICK · NO EMAIL UNTIL THE END
        </p>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // QUESTIONS
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "questions" && currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-xs font-mono text-muted mb-2">
            <span>Question {step + 1} of {totalSteps}</span>
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
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-3 text-balance">
            {currentQuestion.question}
          </h2>
          {currentQuestion.helper && (
            <p className="text-sm text-muted mb-6">{currentQuestion.helper}</p>
          )}
          {!currentQuestion.helper && <div className="mb-6" />}

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelected(opt.label)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 ${
                  selected === opt.label
                    ? "border-accent bg-accent/light text-ink"
                    : "border-border bg-cream hover:border-ink/20 text-ink/80"
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono font-bold mr-3 ${
                    selected === opt.label
                      ? "bg-accent text-white"
                      : "bg-border text-muted"
                  }`}
                >
                  {opt.label}
                </span>
                {opt.text}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button onClick={handleBack} className="btn-ghost text-sm">
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selected}
              className="btn-primary px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step + 1 === totalSteps ? "See My Results →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DETAILS — the one free-text question that drives the dollar estimate
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "details") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8">
          <p className="eyebrow mb-3">Last step</p>
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2 text-balance">
            Where do you lose the most time?
          </h2>
          <p className="text-sm text-muted mb-6">
            One task or chore, in your own words. We&apos;ll put a dollar figure on it.
          </p>
          <form onSubmit={handleDetailsNext} className="space-y-4">
            <textarea
              value={bottleneck}
              onChange={(e) => setBottleneck(e.target.value)}
              required
              maxLength={1000}
              rows={3}
              placeholder="e.g. Writing up job estimates and chasing quotes that never get answered"
              className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  Hours a week it takes
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0.5}
                  max={80}
                  step={0.5}
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(e.target.value)}
                  required
                  placeholder="e.g. 6"
                  className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">
                  What an hour of it is worth ($)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={10}
                  max={1000}
                  step={5}
                  value={hourlyValue}
                  onChange={(e) => setHourlyValue(e.target.value)}
                  placeholder={String(DEFAULT_HOURLY_VALUE)}
                  className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
                />
                <p className="mt-1 text-xs text-muted">
                  Not sure? Leave it blank and we&apos;ll use ${DEFAULT_HOURLY_VALUE}/hr.
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Your role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
              >
                <option value="" disabled>
                  Choose one
                </option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => { setPhase("questions"); setStep(totalSteps - 1); }}
                className="btn-ghost text-sm"
              >
                ← Back
              </button>
              <button type="submit" className="btn-primary px-8 py-3">
                See My Results →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMPUTING TEASER
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "computing") {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="inline-flex h-14 w-14 rounded-full border-4 border-border border-t-accent animate-spin mb-6" />
        <p className="eyebrow mb-3">Scoring your responses</p>
        <h2 className="text-2xl font-bold text-ink mb-3">Building your AI readiness profile…</h2>
        <p className="text-muted text-sm leading-relaxed">
          Scoring your answers across the 5 pillars of AI readiness.
        </p>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EMAIL GATE
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "gate" && result) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-8">
          <p className="eyebrow mb-3 text-center">Your results are ready</p>
          <h2 className="text-2xl font-bold text-ink mb-2 text-center">
            Where should we send your report?
          </h2>
          <p className="text-muted text-sm mb-6 leading-relaxed text-center">
            Your results appear on the next screen, and your full report goes to your inbox
            ({REPORT_ETA}).
          </p>

          {/* Teaser strip — partial result hint */}
          <div className="rounded-xl border border-border bg-paper p-4 mb-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">
              Tier Detected
            </p>
            <p className="text-lg font-black text-ink">{result.tier}</p>
            <p className="text-xs text-muted mt-1">Unlock the full report below ↓</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Your name</label>
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
              <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@yourbusiness.com"
                className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
              {emailError && <p className="mt-1.5 text-xs text-accent">{emailError}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                placeholder="Your business name"
                className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">
                Website <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                type="text"
                inputMode="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="yourbusiness.com"
                className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            {/* Honeypot — hidden from people, tempting to bots */}
            <div className="hidden" aria-hidden="true">
              <label>
                Fax
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                />
              </label>
            </div>
            <label className="flex items-start gap-3 text-sm text-ink/80 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-accent"
              />
              <span>Send me occasional tips from Sacramento AI Agency. Optional.</span>
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base disabled:opacity-50"
            >
              {submitting ? "Saving…" : submitError ? "Try Again →" : "Show My Results →"}
            </button>
            {submitError && (
              <p role="alert" className="text-sm text-accent text-center">
                {submitError}
              </p>
            )}
            <p className="text-xs text-muted text-center font-mono">
              NO SPAM. WE ONLY SEND YOUR REPORT UNLESS YOU OPT IN ABOVE.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RESULTS — instant value first, then the readiness detail
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "results" && result) {
    const tierMeta = TIER_META[result.tier];
    const isQualified = tierMeta.cta === "schedule";
    const copyPrompt = () =>
      navigator.clipboard
        ?.writeText(prompt)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        })
        // Clipboard blocked; the prompt is still visible to select by hand.
        .catch(() => {});

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Dollar value of their biggest time drain */}
        <div className="card p-8">
          <p className="eyebrow mb-3">
            {name ? `${name.split(/\s+/)[0]}'s` : "Your"} AI Opportunity Snapshot
          </p>
          <p className="text-sm text-muted mb-1">Your top opportunity</p>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-2 text-balance">
            {topOpportunity.title}
          </h2>
          <p className="text-ink/80 leading-relaxed mb-6">{topOpportunity.how}</p>

          <div className="rounded-xl bg-accent/light border border-accent/30 p-6 mb-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">
              Estimated value of fixing it
            </p>
            <p className="text-3xl sm:text-4xl font-black text-accent">
              {usd(value.low)}–{usd(value.high)}
              <span className="text-lg font-bold text-ink/70"> a year</span>
            </p>
            <p className="mt-3 text-sm text-ink/80 leading-relaxed">
              {value.hoursPerWeek} hrs/week × {usd(value.hourlyValue)}/hr × 50 weeks ={" "}
              <strong>{usd(value.annualCost)}</strong> a year spent on it today. AI typically
              captures a conservative 30–60% of that.
            </p>
          </div>

          <p className="text-sm text-ink font-semibold">
            Your full report, with your top 3 opportunities, is on its way to {email} ({REPORT_ETA}).
          </p>
        </div>

        {/* Try it tonight */}
        <div className="card p-8">
          <p className="eyebrow mb-3">Try it tonight</p>
          <h3 className="text-xl font-bold text-ink mb-3">
            Paste this into Claude or ChatGPT and get a head start
          </h3>
          <p className="rounded-xl bg-paper border border-border p-4 text-sm text-ink/90 leading-relaxed mb-4 whitespace-pre-wrap">
            {prompt}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a href={claudeUrl(prompt)} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
              Open in Claude →
            </a>
            <a href={chatgptUrl(prompt)} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
              Open in ChatGPT →
            </a>
            <button type="button" onClick={copyPrompt} className="btn-secondary text-sm">
              {copied ? "Copied ✓" : "Copy prompt"}
            </button>
          </div>
        </div>

        {/* Booking CTA */}
        <div className="card p-8 bg-accent/light border-accent/30">
          <p className="eyebrow mb-3 text-accent">Next step</p>
          <h3 className="text-2xl font-black text-ink mb-2">
            {isQualified
              ? "You're ready. Let's scope your first project."
              : "Want help turning this into hours back?"}
          </h3>
          <p className="text-ink/80 mb-6 leading-relaxed">
            Book a free 15-minute call and we&apos;ll walk through your numbers and the fastest
            first step from where you are now.
          </p>

          {/* Embedded scheduler — hidden until NEXT_PUBLIC_BOOKING_URL is set */}
          {isQualified && BOOKING_EMBED_URL && (
            <div className="rounded-xl overflow-hidden border border-border bg-paper mb-4" style={{ minHeight: 540 }}>
              <iframe
                src={BOOKING_EMBED_URL}
                width="100%"
                height="540"
                frameBorder="0"
                title="Schedule a call with Tyler Capps"
                loading="lazy"
              />
            </div>
          )}

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-base py-4"
          >
            Book My Free 15-Minute Call →
          </a>
          <p className="mt-3 text-xs text-muted font-mono text-center">
            15 MIN · FREE · NO PITCH, JUST A CONVERSATION
          </p>
          <p className="mt-4 text-center text-sm">
            <a href="/pricing" className="text-muted underline hover:text-ink">
              Or skip ahead to the $997 AI Leverage Assessment
            </a>
          </p>
        </div>

        {/* Readiness profile */}
        <div className="card p-8">
          <p className="eyebrow mb-3">AI readiness profile</p>

          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-1">
                {result.tier}
              </h2>
              <p className="text-muted">{tierMeta.tagline}</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono uppercase tracking-widest text-muted mb-1">
                Readiness score
              </div>
              <div className="text-2xl font-black text-accent">
                {result.totalPct}/100
              </div>
            </div>
          </div>

          <p className="text-ink/80 leading-relaxed mb-6">{tierMeta.blurb}</p>

          {/* Pillar scores */}
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              5 pillars · your scores
            </p>
            {result.pillars.map((p) => (
              <div key={p.pillar}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-ink">{PILLAR_LABELS[p.pillar]}</span>
                  <span className="font-mono text-muted">{p.pct}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-700"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar narratives */}
        <div className="card p-8">
          <p className="eyebrow mb-4">What this means, pillar by pillar</p>
          <div className="space-y-5">
            {result.pillarSummaries.map((p) => (
              <div key={p.pillar} className="flex gap-4">
                <div className="flex-shrink-0 w-1 rounded-full bg-accent" />
                <div>
                  <h3 className="font-bold text-ink mb-1">{p.title}</h3>
                  <p className="text-sm text-ink/75 leading-relaxed">{p.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share badge — always available */}
        <ShareBadge name={name} result={result} />

        <p className="text-center text-xs text-muted pb-6">
          Not seeing the report email? Check spam, or reply to tyler@sacramentoaiagency.com and
          we&apos;ll resend.
        </p>
      </div>
    );
  }

  return null;
}
