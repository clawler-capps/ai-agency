"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { questions, SIZE_LABELS } from "./questions";
import { Answer, AssessmentResult, scoreAssessment, TIER_META, PILLAR_LABELS } from "./scoring";
import ShareBadge from "./ShareBadge";

import { BOOKING_URL, BOOKING_EMBED_URL } from "@/lib/booking";
import {
  CAPTURE_HIGH,
  CAPTURE_LOW,
  DEFAULT_HOURLY_VALUE,
  FOLLOWUP_FALLBACK,
  FOLLOWUP_QUESTION,
  PRIVACY_LINE,
  REVENUE_BANDS,
  ROLES,
  Report,
  WEEKS_PER_YEAR,
  baseAssumptions,
  chatgptUrl,
  claudeUrl,
  estimateValue,
  totalValue,
  usd,
} from "@/lib/snapshot";

type Phase = "intro" | "questions" | "bottleneck" | "followup" | "numbers" | "building" | "report";

// How soon the report email arrives. Keep in line with measured send times.
const REPORT_ETA = "usually within 2 minutes";

const BUILD_STEPS = [
  "Reading your answers…",
  "Reading your website…",
  "Sizing your biggest time drain…",
  "Finding your next-best AI wins…",
  "Running your numbers…",
  "Writing your try-it-tonight prompt…",
];

const input =
  "w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-sm font-semibold text-ink mb-1.5";

async function postJson(url: string, body: unknown, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return { ok: res.ok, data: await res.json().catch(() => null) };
  } finally {
    clearTimeout(timer);
  }
}

