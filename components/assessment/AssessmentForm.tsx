"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { OptionLabel, questions, SIZE_LABELS } from "./questions";
import { Answer, AssessmentResult, scoreAssessment, TIER_META, PILLAR_LABELS } from "./scoring";

import { BOOKING_URL, BOOKING_EMBED_URL } from "@/lib/booking";
import {
  CostBasis,
  DEFAULT_HOURLY_VALUE,
  FOLLOWUP_FALLBACK,
  FOLLOWUP_QUESTION,
  HOURS_PER_YEAR,
  MAX_SALARY,
  MIN_SALARY,
  PRIVACY_LINE,
  REVENUE_BANDS,
  ROLES,
  Report,
  chatgptUrl,
  claudeUrl,
  clampRate,
  estimateValue,
  salaryMath,
  salaryToHourly,
  shortHeadline,
  totalValue,
  truncate,
  usd,
} from "@/lib/snapshot";

type Phase = "intro" | "questions" | "bottleneck" | "followup" | "numbers" | "building" | "report";
type GateStep = "details" | "code";

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
    return { ok: res.ok, status: res.status, data: await res.json().catch(() => null) };
  } finally {
    clearTimeout(timer);
  }
}

const parseMoney = (s: string) => parseFloat(s.replace(/[$,\s]/g, ""));

