import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { questions, SIZE_LABELS } from "@/components/assessment/questions";
import { Answer, scoreAssessment } from "@/components/assessment/scoring";
import { clamp, clientIp, createRateLimiter, EMAIL_RE } from "@/lib/guard";
import { formatLead, funnelEnabled, postLeadWebhook, sendEmail } from "@/lib/leads";
import { deliverReport } from "@/lib/report";
import { DEFAULT_HOURLY_VALUE, ROLES, estimateValue, matchOpportunity } from "@/lib/snapshot";

// AI Opportunity Snapshot (/assessment) submissions.
// 1. Post the lead to GoHighLevel (Inbound Webhook) right away. If that fails,
//    return an error so the visitor can retry and the lead isn't lost.
// 2. After responding, build the AI report and email it (lib/report.ts), and
//    notify Tyler.

// Background report work (website fetch + up to two Claude attempts) needs
// more than the default function time.
export const maxDuration = 60;

interface CaptureBody {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  role?: string;
  bottleneck?: string;
  hoursPerWeek?: number | string;
  hourlyValue?: number | string;
  consent?: boolean;
  answers?: { questionId?: number; label?: string }[];
  // Honeypot — real users never fill this in; bots often do.
  fax?: string;
}

const TEST_EMAILS = ["zephyrways@gmail.com"];
const LABELS = ["A", "B", "C", "D"] as const;

// Max 5 submissions per IP per hour. See lib/guard.ts for the caveats.
const isRateLimited = createRateLimiter(5, 60 * 60 * 1000);

const fail = (error: string, status: number) =>
  NextResponse.json({ success: false, error }, { status });

// Only keep answers that match a real question and option, one per question.
function cleanAnswers(raw: CaptureBody["answers"]): Answer[] {
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

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  let body: CaptureBody;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: silently accept and drop so bots don't learn they were caught.
  if (clamp(body.fax, 200)) return NextResponse.json({ success: true });

  const name = clamp(body.name, 120);
  const email = clamp(body.email, 200);
  const company = clamp(body.company, 200);
  const website = clamp(body.website, 300);
  const bottleneck = clamp(body.bottleneck, 1000);
  const role = ROLES.find((r) => r === body.role) ?? "Other";
  const consent = body.consent === true;
  const answers = cleanAnswers(body.answers);

  const hoursRaw = num(body.hoursPerWeek);
  const rateRaw = num(body.hourlyValue);
  const hoursPerWeek = Math.round(Math.min(Math.max(hoursRaw, 0.5), 80) * 2) / 2;
  const hourlyValue = Number.isNaN(rateRaw)
    ? DEFAULT_HOURLY_VALUE
    : Math.round(Math.min(Math.max(rateRaw, 10), 1000));

  if (!name) return fail("Please enter your name.", 400);
  if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.", 400);
  if (!company) return fail("Please enter your company name.", 400);
  if (!bottleneck) return fail("Please tell us where you lose the most time.", 400);
  if (Number.isNaN(hoursRaw)) return fail("Please enter roughly how many hours a week it takes.", 400);
  if (answers.length !== questions.length) {
    return fail("Some answers are missing. Please retake the snapshot.", 400);
  }

  if (isRateLimited(clientIp(request))) {
    return fail("You've submitted a few times already. We'll be in touch soon.", 429);
  }

  const result = scoreAssessment(answers);
  const isTest = TEST_EMAILS.includes(email.toLowerCase());
  const firstName = name.split(/\s+/)[0];
  const value = estimateValue(hoursPerWeek, hourlyValue);

  const answerFields: Record<string, string> = {};
  const summary: string[] = [];
  for (const q of questions) {
    const label = answers.find((a) => a.questionId === q.id)?.label;
    const text = q.options.find((o) => o.label === label)?.text ?? "";
    answerFields[`q${q.id}_answer`] = text;
    summary.push(`Q${q.id}. ${q.question}\n${text}`);
  }

  const tags = [
    "assessment-submitted",
    `assessment-${result.tier.toLowerCase()}`,
    ...(consent ? ["marketing-consent"] : []),
    ...(isTest ? ["test-lead"] : []),
  ];

  // Flat, snake_case fields so each one maps cleanly in the GHL workflow.
  const payload = {
    name,
    first_name: firstName,
    email,
    company,
    company_size: SIZE_LABELS[result.sizeLabel] ?? "",
    industry: result.industry,
    role,
    website,
    bottleneck,
    hours_per_week: hoursPerWeek,
    hourly_value: hourlyValue,
    est_value_low: value.low,
    est_value_high: value.high,
    top_opportunity: matchOpportunity(bottleneck).title,
    score: result.totalPct,
    tier: result.tier,
    ...Object.fromEntries(result.pillars.map((p) => [`score_${p.pillar}`, p.pct])),
    ...answerFields,
    answers_summary: summary.join("\n\n"),
    consent,
    test: isTest,
    tags: tags.join(","),
  };

  // Save the lead first, so it's never lost even if the report fails later.
  const webhook = await postLeadWebhook("website-assessment", payload);
  if (funnelEnabled() && webhook !== "sent") {
    console.error(`[capture-email] Lead not saved: webhook=${webhook} test=${isTest}`);
    return fail("We couldn't save your results just now. Please try again in a moment.", 502);
  }
  console.log(`[capture-email] webhook=${webhook} test=${isTest}`);

  // Report email and Tyler's notification run after the response is sent.
  waitUntil(
    Promise.all([
      deliverReport(
        {
          firstName,
          name,
          email,
          company,
          industry: result.industry,
          companySize: payload.company_size,
          role,
          website,
          tier: result.tier,
          score: result.totalPct,
          pillars: result.pillars.map((p) => ({ pillar: p.pillar, pct: p.pct })),
          answersSummary: payload.answers_summary,
          bottleneck,
          hoursPerWeek,
          hourlyValue,
          isTest,
        },
        startedAt
      ),
      sendEmail("snapshot-notify", {
        to: process.env.TYLER_NOTIFICATION_EMAIL ?? "",
        replyTo: email,
        subject: `${isTest ? "[TEST] " : ""}[snapshot] ${name}, ${company} (${result.tier}, ${value.low.toLocaleString("en-US")}–${value.high.toLocaleString("en-US")}/yr)`,
        text: `Webhook: ${webhook}\n\n${formatLead("website-assessment", payload)}`,
      }),
    ]).catch((err) => console.error("[capture-email] Background work failed:", err?.name ?? "error"))
  );

  return NextResponse.json({ success: true });
}