export default function AssessmentForm() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0); // 0-indexed into questions[]
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);

  // Snapshot details (before the gate)
  const [bottleneck, setBottleneck] = useState("");
  const [followupOptions, setFollowupOptions] = useState<string[] | null>(null);
  const [followupFor, setFollowupFor] = useState("");
  const [followupChoice, setFollowupChoice] = useState("");
  const [followupText, setFollowupText] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [hourlyValue, setHourlyValue] = useState("");
  const [role, setRole] = useState("");
  const [revenueBand, setRevenueBand] = useState("");
  const [website, setWebsite] = useState("");
  const [fax, setFax] = useState(""); // honeypot

  // Generated report
  const [report, setReport] = useState<Report | null>(null);
  const [token, setToken] = useState("");
  const [buildError, setBuildError] = useState<string | null>(null);
  const [buildStep, setBuildStep] = useState(0);

  // Gate
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Interactive numbers (after unlock)
  const [oppHours, setOppHours] = useState<number[]>([]);
  const [rate, setRate] = useState(DEFAULT_HOURLY_VALUE);
  const [capLow, setCapLow] = useState(CAPTURE_LOW * 100);
  const [capHigh, setCapHigh] = useState(CAPTURE_HIGH * 100);
  const [copied, setCopied] = useState(false);
  const reportTop = useRef<HTMLDivElement>(null);

  const result = useMemo<AssessmentResult | null>(() => {
    if (answers.length < questions.length) return null;
    return scoreAssessment(answers);
  }, [answers]);

  const totalSteps = questions.length;
  const currentQuestion = questions[step];
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  // The visitor's own numbers, cleaned the same way the server cleans them.
  const myHours = Math.round(Math.min(Math.max(parseFloat(hoursPerWeek) || 0.5, 0.5), 80) * 2) / 2;
  const myRate = Math.round(Math.min(Math.max(parseFloat(hourlyValue) || DEFAULT_HOURLY_VALUE, 10), 1000));

  // Pre-select the user's previous choice if they navigate back.
  useEffect(() => {
    if (phase !== "questions" || !currentQuestion) return;
    const prior = answers.find((a) => a.questionId === currentQuestion.id);
    setSelected(prior?.label ?? null);
  }, [step, phase, answers, currentQuestion]);

  // Cycle the "building" messages while the report is written.
  useEffect(() => {
    if (phase !== "building" || buildError) return;
    setBuildStep(0);
    const steps = website.trim() ? BUILD_STEPS : BUILD_STEPS.filter((s) => !s.includes("website"));
    const t = setInterval(() => setBuildStep((s) => Math.min(s + 1, steps.length - 1)), 2200);
    return () => clearInterval(t);
  }, [phase, buildError, website]);

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
      setPhase("bottleneck");
    }
  }

  function handleBack() {
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep(step - 1);
  }

  async function handleBottleneckNext(e: React.FormEvent) {
    e.preventDefault();
    setPhase("followup");
    const text = bottleneck.trim();
    if (followupFor === text && followupOptions) return;
    setFollowupOptions(null);
    setFollowupChoice("");
    setFollowupFor(text);
    let options = FOLLOWUP_FALLBACK;
    try {
      const { data } = await postJson("/api/snapshot/followup", { bottleneck: text, fax }, 3500);
      if (Array.isArray(data?.options) && data.options.length >= 3) options = data.options;
    } catch {
      // Slow or offline: the static options are fine.
    }
    setFollowupOptions(options);
  }

  async function buildSnapshot() {
    setPhase("building");
    setBuildError(null);
    try {
      const { ok, data } = await postJson(
        "/api/snapshot",
        { answers, bottleneck, followupChoice, followupText, hoursPerWeek, hourlyValue, role, revenueBand, website, fax },
        58_000
      );
      if (!ok || !data?.success || !data.report) {
        setBuildError(data?.error ?? "We couldn't build your snapshot just now. Please try again.");
        return;
      }
      const r = data.report as Report;
      setReport(r);
      setToken(data.token ?? "");
      setOppHours(r.opportunities.map((o) => o.hours));
      setRate(myRate);
      setCapLow(CAPTURE_LOW * 100);
      setCapHigh(CAPTURE_HIGH * 100);
      if (result && !companySize) setCompanySize(SIZE_LABELS[result.sizeLabel] ?? "");
      setPhase("report");
      window.scrollTo({ top: 0 });
    } catch {
      setBuildError("We couldn't reach the server. Check your connection and try again.");
    }
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const { ok, data } = await postJson(
        "/api/capture-email",
        { token, firstName, email, company, companySize, consent, fax },
        20_000
      );
      if (!ok || !data?.success) {
        setSubmitError(data?.error ?? "We couldn't save your details just now. Please try again in a moment.");
        return;
      }
      setUnlocked(true);
      reportTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const honeypot = (
    <div className="hidden" aria-hidden="true">
      <label>
        Fax
        <input type="text" tabIndex={-1} autoComplete="off" value={fax} onChange={(e) => setFax(e.target.value)} />
      </label>
    </div>
  );

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
          {totalSteps} quick questions, then a few about where your time goes. We&apos;ll build
          your personal snapshot live: your top AI opportunities, what they&apos;re worth in
          dollars, and one thing you can try tonight.
        </p>
        <button
          onClick={() => { setPhase("questions"); setStep(0); }}
          className="btn-primary text-base px-10 py-4"
        >
          Start the Snapshot →
        </button>
        <p className="mt-4 text-xs text-muted font-mono">
          FIRST QUESTION IS A 1-CLICK PICK · SEE YOUR SNAPSHOT BEFORE WE ASK FOR AN EMAIL
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

        <div className="card p-6 sm:p-8">
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
                    selected === opt.label ? "bg-accent text-white" : "bg-border text-muted"
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
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // BOTTLENECK — their own words drive the whole snapshot
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "bottleneck") {
    return (
      <div className="max-w-2xl mx-auto">
        <StepLabel n={1} />
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2 text-balance">
            Where do you lose the most time?
          </h2>
          <p className="text-sm text-muted mb-6">
            One task or chore, in your own words. Your snapshot is built around it.
          </p>
          <form onSubmit={handleBottleneckNext} className="space-y-4">
            <textarea
              value={bottleneck}
              onChange={(e) => setBottleneck(e.target.value)}
              required
              maxLength={1000}
              rows={3}
              placeholder="e.g. Writing up job estimates and chasing quotes that never get answered"
              className={input}
            />
            {honeypot}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => { setPhase("questions"); setStep(totalSteps - 1); }}
                className="btn-ghost text-sm"
              >
                ← Back
              </button>
              <button type="submit" disabled={!bottleneck.trim()} className="btn-primary px-8 py-3 disabled:opacity-40">
                Next →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FOLLOW-UP — options tailored to their answer (static if the AI is slow)
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "followup") {
    const choices = followupOptions ? [...followupOptions, "Other"] : null;
    const canContinue = followupChoice && (followupChoice !== "Other" || followupText.trim());
    return (
      <div className="max-w-2xl mx-auto">
        <StepLabel n={2} />
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2 text-balance">{FOLLOWUP_QUESTION}</h2>
          <p className="text-sm text-muted mb-6">
            You said: <span className="text-ink/80 italic">&ldquo;{bottleneck.trim()}&rdquo;</span>
          </p>

          {!choices ? (
            <div className="flex items-center gap-3 py-8 text-muted text-sm" role="status">
              <span className="inline-flex h-5 w-5 rounded-full border-2 border-border border-t-accent animate-spin" />
              Tailoring the options to your answer…
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {choices.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFollowupChoice(c)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-150 ${
                    followupChoice === c
                      ? "border-accent bg-accent/light text-ink"
                      : "border-border bg-cream hover:border-ink/20 text-ink/80"
                  }`}
                >
                  {c}
                </button>
              ))}
              {followupChoice === "Other" && (
                <input
                  type="text"
                  autoFocus
                  value={followupText}
                  onChange={(e) => setFollowupText(e.target.value)}
                  maxLength={300}
                  placeholder="Where does it get stuck?"
                  className={input}
                />
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button type="button" onClick={() => setPhase("bottleneck")} className="btn-ghost text-sm">
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setPhase("numbers")}
              disabled={!canContinue}
              className="btn-primary px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // NUMBERS — hours, value, role, revenue, website
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "numbers") {
    return (
      <div className="max-w-2xl mx-auto">
        <StepLabel n={3} />
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2 text-balance">Last step: your numbers</h2>
          <p className="text-sm text-muted mb-6">Rough guesses are fine. You can adjust them on your snapshot.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); buildSnapshot(); }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Hours a week it takes</label>
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
                  className={input}
                />
              </div>
              <div>
                <label className={labelCls}>What an hour of it is worth ($)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={10}
                  max={1000}
                  step={5}
                  value={hourlyValue}
                  onChange={(e) => setHourlyValue(e.target.value)}
                  placeholder={String(DEFAULT_HOURLY_VALUE)}
                  className={input}
                />
                <p className="mt-1 text-xs text-muted">
                  Not sure? Leave it blank and we&apos;ll use ${DEFAULT_HOURLY_VALUE}/hr.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Your role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} required className={input}>
                  <option value="" disabled>Choose one</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Annual revenue</label>
                <select value={revenueBand} onChange={(e) => setRevenueBand(e.target.value)} required className={input}>
                  <option value="" disabled>Choose one</option>
                  {REVENUE_BANDS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>
                Website <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                type="text"
                inputMode="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                maxLength={300}
                placeholder="yourbusiness.com"
                className={input}
              />
              <p className="mt-1 text-xs text-muted">We&apos;ll read your homepage so the snapshot fits your business.</p>
            </div>
            {honeypot}
            <div className="flex justify-between items-center pt-2">
              <button type="button" onClick={() => setPhase("followup")} className="btn-ghost text-sm">
                ← Back
              </button>
              <button type="submit" className="btn-primary px-8 py-3">
                Build My Snapshot →
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // BUILDING — one live AI call, about 5–15 seconds
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "building") {
    const steps = website.trim() ? BUILD_STEPS : BUILD_STEPS.filter((s) => !s.includes("website"));
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        {buildError ? (
          <>
            <p className="eyebrow mb-3">Something went wrong</p>
            <h2 className="text-2xl font-bold text-ink mb-3">We couldn&apos;t finish your snapshot</h2>
            <p role="alert" className="text-muted text-sm leading-relaxed mb-6">{buildError}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setPhase("numbers")} className="btn-ghost text-sm">← Back</button>
              <button onClick={buildSnapshot} className="btn-primary px-8 py-3">Try Again →</button>
            </div>
          </>
        ) : (
          <>
            <div className="inline-flex h-14 w-14 rounded-full border-4 border-border border-t-accent animate-spin mb-6" />
            <p className="eyebrow mb-3">Building your snapshot</p>
            <h2 className="text-2xl font-bold text-ink mb-3" aria-live="polite">{steps[buildStep] ?? steps[0]}</h2>
            <p className="text-muted text-sm leading-relaxed">
              This is written live from your answers, not pulled from a template. It usually takes 5–15 seconds.
            </p>
          </>
        )}
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // REPORT — headline and top line visible, the rest blurred until unlocked
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "report" && report && result) {
    const tierMeta = TIER_META[result.tier];
    const isQualified = tierMeta.cta === "schedule";
    const low = capLow / 100;
    const high = capHigh / 100;
    // Before unlock, show the visitor's original numbers; after, the sliders.
    const r = unlocked ? rate : myRate;
    const hoursFor = (i: number) => (unlocked ? oppHours[i] : report.opportunities[i].hours);
    const opps = report.opportunities.map((o, i) => ({
      ...o,
      value: estimateValue(hoursFor(i), r, unlocked ? low : CAPTURE_LOW, unlocked ? high : CAPTURE_HIGH),
    }));
    const total = totalValue(
      opps.map((o, i) => ({ hours: hoursFor(i) })),
      r,
      unlocked ? low : CAPTURE_LOW,
      unlocked ? high : CAPTURE_HIGH
    );
    const top = opps[0];
    const owner = unlocked && company.trim() ? `${company.trim()}'s` : "Your";
    const assumptions = [...baseAssumptions(r, unlocked ? low : CAPTURE_LOW, unlocked ? high : CAPTURE_HIGH), ...report.assumptions];
    const changed =
      rate !== myRate ||
      capLow !== CAPTURE_LOW * 100 ||
      capHigh !== CAPTURE_HIGH * 100 ||
      oppHours.some((h, i) => h !== report.opportunities[i].hours);
    const resetNumbers = () => {
      setOppHours(report.opportunities.map((o) => o.hours));
      setRate(myRate);
      setCapLow(CAPTURE_LOW * 100);
      setCapHigh(CAPTURE_HIGH * 100);
    };
    const copyPrompt = () =>
      navigator.clipboard
        ?.writeText(report.prompt)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        })
        // Clipboard blocked; the prompt is still visible to select by hand.
        .catch(() => {});

    const details = (
      <div className="space-y-6">
        {/* Interactive numbers */}
        {unlocked && (
          <div className="card p-6 sm:p-8 border-accent/30">
            <div className="flex items-start justify-between gap-4 mb-1">
              <p className="eyebrow">Play with your numbers</p>
              {changed && (
                <button type="button" onClick={resetNumbers} className="text-xs text-muted underline hover:text-ink">
                  Reset to my answers
                </button>
              )}
            </div>
            <p className="text-sm text-muted mb-6">
              Every figure on this page updates as you move these. Our math, your numbers.
            </p>
            <div className="space-y-5">
              <Slider
                label="What an hour of your time is worth"
                value={rate}
                display={`${usd(rate)}/hr`}
                min={10}
                max={Math.max(500, myRate)}
                step={5}
                onChange={setRate}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Slider
                  label="AI captures, low end"
                  value={capLow}
                  display={`${capLow}%`}
                  min={5}
                  max={90}
                  step={5}
                  onChange={(v) => { setCapLow(v); if (v > capHigh) setCapHigh(v); }}
                />
                <Slider
                  label="AI captures, high end"
                  value={capHigh}
                  display={`${capHigh}%`}
                  min={5}
                  max={95}
                  step={5}
                  onChange={(v) => { setCapHigh(v); if (v < capLow) setCapLow(v); }}
                />
              </div>
              {opps.map((o, i) => (
                <Slider
                  key={i}
                  label={`Hours a week: ${o.title}`}
                  value={oppHours[i]}
                  display={`${oppHours[i]} hrs`}
                  min={0.5}
                  max={i === 0 ? Math.max(40, myHours) : 10}
                  step={0.5}
                  onChange={(v) => setOppHours(oppHours.map((h, j) => (j === i ? v : h)))}
                />
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-accent/light border border-accent/30 p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Your top 3, added up</p>
              <p className="text-3xl font-black text-accent">
                {usd(total.low)}–{usd(total.high)}
                <span className="text-lg font-bold text-ink/70"> a year</span>
              </p>
            </div>
          </div>
        )}

        {/* Opportunities */}
        <div className="card p-6 sm:p-8">
          <p className="eyebrow mb-4">Your top 3 AI opportunities</p>
          <div className="space-y-5">
            {opps.map((o, i) => (
              <div key={i} className={i > 0 ? "pt-5 border-t border-border" : ""}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
                  <h3 className="font-bold text-ink">{i + 1}. {o.title}</h3>
                  <span className="font-bold text-accent whitespace-nowrap">
                    {usd(o.value.low)}–{usd(o.value.high)}/yr
                  </span>
                </div>
                <p className="text-sm text-ink/80 leading-relaxed mb-2">{o.why}</p>
                <p className="text-xs text-muted font-mono leading-relaxed">{o.value.math}</p>
              </div>
            ))}
          </div>
          {!unlocked && (
            <p className="mt-6 text-sm font-semibold text-ink">
              Your top 3 add up to {usd(total.low)}–{usd(total.high)} a year.
            </p>
          )}
        </div>

        {/* Today vs with AI */}
        {(report.today.length > 0 || report.withAi.length > 0) && (
          <div className="card p-6 sm:p-8">
            <p className="eyebrow mb-4">Today vs. with AI: {top.title}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-ink mb-2">Today</p>
                <ul className="space-y-2 text-sm text-ink/80 list-disc pl-5">
                  {report.today.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-bold text-ink mb-2">With AI</p>
                <ul className="space-y-2 text-sm text-ink/80 list-disc pl-5">
                  {report.withAi.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Try it tonight */}
        <div className="card p-6 sm:p-8">
          <p className="eyebrow mb-3">Try it tonight</p>
          <h3 className="text-xl font-bold text-ink mb-3">Paste this into Claude or ChatGPT and get a head start</h3>
          <p className="rounded-xl bg-paper border border-border p-4 text-sm text-ink/90 leading-relaxed mb-4 whitespace-pre-wrap">
            {report.prompt}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a href={claudeUrl(report.prompt)} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
              Open in Claude →
            </a>
            <a href={chatgptUrl(report.prompt)} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
              Open in ChatGPT →
            </a>
            <button type="button" onClick={copyPrompt} className="btn-secondary text-sm">
              {copied ? "Copied ✓" : "Copy prompt"}
            </button>
          </div>
        </div>

        {/* Assumptions */}
        <div className="card p-6 sm:p-8">
          <p className="eyebrow mb-3">Assumptions</p>
          <ul className="space-y-1.5 text-sm text-ink/80 list-disc pl-5">
            {assumptions.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      </div>
    );

    return (
      <div className="max-w-3xl mx-auto space-y-6" ref={reportTop}>
        {/* Always visible: headline and the #1 top line */}
        <div className="card p-6 sm:p-8">
          <p className="eyebrow mb-3">{owner} AI Opportunity Snapshot</p>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-3 text-balance">
            {report.headline}
          </h1>
          <p className="text-sm text-muted mb-6">
            Built live from your answers, including:{" "}
            <span className="text-ink/80 italic">&ldquo;{bottleneck.trim()}&rdquo;</span>
          </p>
          <div className="rounded-xl bg-accent/light border border-accent/30 p-5 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">#1 opportunity</p>
            <p className="text-lg sm:text-xl font-bold text-ink mb-1">{top.title}</p>
            <p className="text-3xl sm:text-4xl font-black text-accent">
              {usd(top.value.low)}–{usd(top.value.high)}
              <span className="text-lg font-bold text-ink/70"> a year</span>
            </p>
            {unlocked && (
              <p className="mt-2 text-xs text-ink/70 font-mono">
                {hoursFor(0)} hrs/week × {usd(r)}/hr × {WEEKS_PER_YEAR} weeks × {capLow}–{capHigh}%
              </p>
            )}
          </div>
          {unlocked && (
            <p className="mt-4 text-sm text-ink font-semibold">
              A copy is on its way to {email} ({REPORT_ETA}).
            </p>
          )}
        </div>

        {unlocked ? (
          details
        ) : (
          <div className="relative">
            <div aria-hidden="true" ref={(el) => el?.setAttribute("inert", "")} className="blur-[6px] select-none pointer-events-none min-h-[760px]">
              {details}
            </div>
            {/* Gate card over the blurred report */}
            <div className="absolute inset-x-0 top-0 sm:top-6 flex justify-center">
              <div className="card p-6 sm:p-8 w-full max-w-md shadow-2xl bg-cream">
                <p className="eyebrow mb-2">Your snapshot is ready</p>
                <h2 className="text-2xl font-black text-ink mb-2">Unlock your full snapshot</h2>
                <p className="text-sm text-ink/80 leading-relaxed mb-5">
                  This came from about 3 minutes of answers. Imagine what a one-on-one
                  conversation and a few days of analysis would uncover.
                </p>
                <form onSubmit={handleUnlock} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>First name</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required maxLength={80} autoComplete="given-name" className={input} />
                    </div>
                    <div>
                      <label className={labelCls}>Company</label>
                      <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required maxLength={200} autoComplete="organization" className={input} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} autoComplete="email" placeholder="you@yourbusiness.com" className={input} />
                  </div>
                  <div>
                    <label className={labelCls}>Company size</label>
                    <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} required className={input}>
                      <option value="" disabled>Choose one</option>
                      {Object.values(SIZE_LABELS).map((s) => (
                        <option key={s} value={s}>{s === "Solo" ? "Just me" : `${s} people`}</option>
                      ))}
                    </select>
                  </div>
                  {honeypot}
                  <label className="flex items-start gap-3 text-sm text-ink/80 cursor-pointer">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-accent" />
                    <span>Send me occasional tips from Sacramento AI Agency. Optional.</span>
                  </label>
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base disabled:opacity-50">
                    {submitting ? "Unlocking…" : "Unlock my full snapshot"}
                  </button>
                  {submitError && <p role="alert" className="text-sm text-accent text-center">{submitError}</p>}
                  <p className="text-xs text-muted leading-relaxed">
                    We&apos;ll also email you a copy. {PRIVACY_LINE}
                  </p>
                </form>
                <div className="mt-5 pt-4 border-t border-border text-center">
                  <p className="text-sm text-ink/80 mb-1">Want the full picture?</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent underline">
                    Book a free 15-minute call →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {unlocked && (
          <>
            {/* Booking CTA */}
            <div className="card p-6 sm:p-8 bg-accent/light border-accent/30">
              <p className="eyebrow mb-3 text-accent">Next step</p>
              <h3 className="text-2xl font-black text-ink mb-2">
                {isQualified ? "You're ready. Let's scope your first project." : "This is 3 minutes of insight. Imagine the full picture."}
              </h3>
              <p className="text-ink/80 mb-6 leading-relaxed">
                Your snapshot came from a short quiz. A one-on-one conversation and a few days of
                analysis would uncover far more. Book a free 15-minute call and we&apos;ll walk
                through your numbers and the fastest first step.
              </p>
              {isQualified && BOOKING_EMBED_URL && (
                <div className="rounded-xl overflow-hidden border border-border bg-paper mb-4" style={{ minHeight: 540 }}>
                  <iframe src={BOOKING_EMBED_URL} width="100%" height="540" frameBorder="0" title="Schedule a call with Tyler Capps" loading="lazy" />
                </div>
              )}
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-base py-4">
                Book My Free 15-Minute Call →
              </a>
              <p className="mt-3 text-xs text-muted font-mono text-center">15 MIN · FREE · NO PITCH, JUST A CONVERSATION</p>
              <p className="mt-4 text-center text-sm">
                <a href="/pricing" className="text-muted underline hover:text-ink">
                  Or skip ahead to the $997 AI Leverage Assessment
                </a>
              </p>
            </div>

            {/* Readiness profile */}
            <div className="card p-6 sm:p-8">
              <p className="eyebrow mb-3">AI readiness profile</p>
              <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-1">{result.tier}</h2>
                  <p className="text-muted">{tierMeta.tagline}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono uppercase tracking-widest text-muted mb-1">Readiness score</div>
                  <div className="text-2xl font-black text-accent">{result.totalPct}/100</div>
                </div>
              </div>
              <p className="text-ink/80 leading-relaxed mb-6">{tierMeta.blurb}</p>
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-widest text-muted">5 pillars · your scores</p>
                {result.pillars.map((p) => (
                  <div key={p.pillar}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-ink">{PILLAR_LABELS[p.pillar]}</span>
                      <span className="font-mono text-muted">{p.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar narratives */}
            <div className="card p-6 sm:p-8">
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

            <ShareBadge name={firstName} result={result} />

            <p className="text-center text-xs text-muted pb-6">
              Not seeing the email? Check spam, or reply to tyler@sacramentoaiagency.com and we&apos;ll resend.
            </p>
          </>
        )}
      </div>
    );
  }

  return null;
}

function StepLabel({ n }: { n: number }) {
  return (
    <div className="mb-6 flex justify-between text-xs font-mono text-muted">
      <span>Almost done · {n} of 3</span>
      <span>Your snapshot is next</span>
    </div>
  );
}

function Slider(props: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex justify-between gap-4 text-sm mb-1.5">
        <span className="font-semibold text-ink">{props.label}</span>
        <span className="font-mono text-accent font-bold whitespace-nowrap">{props.display}</span>
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(parseFloat(e.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}
