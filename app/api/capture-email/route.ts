import { NextRequest, NextResponse } from "next/server";
import { questions, SIZE_LABELS } from "@/components/assessment/questions";
import { Answer, scoreAssessment } from "@/components/assessment/scoring";
import { clamp, clientIp, createRateLimiter, EMAIL_RE, escapeHtml } from "@/lib/guard";
import { formatLead, funnelEnabled, postLeadWebhook, sendEmail } from "@/lib/leads";

// AI Opportunity Snapshot (/assessment) submissions.
// 1. Post the lead to GoHighLevel (Inbound Webhook). If that fails, return an
//    error so the visitor can retry and the lead isn't lost.
// 2. Email the visitor an instant confirmation and notify Tyler.
// The AI report email itself is Phase 2.

interface CaptureBody {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
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

export async function POST(request: NextRequest) {
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
  const consent = body.consent === true;
  const answers = cleanAnswers(body.answers);

  if (!name) return fail("Please enter your name.", 400);
  if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.", 400);
  if (!company) return fail("Please enter your company name.", 400);
  if (answers.length !== questions.length) {
    return fail("Some answers are missing. Please retake the snapshot.", 400);
  }

  if (isRateLimited(clientIp(request))) {
    return fail("You've submitted a few times already. We'll be in touch soon.", 429);
  }

  const result = scoreAssessment(answers);
  const isTest = TEST_EMAILS.includes(email.toLowerCase());
  const firstName = name.split(/\s+/)[0];

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
    website,
    score: result.totalPct,
    tier: result.tier,
    ...Object.fromEntries(result.pillars.map((p) => [`score_${p.pillar}`, p.pct])),
    ...answerFields,
    answers_summary: summary.join("\n\n"),
    consent,
    test: isTest,
    tags: tags.join(","),
  };

  const webhook = await postLeadWebhook("website-assessment", payload);
  if (funnelEnabled() && webhook !== "sent") {
    console.error(`[capture-email] Lead not saved: webhook=${webhook} test=${isTest}`);
    return fail("We couldn't save your results just now. Please try again in a moment.", 502);
  }

  const address = process.env.MAILING_ADDRESS?.trim() ?? "";
  const footer = `Sacramento AI Agency${address ? ` · ${address}` : ""}`;
  const confirmText = [
    `Hi ${firstName},`,
    "",
    "Thanks for taking the AI Opportunity Snapshot. Your personalized report will be emailed within 15 minutes.",
    "",
    `Your quick result: ${result.tier}, with a readiness score of ${result.totalPct}/100.`,
    "",
    "Questions in the meantime? Just reply to this email. It comes straight to me.",
    "",
    "Tyler Capps",
    "Sacramento AI Agency",
    "",
    "--",
    footer,
    "You're receiving this because you requested an AI Opportunity Snapshot at sacramentoaiagency.com.",
  ].join("\n");
  const confirmHtml = [
    `<p>Hi ${escapeHtml(firstName)},</p>`,
    "<p>Thanks for taking the AI Opportunity Snapshot. <strong>Your personalized report will be emailed within 15 minutes.</strong></p>",
    `<p>Your quick result: <strong>${escapeHtml(result.tier)}</strong>, with a readiness score of ${result.totalPct}/100.</p>`,
    "<p>Questions in the meantime? Just reply to this email. It comes straight to me.</p>",
    "<p>Tyler Capps<br>Sacramento AI Agency</p>",
    `<hr><p style="font-size:12px;color:#666">${escapeHtml(footer)}<br>You're receiving this because you requested an AI Opportunity Snapshot at sacramentoaiagency.com.</p>`,
  ].join("\n");

  const [confirm, notify] = await Promise.all([
    sendEmail("snapshot-confirm", {
      to: email,
      subject: "Your AI Opportunity Snapshot is on its way",
      text: confirmText,
      html: confirmHtml,
    }),
    sendEmail("snapshot-notify", {
      to: process.env.TYLER_NOTIFICATION_EMAIL ?? "",
      replyTo: email,
      subject: `${isTest ? "[TEST] " : ""}[snapshot] ${name}, ${company} (${result.tier} ${result.totalPct}%)`,
      text: `Webhook: ${webhook}\n\n${formatLead("website-assessment", payload)}`,
    }),
  ]);

  // Status only. Never log names, emails, or answers.
  console.log(
    `[capture-email] webhook=${webhook} confirm=${confirm.status} notify=${notify.status} test=${isTest}`
  );

  return NextResponse.json({ success: true });
}
