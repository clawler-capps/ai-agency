import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { clamp, clientIp, createRateLimiter } from "@/lib/guard";
import { leadPayload, readSnapshotToken, snapshotInput, withCostDefaults } from "@/lib/intake";
import { formatLead, funnelEnabled, postLeadWebhook, sendEmail } from "@/lib/leads";
import { deliverReport } from "@/lib/report";
import { totalValue, usd } from "@/lib/snapshot";
import { checkCode, releaseCode } from "@/lib/verify";

// AI Opportunity Snapshot, step 2b: the visitor enters the 6-digit code from
// /api/capture-email/send-code. Only a correct code unlocks the report.
// 1. Check the code against its signed token (no database).
// 2. Post the lead to GoHighLevel (Inbound Webhook). If that fails, return an
//    error so the visitor can retry and the lead isn't lost.
// 3. After responding, email the same report, notify Tyler, and post the
//    report webhook (lib/report.ts).

export const maxDuration = 60;

const TEST_EMAILS = ["zephyrways@gmail.com"];

// Code tries per IP, and unlocks per IP (the original limit). See lib/guard.ts.
const triesLimited = createRateLimiter(25, 60 * 60 * 1000);
const unlocksLimited = createRateLimiter(5, 60 * 60 * 1000);

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

  // Honeypot: post nothing, and answer like a wrong code so nothing unlocks.
  if (clamp(body.fax, 200)) return fail("That code isn't right. Please check it and try again.", 400);

  const ip = clientIp(request);
  if (triesLimited(ip)) return fail("Too many tries. Please wait a few minutes and try again.", 429);

  const snapshotToken = typeof body.token === "string" ? body.token : "";
  const snap = readSnapshotToken(snapshotToken);
  if (!snap) {
    return fail("This snapshot has expired. Please retake it (it only takes 3 minutes).", 400);
  }

  const result = checkCode(body.codeToken, body.code, snapshotToken);
  if (!result.ok) {
    console.log(`[capture-email] code rejected status=${result.status}`);
    return fail(result.error, result.status, {
      codeToken: result.codeToken,
      attemptsLeft: result.attemptsLeft,
      expired: result.expired ?? false,
    });
  }
  if (unlocksLimited(ip)) {
    releaseCode(result.nonce);
    return fail("You've submitted a few times already. We'll be in touch soon.", 429);
  }

  const { firstName, email, company, companySize, consent } = result.contact;
  const details = withCostDefaults(snap.details);
  const { report, source } = snap;
  const input = snapshotInput(snap.answers, details);
  const isTest = TEST_EMAILS.includes(email.toLowerCase());
  const payload = leadPayload({ firstName, email, company, companySize, consent, isTest }, snap.answers, details, report);
  const total = totalValue(report.opportunities, details.hourlyValue);

  // Save the lead first, so it's never lost even if the email fails later.
  const webhook = await postLeadWebhook("website-assessment", payload);
  if (funnelEnabled() && webhook !== "sent") {
    releaseCode(result.nonce);
    console.error(`[capture-email] Lead not saved: webhook=${webhook} test=${isTest}`);
    return fail("We couldn't save your details just now. Please try again in a moment.", 502);
  }
  console.log(`[capture-email] verified webhook=${webhook} source=${source} test=${isTest}`);

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
          `${isTest ? "[TEST] " : ""}[snapshot] ${firstName}, ${company} (${payload.industry}, ${payload.tier}, ` +
          `${usd(total.low)}–${usd(total.high)}/yr)${source === "template" ? " [template report]" : ""}`,
        text: `Industry: ${payload.industry}\nWebhook: ${webhook}\nReport: ${source}\nEmail verified: yes\n\n${formatLead("website-assessment", payload)}`,
      }),
    ]).catch((err) => console.error("[capture-email] Background work failed:", err?.name ?? "error"))
  );

  return NextResponse.json({ success: true, email, firstName, company });
}
