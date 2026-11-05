import { NextRequest, NextResponse } from "next/server";
import { clamp, clientIp, createRateLimiter, escapeHtml } from "@/lib/guard";
import { postLeadWebhook, sendEmail } from "@/lib/leads";

// /contact form: email the message to Tyler (TYLER_NOTIFICATION_EMAIL) through
// Resend, then post it to the CRM webhook. If the email can't be sent, the
// visitor gets an error so they can retry or email Tyler directly.

interface ContactBody {
  name?: string;
  email?: string;
  company?: string;
  question?: string;
  // Honeypots. Real visitors never fill these in; bots often do.
  website?: string;
  fax?: string;
}

// Messages from this address are marked as tests in the subject line.
const TEST_EMAILS = ["zephyrways@gmail.com"];

// Max 5 submissions per IP per hour. See lib/guard.ts for the caveats.
const isRateLimited = createRateLimiter(5, 60 * 60 * 1000);

const fail = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });
const SEND_FAILED = "We couldn't send your message just now. Please try again, or email tyler@sacramentoaiagency.com.";

export async function POST(request: NextRequest) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypots: silently accept and drop, so bots don't learn they were caught.
  if ((body.website && body.website.trim()) || (body.fax && body.fax.trim())) {
    return NextResponse.json({ success: true });
  }

  const name = clamp(body.name, 120);
  const email = clamp(body.email, 200);
  const company = clamp(body.company, 200);
  const question = clamp(body.question, 5000);

  if (!name) return fail("Please enter your name.", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please enter a valid email address.", 400);
  if (!question) return fail("Please include a short message.", 400);

  if (isRateLimited(clientIp(request))) {
    return fail("Thanks for reaching out. You've sent a few messages already, so we'll be in touch soon.", 429);
  }

  // Tyler's address lives only in server env, so it never reaches the browser.
  const to = process.env.TYLER_NOTIFICATION_EMAIL ?? "";
  if (!to || !process.env.RESEND_API_KEY) {
    // Status only, per the logging rule in lib/leads.ts. Never log the message.
    console.error("[contact] Email not configured (RESEND_API_KEY or TYLER_NOTIFICATION_EMAIL missing)");
    return fail(SEND_FAILED, 503);
  }

  const isTest = TEST_EMAILS.includes(email.toLowerCase());
  const sent = await sendEmail("contact", {
    to,
    // Reply goes straight to the visitor.
    replyTo: email,
    subject: isTest ? `[TEST] Contact form check from ${name}` : `New contact form message from ${name}`,
    text: [`Name:    ${name}`, `Email:   ${email}`, `Company: ${company || "not given"}`, "", "Message:", question].join("\n"),
    html: [
      `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Company:</strong> ${company ? escapeHtml(company) : "not given"}</p>`,
      `<p><strong>Message:</strong></p>`,
      `<p style="white-space:pre-wrap">${escapeHtml(question)}</p>`,
    ].join("\n"),
  });
  if (sent.status !== "sent") {
    console.error(`[contact] Email to Tyler not sent: ${sent.status}`);
    return fail(SEND_FAILED, 502);
  }
  console.log(`[contact] Email sent: ${sent.id} test=${isTest}`);

  // Email is sent, so the CRM post is best effort.
  await postLeadWebhook("contact", { name, email, company, question });

  return NextResponse.json({ success: true });
}
