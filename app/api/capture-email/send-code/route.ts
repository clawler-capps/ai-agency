import { NextRequest, NextResponse } from "next/server";
import { SIZE_LABELS } from "@/components/assessment/questions";
import { checkEmail } from "@/lib/email-check";
import { clamp, clientIp, createRateLimiter, escapeHtml } from "@/lib/guard";
import { SnapshotToken } from "@/lib/intake";
import { sendEmail } from "@/lib/leads";
import { verifyToken } from "@/lib/token";
import { MAX_RESENDS, issueCodeToken, newCode, readCodeToken, snapshotHash } from "@/lib/verify";

// AI Opportunity Snapshot, step 2a: "Unlock my full snapshot".
// Checks the address (syntax, typo, throwaway domain, mail server), then emails
// a 6-digit code. Nothing is saved or posted to the CRM here; that only happens
// in /api/capture-email once the code is entered.

const SIZES = Object.values(SIZE_LABELS);

// See lib/guard.ts for the caveats on in-memory limits.
const ipLimited = createRateLimiter(10, 60 * 60 * 1000);
const emailLimited = createRateLimiter(1 + MAX_RESENDS, 60 * 60 * 1000);

type Fail = { error: string; reason?: string; suggestion?: string };
const fail = (body: Fail, status: number) => NextResponse.json({ success: false, ...body }, { status });

function codeEmail(firstName: string, code: string) {
  const text = [
    `Hi ${firstName},`,
    "",
    `Your code is ${code}`,
    "",
    "Enter it on the page to unlock your AI Opportunity Snapshot. It expires in 15 minutes.",
    "",
    "If you didn't ask for this, you can ignore this email.",
    "",
    "Tyler Capps",
    "Sacramento AI Agency",
  ].join("\n");
  const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0d0f12;max-width:480px;margin:0 auto;line-height:1.55;font-size:15px">
<p>Hi ${escapeHtml(firstName)},</p>
<p style="margin:0 0 6px">Your code is</p>
<p style="font-size:32px;font-weight:800;letter-spacing:6px;margin:0 0 16px;color:#e85d26">${code}</p>
<p>Enter it on the page to unlock your AI Opportunity Snapshot. It expires in 15 minutes.</p>
<p style="color:#777;font-size:13px">If you didn't ask for this, you can ignore this email.</p>
<p>Tyler Capps<br>Sacramento AI Agency</p>
</div>`;
  return { subject: `${code} is your AI Snapshot code`, text, html };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail({ error: "Invalid request." }, 400);
  }

  const firstName = clamp(body.firstName, 80).split(/\s+/)[0] ?? "";
  const company = clamp(body.company, 200);
  const rawEmail = clamp(body.email, 200);
  const snapshotToken = typeof body.token === "string" ? body.token : "";

  if (!firstName) return fail({ error: "Please enter your first name." }, 400);
  if (!company) return fail({ error: "Please enter your company name." }, 400);

  // Honeypot: look like it worked, send nothing. The code step can never pass.
  if (clamp(body.fax, 200)) {
    return NextResponse.json({ success: true, codeToken: "", email: rawEmail.toLowerCase(), resendsLeft: MAX_RESENDS });
  }

  const snap = verifyToken<SnapshotToken>(snapshotToken);
  if (!snap || snap.v !== 1) {
    return fail({ error: "This snapshot has expired. Please retake it (it only takes 3 minutes)." }, 400);
  }

  const check = await checkEmail(rawEmail, body.keepTypo === true);
  if (!check.ok) {
    console.log(`[send-code] rejected reason=${check.reason}`);
    return fail({ error: check.error, reason: check.reason, suggestion: check.suggestion }, 400);
  }
  const email = check.email;

  // A resend carries the previous code token, so the count survives.
  let sends = 1;
  if (body.resendToken) {
    const prev = readCodeToken(body.resendToken);
    if (prev && prev.snap === snapshotHash(snapshotToken) && prev.contact.email === email) {
      sends = prev.sends + 1;
    }
  }
  if (sends > 1 + MAX_RESENDS) {
    return fail({ error: "We've sent a few codes already. Check your spam folder, or try again in an hour." }, 429);
  }
  if (ipLimited(clientIp(request)) || emailLimited(email)) {
    return fail({ error: "We've sent a few codes already. Check your spam folder, or try again in an hour." }, 429);
  }

  const contact = {
    firstName,
    email,
    company,
    companySize: SIZES.find((s) => s === body.companySize) ?? "",
    consent: body.consent === true,
  };
  const code = newCode();
  const { token } = issueCodeToken(code, contact, snapshotToken, sends);

  const sent = await sendEmail("snapshot-code", { to: email, ...codeEmail(firstName, code) });
  // Status only. Never log the address or the code.
  console.log(`[send-code] email=${sent.status} sends=${sends}`);
  if (sent.status !== "sent") {
    return fail(
      { error: "We couldn't send a code to that address just now. Please check it, or try again in a minute." },
      502
    );
  }

  return NextResponse.json({ success: true, codeToken: token, email, resendsLeft: 1 + MAX_RESENDS - sends });
}
