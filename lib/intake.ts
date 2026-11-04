// Server-side only. Validates the quiz answers and the snapshot details, and
// turns them into the input the report and the CRM payload use.
import { questions, SIZE_LABELS } from "@/components/assessment/questions";
import { Answer, AssessmentResult, scoreAssessment } from "@/components/assessment/scoring";
import { clamp } from "@/lib/guard";
import type { SnapshotInput } from "@/lib/report";
import { DEFAULT_HOURLY_VALUE, REVENUE_BANDS, ROLES, Report } from "@/lib/snapshot";

const LABELS = ["A", "B", "C", "D"] as const;

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
  hourlyValue: number;
  role: string;
  revenueBand: string;
  website: string;
};

export function parseDetails(body: Record<string, unknown>): { details: Details } | { error: string } {
  const bottleneck = clamp(body.bottleneck, 1000);
  const hoursRaw = num(body.hoursPerWeek);
  const rateRaw = num(body.hourlyValue);
  if (!bottleneck) return { error: "Please tell us where you lose the most time." };
  if (Number.isNaN(hoursRaw)) return { error: "Please enter roughly how many hours a week it takes." };
  return {
    details: {
      bottleneck,
      followupChoice: clamp(body.followupChoice, 120),
      followupText: clamp(body.followupText, 300),
      hoursPerWeek: Math.round(Math.min(Math.max(hoursRaw, 0.5), 80) * 2) / 2,
      hourlyValue: Number.isNaN(rateRaw) ? DEFAULT_HOURLY_VALUE : Math.round(Math.min(Math.max(rateRaw, 10), 1000)),
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
  };
}
