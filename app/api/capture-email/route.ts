import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { SIZE_LABELS } from "@/components/assessment/questions";
import { clamp, clientIp, createRateLimiter, EMAIL_RE } from "@/lib/guard";
import { SnapshotToken, snapshotInput, summarizeQuiz } from "@/lib/intake";
import { formatLead, funnelEnabled, postLeadWebhook, sendEmail } from "@/lib/leads";
import { deliverReport } from "@/lib/report";
import { estimateValue, totalValue, usd } from "@/lib/snapshot";
import { verifyToken } from "@/lib/token";

// AI Opportunity Snapshot, step 2: the email gate ("Unlock my full snapshot").
// 1. Verify the signed report from /api/snapshot. No second AI call.
// 2. Post the lead to GoHighLevel (Inbound Webhook) right away. If that fails,
//    return an error so the visitor can retry and the lead isn't lost.
// 3. After responding, email that exact report, notify Tyler, and post the
//    report webhook (lib/report.ts).

export const maxDuration = 60;

const TEST_EMAILS = ["zephyrways@gmail.com"];
const SIZES = Object.values(SIZE_LABELS);

// Max 5 unlocks per IP per hour. See lib/guard.ts for the caveats.
const isRateLimited = createRateLimiter(5, 60 * 60 * 1000);

const fail = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: silently accept and drop so bots don't learn they were caught.
  if (clamp(body.fax, 200)) return NextResponse.json({ success: true });

  const firstName = clamp(body.firstName, 80).split(/\s+/)[0] ?? "";
  const email = clamp(body.email, 200);
  const company = clamp(body.company, 200);
  const consent = body.consent === true;

  if (!firstName) return fail("Please enter your first name.", 400);
  if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.", 400);
  if (!company) return fail("Please enter your company name.", 400);

  const snap = verifyToken<SnapshotToken>(body.token);
  if (!snap || snap.v !== 1) {
    return fail("This snapshot has expired. Please retake it (it only takes 3 minutes).", 400);
  }
  if (isRateLimited(clientIp(request))) {
    return fail("You've submitted a few times already. We'll be in touch soon.", 429);
  }

  const { details, report, source } = snap;
  const quiz = summarizeQuiz(snap.answers);
  const input = snapshotInput(snap.answers, details);
  const companySize = SIZES.find((s) => s === body.companySize) ?? quiz.companySize;
  const isTest = TEST_EMAILS.includes(email.toLowerCase());
  const value = estimateValue(details.hoursPerWeek, details.hourlyValue);
  const total = totalValue(report.opportunities, details.hourlyValue);

  const tags = [
    "assessment-submitted",
    `assessment-${quiz.result.tier.toLowerCase()}`,
    ...(consent ? ["marketing-consent"] : []),
    ...(isTest ? ["test-lead"] : []),
  ];

  // Flat, snake_case fields so each one maps cleanly in the GHL workflow.
  // Keep existing names stable; GHL mappings depend on them.
  const payload = {
    name: firstName,
    first_name: firstName,
    email,
    company,
    company_size: companySize,
    industry: quiz.result.industry,
    role: details.role,
    website: details.website,
    revenue_band: details.revenueBand,
    bottleneck: details.bottleneck,
    followup_choice: details.followupChoice,
    followup_text: details.followupText,
    hours_per_week: details.hoursPerWeek,
    hourly_value: details.hourlyValue,
    est_value_low: value.low,
    est_value_high: value.high,
    top_opportunity: report.opportunities[0]?.title ?? "",
    score: quiz.result.totalPct,
    tier: quiz.result.tier,
    ...Object.fromEntries(quiz.result.pillars.map((p) => [`score_${p.pillar}`, p.pct])),
    ...quiz.answerFields,
    answers_summary: quiz.answersSummary,
    consent,
    test: isTest,
    tags: tags.join(","),
  };

  // Save the lead first, so it's never lost even if the email fails later.
  const webhook = await postLeadWebhook("website-assessment", payload);
  if (funnelEnabled() && webhook !== "sent") {
    console.error(`[capture-email] Lead not saved: webhook=${webhook} test=${isTest}`);
    return fail("We couldn't save your details just now. Please try again in a moment.", 502);
  }
  console.log(`[capture-email] webhook=${webhook} source=${source} test=${isTest}`);

  // Report email, Tyler's notification, and the report webhook run after the response.
  waitUntil(
    Promise.all([
      deliverReport({ firstName, email, company, isTest }, { ...input, companySize }, report, source, startedAt),
      sendEmail("snapshot-notify", {
        to: process.env.TYLER_NOTIFICATION_EMAIL ?? "",
        replyTo: email,
        subject:
          `${isTest ? "[TEST] " : ""}[snapshot] ${firstName}, ${company} (${quiz.result.tier}, ` +
          `${usd(total.low)}–${usd(total.high)}/yr)${source === "template" ? " [template report]" : ""}`,
        text: `Webhook: ${webhook}\nReport: ${source}\n\n${formatLead("website-assessment", payload)}`,
      }),
    ]).catch((err) => console.error("[capture-email] Background work failed:", err?.name ?? "error"))
  );

  return NextResponse.json({ success: true });
}
