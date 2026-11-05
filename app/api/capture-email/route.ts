import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { SIZE_LABELS } from "@/components/assessment/questions";
import { checkEmail } from "@/lib/email-check";
import { clamp, clientIp, createRateLimiter } from "@/lib/guard";
import { leadPayload, readSnapshotToken, snapshotInput, withCostDefaults } from "@/lib/intake";
import { formatLead, funnelEnabled, postLeadWebhook, sendEmail } from "@/lib/leads";
import { deliverReport } from "@/lib/report";
import { totalValue, usd } from "@/lib/snapshot";

// AI Opportunity Snapshot, step 2: "Unlock my full snapshot".
// 1. Instant email checks: syntax, typo, throwaway domain, mail server (MX
//    lookup with a short timeout; a slow lookup lets the address through).
// 2. Post the lead to GoHighLevel (Inbound Webhook). If that fails, return an
//    error so the visitor can retry and the lead isn't lost.
// 3. After responding, email the report, notify Tyler, and post the report
//    webhook (lib/report.ts).
// The report itself comes from the signed snapshot token, so it can't be edited.

export const maxDuration = 60;

const TEST_EMAILS = ["zephyrways@gmail.com"];
const SIZES = Object.values(SIZE_LABELS);

// See lib/guard.ts for the caveats on in-memory limits.
const ipLimited = createRateLimiter(5, 60 * 60 * 1000);
const emailLimited = createRateLimiter(3, 60 * 60 * 1000);

const fail = (error: string, status: number, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ success: false, error, ...extra }, { status });

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
  const company = clamp(body.company, 200);
  if (!firstName) return fail("Please enter your first name.", 400);
  // Company and size are optional on the unlock form.

  const snap = readSnapshotToken(body.token);
  if (!snap) return fail("This snapshot has expired. Please retake it (it only takes 3 minutes).", 400);

  const check = await checkEmail(clamp(body.email, 200), body.keepTypo === true);
  if (!check.ok) {
    console.log(`[capture-email] email rejected reason=${check.reason}`);
    return fail(check.error, 400, { reason: check.reason, suggestion: check.suggestion });
  }
  const email = check.email;

  if (ipLimited(clientIp(request)) || emailLimited(email)) {
    return fail("You've submitted a few times already. We'll be in touch soon.", 429);
  }

  const consent = body.consent === true;
  const companySize = SIZES.find((s) => s === body.companySize) ?? "";
  const details = withCostDefaults(snap.details);
  const { report, source } = snap;
  const input = snapshotInput(snap.answers, details);
  const isTest = TEST_EMAILS.includes(email);
  const payload = leadPayload({ firstName, email, company, companySize, consent, isTest }, snap.answers, details, report);
  const total = totalValue(report.opportunities, details.hourlyValue);

  // Save the lead first, so it's never lost even if the email fails later.
  const webhook = await postLeadWebhook("website-assessment", payload);
  if (funnelEnabled() && webhook !== "sent") {
    console.error(`[capture-email] Lead not saved: webhook=${webhook} test=${isTest}`);
    return fail("We couldn't save your details just now. Please try again in a moment.", 502);
  }
  console.log(`[capture-email] webhook=${webhook} source=${source} test=${isTest} ms=${Date.now() - startedAt}`);

  // Report email, Tyler's notification, and the report webhook run after the response.
  waitUntil(
    Promise.all([
      deliverReport(
        { firstName, email, company, isTest },
        { ...input, companySize: payload.company_size },
        report,
        source,
        startedAt
      ),
      sendEmail("snapshot-notify", {
        to: process.env.TYLER_NOTIFICATION_EMAIL ?? "",
        replyTo: email,
        subject:
          `${isTest ? "[TEST] " : ""}[snapshot] ${firstName}, ${company || "no company given"} (${payload.industry}, ${payload.tier}, ` +
          `${usd(total.low)}–${usd(total.high)}/yr)${source === "template" ? " [template report]" : ""}`,
        text: `Industry: ${payload.industry}\nWebhook: ${webhook}\nReport: ${source}\nEmail checks: passed (not code-verified)\n\n${formatLead("website-assessment", payload)}`,
      }),
    ]).catch((err) => console.error("[capture-email] Background work failed:", err?.name ?? "error"))
  );

  return NextResponse.json({ success: true, email, firstName, company });
}
