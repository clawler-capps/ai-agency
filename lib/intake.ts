// Server-side only. Validates the quiz answers and the snapshot details, and
// turns them into the input the report and the CRM payload use.
import { OPTION_LABELS, questions, SIZE_LABELS } from "@/components/assessment/questions";
import { Answer, AssessmentResult, scoreAssessment } from "@/components/assessment/scoring";
import { clamp } from "@/lib/guard";
import { verifyToken } from "@/lib/token";
import type { SnapshotInput } from "@/lib/report";
import {
  CostBasis,
  DEFAULT_HOURLY_VALUE,
  MAX_SALARY,
  MIN_SALARY,
  REVENUE_BANDS,
  ROLES,
  Report,
  clampRate,
  estimateValue,
  salaryToHourly,
} from "@/lib/snapshot";

const LABELS = OPTION_LABELS;

// Only keep answers that match a real question and option, one per question.
export function cleanAnswers(raw: unknown): Answer[] {
  if (!Array.isArray(raw)) return [];
  const byId = new Map<number, Answer>();
  for (const a of raw.slice(0, questions.length * 2)) {
    const q = questions.find((q) => q.id === a?.questionId);
    const label = LABELS.find((l) => l === a?.label);
    if (q && label && q.options.some((o) => o.label === label)) {
      byId.set(q.id, { questionId: q.id, label });
    }
  }
  return Array.from(byId.values());
}

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

export type Details = {
  bottleneck: string;
  followupChoice: string;
  followupText: string;
  hoursPerWeek: number;
  // Always the effective hourly cost. With costBasis "salary" it is
  // annualSalary / 2,080, rounded.
  hourlyValue: number;
  costBasis: CostBasis;
  annualSalary: number | null;
  role: string;
  revenueBand: string;
  website: string;
};

export function parseDetails(body: Record<string, unknown>): { details: Details } | { error: string } {
  const bottleneck = clamp(body.bottleneck, 1000);
  const hoursRaw = num(body.hoursPerWeek);
  const rateRaw = num(body.hourlyValue);
  const salaryRaw = num(body.annualSalary);
  if (!bottleneck) return { error: "Please tell us where you lose the most time." };
  if (Number.isNaN(hoursRaw)) return { error: "Please enter roughly how many hours a week it takes." };

  // Salary basis only counts when a usable salary was given; otherwise fall
  // back to the hourly figure (or the default).
  const salary =
    body.costBasis === "salary" && !Number.isNaN(salaryRaw)
      ? Math.round(Math.min(Math.max(salaryRaw, MIN_SALARY), MAX_SALARY))
      : null;
  const costBasis: CostBasis = salary ? "salary" : "hourly";
  const hourlyValue = salary
    ? salaryToHourly(salary)
    : Number.isNaN(rateRaw)
      ? DEFAULT_HOURLY_VALUE
      : clampRate(rateRaw);

  return {
    details: {
      bottleneck,
      followupChoice: clamp(body.followupChoice, 120),
      followupText: clamp(body.followupText, 300),
      hoursPerWeek: Math.round(Math.min(Math.max(hoursRaw, 0.5), 80) * 2) / 2,
      hourlyValue,
      costBasis,
      annualSalary: salary,
      role: ROLES.find((r) => r === body.role) ?? "Other",
      revenueBand: REVENUE_BANDS.find((r) => r === body.revenueBand) ?? "",
      website: clamp(body.website, 300),
    },
  };
}

// The follow-up answer in one line, e.g. "Other: waiting on the bank".
export function followupSummary(d: Pick<Details, "followupChoice" | "followupText">): string {
  if (d.followupChoice === "Other") return d.followupText ? `Other: ${d.followupText}` : "";
  return [d.followupChoice, d.followupText].filter(Boolean).join(". ");
}

export type QuizSummary = {
  result: AssessmentResult;
  companySize: string; // from Q2
  answerFields: Record<string, string>; // q1_answer…q9_answer
  answersSummary: string;
};

