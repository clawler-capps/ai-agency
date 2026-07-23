"use client";

import { useEffect, useMemo, useState } from "react";
import { questions } from "./questions";
import { Answer, AssessmentResult, scoreAssessment, TIER_META, PILLAR_LABELS } from "./scoring";
import ShareBadge from "./ShareBadge";

import { BOOKING_URL, BOOKING_EMBED_URL } from "@/lib/booking";

type Phase = "intro" | "questions" | "computing" | "gate" | "results";

export default function AssessmentForm() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0); // 0-indexed into questions[]
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

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
      // Done with questions — show the "computing" teaser, then gate.
      setPhase("computing");
      setTimeout(() => setPhase("gate"), 2200);
    }
  }

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          tier: result?.tier,
          totalPct: result?.totalPct,
          pillars: result?.pillars,
          industry: result?.industry,
          answers,
        }),
      });
    } catch {
      // Non-blocking — we still show results.
    } finally {
      setSubmitting(false);
      setPhase("results");
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // INTRO
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="text-center py-12">
        <p className="eyebrow mb-6">Free · 5 minutes · No tech knowledge needed</p>
        <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-5">
          Free AI Opportunity Assessment
        </h1>
        <p className="text-lg text-muted max-w-lg mx-auto mb-10 leading-relaxed">
          Nine quick questions — starting with the easy stuff. We&apos;ll score
          your business across the 5 pillars of AI readiness and show you exactly
          where you stand against your peers.
        </p>
        <button
          onClick={() => { setPhase("questions"); setStep(0); }}
          className="btn-primary text-base px-10 py-4"
        >
          Start the Assessment →
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
  // COMPUTING TEASER
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "computing") {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="inline-flex h-14 w-14 rounded-full border-4 border-border border-t-accent animate-spin mb-6" />
        <p className="eyebrow mb-3">Scoring your responses</p>
        <h2 className="text-2xl font-bold text-ink mb-3">Building your AI readiness profile…</h2>
        <p className="text-muted text-sm leading-relaxed">
          Cross-referencing your answers against the 5 pillars of AI readiness and benchmarking
          against Sacramento-area peers.
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
            We&apos;ll show your full results on the next screen — and email you a copy of your
            personalized AI roadmap.
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
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base disabled:opacity-50"
            >
              {submitting ? "Unlocking…" : "Show My Full Results →"}
            </button>
            <p className="text-xs text-muted text-center font-mono">
              NO SPAM. UNSUBSCRIBE ANY TIME.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RESULTS
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "results" && result) {
    const tierMeta = TIER_META[result.tier];
    const isQualified = tierMeta.cta === "schedule";

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Headline card */}
        <div className="card p-8">
          <p className="eyebrow mb-3">
            {name ? `${name}'s` : "Your"} AI Readiness Profile
          </p>

          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-1">
                {result.tier}
              </h2>
              <p className="text-muted">{tierMeta.tagline}</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono uppercase tracking-widest text-muted mb-1">
                Peer ranking
              </div>
              <div className="text-2xl font-black text-accent">
                Top {result.peerPercentile}%
              </div>
              <div className="text-xs text-muted mt-0.5">
                of Sacramento-area {result.industry.toLowerCase()} businesses
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

        {/* Segmented CTA */}
        {isQualified ? (
          <div className="card p-8 bg-accent/light border-accent/30">
            <p className="eyebrow mb-3 text-accent">Next Step — Schedule a Call</p>
            <h3 className="text-2xl font-black text-ink mb-2">
              You&apos;re ready. Let&apos;s scope your first project.
            </h3>
            <p className="text-ink/80 mb-6 leading-relaxed">
              Businesses in your tier typically see ROI inside 30 days. Book a free 20-minute call
              and we&apos;ll map out the fastest path from where you are now.
            </p>

            {/* Embedded scheduler — hidden until a real scheduler URL is configured */}
            {BOOKING_EMBED_URL && (
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
              Schedule My Call →
            </a>
            <p className="mt-3 text-xs text-muted font-mono text-center">
              20 MIN · FREE · NO PITCH, JUST A CONVERSATION
            </p>
          </div>
        ) : (
          <div className="card p-8 bg-blue/light border-blue/border">
            <p className="eyebrow mb-3" style={{ color: "var(--accent3)" }}>
              Next Step — Check Your Email
            </p>
            <h3 className="text-2xl font-black text-ink mb-2">
              Your personalized AI roadmap is on its way 📬
            </h3>
            <p className="text-ink/80 mb-5 leading-relaxed">
              We&apos;ve sent a detailed report to <strong>{email}</strong> with the exact next
              steps for your stage — including the 1-week, 1-month, and 1-quarter milestones we
              recommend for businesses at the {result.tier} level.
            </p>
            <div className="rounded-xl bg-paper border border-border p-5">
              <p className="text-sm font-semibold text-ink mb-2">While you wait — three things you can do today:</p>
              <ul className="space-y-2 text-sm text-ink/80">
                <li className="flex gap-2"><span className="text-accent">→</span> List your top 3 most-repeated weekly tasks.</li>
                <li className="flex gap-2"><span className="text-accent">→</span> Pick the one tool your team already uses well — that&apos;s the integration starting point.</li>
                <li className="flex gap-2"><span className="text-accent">→</span> Watch your inbox for your roadmap (usually arrives within 10 minutes).</li>
              </ul>
            </div>
            <p className="mt-4 text-xs text-muted">
              Not seeing it? Check spam, or reply to any email and we&apos;ll resend.
            </p>
          </div>
        )}

        {/* Share badge — always available */}
        <ShareBadge name={name} result={result} />

        {/* Soft secondary CTA for everyone */}
        <div className="text-center pb-6">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-sm"
          >
            {isQualified
              ? "Prefer to do this async? Email tyler@sacramentoaiagency.com →"
              : "Want to skip ahead and book a call anyway? →"}
          </a>
        </div>
      </div>
    );
  }

  return null;
}