export default function AssessmentForm() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0); // 0-indexed into questions[]
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<OptionLabel | null>(null);

  // Snapshot details (before the gate)
  const [bottleneck, setBottleneck] = useState("");
  const [followupOptions, setFollowupOptions] = useState<string[] | null>(null);
  const [followupFor, setFollowupFor] = useState("");
  const [followupChoice, setFollowupChoice] = useState("");
  const [followupText, setFollowupText] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [costBasis, setCostBasis] = useState<CostBasis>("hourly");
  const [hourlyValue, setHourlyValue] = useState("");
  const [annualSalary, setAnnualSalary] = useState("");
  const [role, setRole] = useState("");
  const [revenueBand, setRevenueBand] = useState("");
  const [website, setWebsite] = useState("");
  const [fax, setFax] = useState(""); // honeypot

  // Generated report
  const [report, setReport] = useState<Report | null>(null);
  const [token, setToken] = useState("");
  const [buildError, setBuildError] = useState<string | null>(null);
  const [buildStep, setBuildStep] = useState(0);

  // Gate: details, then the 6-digit code
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [consent, setConsent] = useState(false);
  const [gateStep, setGateStep] = useState<GateStep>("details");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [codeToken, setCodeToken] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [resendsLeft, setResendsLeft] = useState(0);
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Interactive numbers (after unlock): hours per opportunity and the cost.
  const [oppHours, setOppHours] = useState<number[]>([]);
  const [rate, setRate] = useState(DEFAULT_HOURLY_VALUE);
  const [salary, setSalary] = useState(0);
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
  const salaryNum = parseMoney(annualSalary);
  const usingSalary = costBasis === "salary" && Number.isFinite(salaryNum) && salaryNum > 0;
  const mySalary = usingSalary ? Math.round(Math.min(Math.max(salaryNum, MIN_SALARY), MAX_SALARY)) : 0;
  const myRate = usingSalary
    ? salaryToHourly(mySalary)
    : Number.isFinite(parseMoney(hourlyValue))
      ? clampRate(parseMoney(hourlyValue))
      : DEFAULT_HOURLY_VALUE;
  const myHours = Math.round(Math.min(Math.max(parseFloat(hoursPerWeek) || 0.5, 0.5), 80) * 2) / 2;

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
        {
          answers,
          bottleneck,
          followupChoice,
          followupText,
          hoursPerWeek,
          costBasis: usingSalary ? "salary" : "hourly",
          hourlyValue: usingSalary ? myRate : hourlyValue,
          annualSalary: usingSalary ? mySalary : "",
          role,
          revenueBand,
          website,
          fax,
        },
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
      setSalary(mySalary);
      if (result && !companySize) setCompanySize(SIZE_LABELS[result.sizeLabel] ?? "");
      setPhase("report");
      window.scrollTo({ top: 0 });
    } catch {
      setBuildError("We couldn't reach the server. Check your connection and try again.");
    }
  }

  // Gate step 1: check the address and email a code. Nothing is saved yet.
  async function sendCode(opts: { keepTypo?: boolean; resend?: boolean; address?: string } = {}) {
    const address = (opts.address ?? email).trim();
    setSubmitError(null);
    setNotice(null);
    setSuggestion(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setSubmitError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const { ok, data } = await postJson(
        "/api/capture-email/send-code",
        {
          token,
          firstName,
          email: address,
          company,
          companySize,
          consent,
          fax,
          keepTypo: opts.keepTypo === true,
          resendToken: opts.resend ? codeToken : undefined,
        },
        20_000
      );
      if (!ok || !data?.success) {
        if (data?.reason === "typo" && data.suggestion) setSuggestion(data.suggestion);
        setSubmitError(data?.error ?? "We couldn't send a code just now. Please try again in a minute.");
        return;
      }
      setCodeToken(data.codeToken ?? "");
      setSentTo(data.email ?? address);
      setResendsLeft(typeof data.resendsLeft === "number" ? data.resendsLeft : 0);
      setCode("");
      setGateStep("code");
      if (opts.resend) setNotice("We sent a new code. Use the newest one.");
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Gate step 2: the code. Only a verified code unlocks the report.
  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setNotice(null);
    const digits = code.replace(/\D/g, "");
    if (digits.length !== 6) {
      setSubmitError("Please enter the 6-digit code from the email.");
      return;
    }
    setSubmitting(true);
    try {
      const { ok, data } = await postJson("/api/capture-email", { token, codeToken, code: digits, fax }, 20_000);
      if (!ok || !data?.success) {
        if (typeof data?.codeToken === "string" && data.codeToken) setCodeToken(data.codeToken);
        setSubmitError(data?.error ?? "We couldn't check that code just now. Please try again.");
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

  function changeEmail() {
    setGateStep("details");
    setCodeToken("");
    setCode("");
    setSubmitError(null);
    setNotice(null);
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
  // NUMBERS — hours, cost (hourly or salary), role, revenue, website
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "numbers") {
    const salaryReady = costBasis === "salary" && usingSalary;
    return (
      <div className="max-w-2xl mx-auto">
        <StepLabel n={3} />
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2 text-balance">Last step: your numbers</h2>
          <p className="text-sm text-muted mb-6">Rough guesses are fine. You can adjust them on your snapshot.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); buildSnapshot(); }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="hours" className={labelCls}>
                How many hours a week does &ldquo;{truncate(bottleneck, 70)}&rdquo; take?
              </label>
              <p className="text-xs text-muted mb-2">Across everyone who does it, roughly.</p>
              <input
                id="hours"
                type="number"
                inputMode="decimal"
                min={0.5}
                max={80}
                step={0.5}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                required
                placeholder="e.g. 6"
                className={`${input} sm:max-w-[200px]`}
              />
            </div>

            <fieldset>
              <legend className={labelCls}>What does that time cost you?</legend>
              <div role="radiogroup" className="grid grid-cols-2 gap-2 mb-3">
                {([
                  ["hourly", "Cost per hour"],
                  ["salary", "Annual salary"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={costBasis === value}
                    onClick={() => setCostBasis(value)}
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                      costBasis === value
                        ? "border-accent bg-accent/light text-ink"
                        : "border-border bg-cream text-ink/70 hover:border-ink/20"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {costBasis === "hourly" ? (
                <div>
                  <label htmlFor="rate" className="sr-only">Cost per hour in dollars</label>
                  <div className="relative sm:max-w-[240px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                    <input
                      id="rate"
                      type="text"
                      inputMode="decimal"
                      value={hourlyValue}
                      onChange={(e) => setHourlyValue(e.target.value)}
                      placeholder={String(DEFAULT_HOURLY_VALUE)}
                      className={`${input} pl-8 pr-14`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm">/hr</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    What an hour of this work costs you. Not sure? Leave it blank and we&apos;ll use ${DEFAULT_HOURLY_VALUE}/hr.
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor="salary" className="sr-only">Annual salary in dollars</label>
                  <div className="relative sm:max-w-[240px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                    <input
                      id="salary"
                      type="text"
                      inputMode="numeric"
                      value={annualSalary}
                      onChange={(e) => setAnnualSalary(e.target.value)}
                      placeholder="65,000"
                      required
                      className={`${input} pl-8 pr-14`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm">/yr</span>
                  </div>
                  <p className="mt-1 text-xs text-muted" aria-live="polite">
                    {salaryReady
                      ? <>Salary of the person who does it: <span className="font-mono text-ink">{salaryMath(mySalary)}</span></>
                      : `Salary of the person who does it. We divide it by ${HOURS_PER_YEAR.toLocaleString("en-US")} work hours a year.`}
                  </p>
                </div>
              )}
            </fieldset>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className={labelCls}>Your role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required className={input}>
                  <option value="" disabled>Choose one</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="revenue" className={labelCls}>Annual revenue</label>
                <select id="revenue" value={revenueBand} onChange={(e) => setRevenueBand(e.target.value)} required className={input}>
                  <option value="" disabled>Choose one</option>
                  {REVENUE_BANDS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="website" className={labelCls}>
                Website <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="website"
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
  // REPORT — headline and #1 visible, the rest blurred until the code is verified
  // ──────────────────────────────────────────────────────────────────────────
  if (phase === "report" && report && result) {
    const tierMeta = TIER_META[result.tier];
    const isQualified = tierMeta.cta === "schedule";
    const bySalary = salary > 0;
    // Effective hourly cost. With a salary it is always salary ÷ 2,080.
    const r = bySalary ? salaryToHourly(salary) : rate;
    const opps = report.opportunities.map((o, i) => ({ ...o, value: estimateValue(oppHours[i] ?? o.hours, r) }));
    const total = totalValue(opps.map((o, i) => ({ hours: oppHours[i] ?? o.hours })), r);
    const top = opps[0];
    const owner = unlocked && company.trim() ? `${company.trim()}'s` : "Your";
    const changed =
      rate !== myRate || salary !== mySalary || oppHours.some((h, i) => h !== report.opportunities[i].hours);
    const resetNumbers = () => {
      setOppHours(report.opportunities.map((o) => o.hours));
      setRate(myRate);
      setSalary(mySalary);
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

    // Sections 2–5. Blurred and inert behind the gate, live once unlocked.
    const details = (
      <div className="space-y-6">
        {/* 2. Top 3 with ranges, plus the number controls */}
        <section className="card p-6 sm:p-8" aria-labelledby="top3">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 id="top3" className="eyebrow">Your top 3 AI opportunities</h2>
            {unlocked && changed && (
              <button type="button" onClick={resetNumbers} className="text-xs text-muted underline hover:text-ink">
                Reset to my answers
              </button>
            )}
          </div>
          <div className="space-y-5">
            {opps.map((o, i) => (
              <div key={i} className={i > 0 ? "pt-5 border-t border-border" : ""}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
                  <h3 className="font-bold text-ink">{i + 1}. {o.title}</h3>
                  <span className="font-bold text-accent whitespace-nowrap tabular-nums" aria-live="polite">
                    {usd(o.value.low)}–{usd(o.value.high)}/yr
                  </span>
                </div>
                <p className="text-sm text-ink/80 leading-relaxed mb-2">{o.why}</p>
                {unlocked && (
                  <Slider
                    id={`hours-${i}`}
                    label="Hours a week"
                    value={oppHours[i]}
                    display={`${oppHours[i]} hrs`}
                    min={0.5}
                    max={i === 0 ? Math.max(40, myHours) : 10}
                    step={0.5}
                    onChange={(v) => setOppHours((hs) => hs.map((h, j) => (j === i ? v : h)))}
                  />
                )}
                <p className="mt-1 text-xs text-muted font-mono leading-relaxed">{o.value.math}</p>
              </div>
            ))}
          </div>

          {unlocked && (
            <div className="mt-6 pt-5 border-t border-border">
              {bySalary ? (
                <Slider
                  id="salary-slider"
                  label="Annual salary of the person who does it"
                  value={salary}
                  display={`${usd(salary)}/yr`}
                  min={20_000}
                  max={Math.max(300_000, mySalary)}
                  step={1_000}
                  onChange={setSalary}
                  hint={salaryMath(salary)}
                />
              ) : (
                <Slider
                  id="rate-slider"
                  label="Cost per hour"
                  value={rate}
                  display={`${usd(rate)}/hr`}
                  min={10}
                  max={Math.max(500, myRate)}
                  step={5}
                  onChange={setRate}
                />
              )}
            </div>
          )}

          <div className="mt-6 rounded-xl bg-accent/light border border-accent/30 p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">Your top 3, added up</p>
            <p className="text-3xl font-black text-accent tabular-nums" aria-live="polite">
              {usd(total.low)}–{usd(total.high)}
              <span className="text-lg font-bold text-ink/70"> a year</span>
            </p>
          </div>
        </section>

        {/* 3. Today vs. with AI */}
        {(report.today.length > 0 || report.withAi.length > 0) && (
          <section className="card p-6 sm:p-8">
            <h2 className="eyebrow mb-4">Today vs. with AI: {top.title}</h2>
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
          </section>
        )}

        {/* 4. Try it tonight */}
        <section className="card p-6 sm:p-8 border-2 border-accent/40">
          <p className="eyebrow mb-3 text-accent">Try it tonight</p>
          <h2 className="text-xl sm:text-2xl font-black text-ink mb-3">
            Paste this into Claude or ChatGPT and get a head start
          </h2>
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
        </section>

        {/* 5. Compact readiness bars, details in a popover */}
        <section className="card p-6 sm:p-8">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <h2 className="eyebrow">AI readiness: {result.tier}</h2>
            <span className="font-mono text-sm font-bold text-accent">{result.totalPct}/100</span>
          </div>
          <div className="space-y-3">
            {result.pillars.map((p) => (
              <PillarBar
                key={p.pillar}
                label={PILLAR_LABELS[p.pillar]}
                pct={p.pct}
                info={result.pillarSummaries.find((s) => s.pillar === p.pillar)?.summary ?? ""}
              />
            ))}
          </div>
        </section>
      </div>
    );

    return (
      <div className="max-w-3xl mx-auto space-y-6" ref={reportTop}>
        {/* 1. Always visible: headline and the #1 opportunity */}
        <div className="card p-6 sm:p-8">
          <p className="eyebrow mb-3">{owner} AI Opportunity Snapshot</p>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-3 text-balance">
            {shortHeadline(report.headline)}
          </h1>
          <p className="text-sm text-muted mb-6">
            Built live from your answers, including:{" "}
            <span className="text-ink/80 italic">&ldquo;{bottleneck.trim()}&rdquo;</span>
          </p>
          <div className="rounded-xl bg-accent/light border border-accent/30 p-5 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">#1 opportunity</p>
            <p className="text-lg sm:text-xl font-bold text-ink mb-1">{top.title}</p>
            <p className="text-3xl sm:text-4xl font-black text-accent tabular-nums">
              {usd(top.value.low)}–{usd(top.value.high)}
              <span className="text-lg font-bold text-ink/70"> a year</span>
            </p>
          </div>
          {unlocked && (
            <p className="mt-4 text-sm text-ink font-semibold">
              A copy is on its way to {sentTo || email} ({REPORT_ETA}).
            </p>
          )}
        </div>

        {/* Keys force fresh DOM on unlock, so nothing inert or blurred carries over. */}
        {unlocked ? (
          <div key="unlocked">{details}</div>
        ) : (
          <div key="locked" className="relative">
            <div
              aria-hidden="true"
              ref={(el) => el?.setAttribute("inert", "")}
              className="blur-[6px] select-none pointer-events-none min-h-[760px]"
            >
              {details}
            </div>
            {/* Gate card over the blurred report */}
            <div className="absolute inset-x-0 top-0 sm:top-6 flex justify-center">
              <div className="card p-6 sm:p-8 w-full max-w-md shadow-2xl bg-cream">
                {gateStep === "details" ? (
                  <>
                    <p className="eyebrow mb-2">Your snapshot is ready</p>
                    <h2 className="text-2xl font-black text-ink mb-2">Unlock your full snapshot</h2>
                    <p className="text-sm text-ink/80 leading-relaxed mb-5">
                      This came from about 3 minutes of answers. Imagine what a one-on-one
                      conversation and a few days of analysis would uncover.
                    </p>
                    <form onSubmit={(e) => { e.preventDefault(); sendCode(); }} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="g-first" className={labelCls}>First name</label>
                          <input id="g-first" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required maxLength={80} autoComplete="given-name" className={input} />
                        </div>
                        <div>
                          <label htmlFor="g-company" className={labelCls}>Company</label>
                          <input id="g-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} required maxLength={200} autoComplete="organization" className={input} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="g-email" className={labelCls}>Email</label>
                        <input
                          id="g-email"
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setSuggestion(null); }}
                          required
                          maxLength={200}
                          autoComplete="email"
                          placeholder="you@yourbusiness.com"
                          className={input}
                        />
                      </div>
                      <div>
                        <label htmlFor="g-size" className={labelCls}>Company size</label>
                        <select id="g-size" value={companySize} onChange={(e) => setCompanySize(e.target.value)} required className={input}>
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
                        {submitting ? "Checking…" : "Unlock my full snapshot"}
                      </button>
                      {submitError && (
                        <div role="alert" className="text-sm text-accent text-center space-y-2">
                          <p>{submitError}</p>
                          {suggestion && (
                            <div className="flex flex-wrap justify-center gap-2">
                              <button
                                type="button"
                                className="btn-secondary text-xs px-3 py-1.5"
                                onClick={() => { setEmail(suggestion); sendCode({ address: suggestion }); }}
                              >
                                Use {suggestion}
                              </button>
                              <button
                                type="button"
                                className="btn-ghost text-xs px-3 py-1.5 underline"
                                onClick={() => sendCode({ keepTypo: true })}
                              >
                                No, mine is right
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-muted leading-relaxed">
                        We&apos;ll email you a 6-digit code to unlock it, then a copy of your snapshot. {PRIVACY_LINE}
                      </p>
                    </form>
                  </>
                ) : (
                  <>
                    <p className="eyebrow mb-2">Check your email</p>
                    <h2 className="text-2xl font-black text-ink mb-2">Enter your 6-digit code</h2>
                    <p className="text-sm text-ink/80 leading-relaxed mb-5">
                      We sent it to <span className="font-semibold text-ink break-all">{sentTo}</span>. It expires in 15 minutes.
                      Not there? Check spam or promotions.
                    </p>
                    <form onSubmit={verifyCode} className="space-y-3">
                      <label htmlFor="g-code" className="sr-only">6-digit code</label>
                      <input
                        id="g-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9 ]*"
                        maxLength={7}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^\d ]/g, ""))}
                        autoFocus
                        placeholder="123456"
                        className={`${input} text-center text-2xl font-mono tracking-[0.4em]`}
                      />
                      {honeypot}
                      <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base disabled:opacity-50">
                        {submitting ? "Checking…" : "Unlock my snapshot"}
                      </button>
                      {submitError && <p role="alert" className="text-sm text-accent text-center">{submitError}</p>}
                      {notice && <p role="status" className="text-sm text-ink/80 text-center">{notice}</p>}
                    </form>
                    <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
                      <button
                        type="button"
                        onClick={() => sendCode({ resend: true, address: sentTo })}
                        disabled={submitting || resendsLeft <= 0}
                        className="text-accent font-semibold underline disabled:text-muted disabled:no-underline disabled:cursor-not-allowed"
                      >
                        {resendsLeft > 0 ? "Resend code" : "No resends left"}
                      </button>
                      <button type="button" onClick={changeEmail} disabled={submitting} className="text-muted underline hover:text-ink">
                        Change email
                      </button>
                    </div>
                  </>
                )}
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
            {/* 6. Next step */}
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

            {/* 7. Booking calendar, last */}
            {BOOKING_EMBED_URL && (
              <div className="card overflow-hidden bg-paper" style={{ minHeight: 540 }}>
                <iframe src={BOOKING_EMBED_URL} width="100%" height="640" frameBorder="0" title="Schedule a call with Tyler Capps" loading="lazy" />
              </div>
            )}

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

// Native range input: mouse, touch, and keyboard (arrows, Page Up/Down, Home/End).
function Slider(props: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div className="mt-2">
      <div className="flex justify-between gap-4 text-sm mb-1">
        <label htmlFor={props.id} className="font-semibold text-ink">{props.label}</label>
        <span className="font-mono text-accent font-bold whitespace-nowrap tabular-nums">{props.display}</span>
      </div>
      <input
        id={props.id}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        aria-valuetext={props.display}
        onChange={(e) => props.onChange(parseFloat(e.target.value))}
        className="snapshot-range w-full"
      />
      {props.hint && <p className="text-xs text-muted font-mono">{props.hint}</p>}
    </div>
  );
}

// Compact bar with an (i) button. Click or tap opens the explanation; Escape
// or a tap elsewhere closes it.
function PillarBar({ label, pct, info }: { label: string; pct: number; info: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  const id = `pillar-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div ref={ref} className="relative">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="flex items-center gap-1.5 font-semibold text-ink">
          {label}
          <button
            type="button"
            aria-label={`What ${label} means`}
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center justify-center w-6 h-6 -my-1 rounded-full border border-ink/25 text-[11px] font-bold text-muted hover:text-ink hover:border-ink/50"
          >
            i
          </button>
        </span>
        <span className="font-mono text-muted">{pct}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      {open && (
        <div
          id={id}
          role="note"
          className="absolute z-20 left-0 right-0 sm:right-auto sm:max-w-sm mt-2 rounded-xl border border-border bg-cream shadow-xl p-3 text-sm text-ink/80 leading-relaxed"
        >
          {info}
        </div>
      )}
    </div>
  );
}