export function summarizeQuiz(answers: Answer[]): QuizSummary {
  const result = scoreAssessment(answers);
  const answerFields: Record<string, string> = {};
  const summary: string[] = [];
  for (const q of questions) {
    const label = answers.find((a) => a.questionId === q.id)?.label;
    const text = q.options.find((o) => o.label === label)?.text ?? "";
    answerFields[`q${q.id}_answer`] = text;
    summary.push(`Q${q.id}. ${q.question}\n${text}`);
  }
  return {
    result,
    companySize: SIZE_LABELS[result.sizeLabel] ?? "",
    answerFields,
    answersSummary: summary.join("\n\n"),
  };
}

// What the signed token carries from /api/snapshot to /api/capture-email.
export type SnapshotToken = {
  v: 1;
  answers: Answer[];
  details: Details;
  report: Report;
  source: "claude" | "template";
};

// Verifies a snapshot token and checks its shape, so a code token (signed with
// the same key) can't be passed off as a snapshot.
export function readSnapshotToken(raw: unknown): SnapshotToken | null {
  const t = verifyToken<SnapshotToken & { kind?: string }>(raw);
  if (!t || t.v !== 1 || t.kind !== undefined) return null;
  if (!Array.isArray(t.answers) || !t.details || !t.report || !Array.isArray(t.report.opportunities)) return null;
  return t;
}

export function snapshotInput(answers: Answer[], d: Details): SnapshotInput {
  const quiz = summarizeQuiz(answers);
  return {
    industry: quiz.result.industry,
    companySize: quiz.companySize,
    role: d.role,
    revenueBand: d.revenueBand,
    website: d.website,
    tier: quiz.result.tier,
    score: quiz.result.totalPct,
    pillars: quiz.result.pillars.map((p) => ({ pillar: p.pillar, pct: p.pct })),
    answersSummary: quiz.answersSummary,
    bottleneck: d.bottleneck,
    followup: followupSummary(d),
    hoursPerWeek: d.hoursPerWeek,
    hourlyValue: d.hourlyValue,
    annualSalary: d.annualSalary ?? null,
  };
}

// Tokens signed before cost basis existed.
export function withCostDefaults(d: Details): Details {
  return { ...d, costBasis: d.costBasis ?? "hourly", annualSalary: d.annualSalary ?? null };
}

export type LeadContact = {
  firstName: string;
  email: string;
  company: string;
  companySize: string;
  consent: boolean;
  isTest: boolean;
};

// The flat payload posted to the GoHighLevel lead webhook (and dumped into
// Tyler's notification email). Keep existing names stable; GHL maps them.
export function leadPayload(c: LeadContact, answers: Answer[], d: Details, report: Report) {
  const quiz = summarizeQuiz(answers);
  const value = estimateValue(d.hoursPerWeek, d.hourlyValue);
  const tags = [
    "assessment-submitted",
    `assessment-${quiz.result.tier.toLowerCase()}`,
    ...(c.consent ? ["marketing-consent"] : []),
    ...(c.isTest ? ["test-lead"] : []),
  ];
  return {
    name: c.firstName,
    first_name: c.firstName,
    email: c.email,
    // No code step any more: the address passed the instant checks only.
    email_verified: false,
    company: c.company,
    company_size: c.companySize || quiz.companySize,
    industry: quiz.result.industry,
    role: d.role,
    website: d.website,
    revenue_band: d.revenueBand,
    bottleneck: d.bottleneck,
    followup_choice: d.followupChoice,
    followup_text: d.followupText,
    hours_per_week: d.hoursPerWeek,
    hourly_value: d.hourlyValue,
    cost_basis: d.costBasis,
    annual_salary: d.annualSalary ?? "",
    est_value_low: value.low,
    est_value_high: value.high,
    top_opportunity: report.opportunities[0]?.title ?? "",
    score: quiz.result.totalPct,
    tier: quiz.result.tier,
    ...Object.fromEntries(quiz.result.pillars.map((p) => [`score_${p.pillar}`, p.pct])),
    ...quiz.answerFields,
    answers_summary: quiz.answersSummary,
    consent: c.consent,
    test: c.isTest,
    tags: tags.join(","),
  };
}
