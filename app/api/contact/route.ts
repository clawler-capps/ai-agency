import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { clamp, clientIp, createRateLimiter, escapeHtml } from "@/lib/guard";
import { postLeadWebhook } from "@/lib/leads";

interface ContactBody {
  name?: string;
  email?: string;
  company?: string;
  question?: string;
  // Honeypots — real users never fill these in; bots often do.
  website?: string;
  fax?: string;
}

// Max 5 submissions per IP per hour. See lib/guard.ts for the caveats.
const isRateLimited = createRateLimiter(5, 60 * 60 * 1000);

export async function POST(request: NextRequest) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  // Honeypots: if either hidden field is filled, silently accept and drop the
  // submission so bots don't learn they were caught. No email is sent.
  if ((body.website && body.website.trim()) || (body.fax && body.fax.trim())) {
    return NextResponse.json({ success: true });
  }

  const name = clamp(body.name, 120);
  const email = clamp(body.email, 200);
  const company = clamp(body.company, 200);
  const question = clamp(body.question, 5000);

  if (!name) {
    return NextResponse.json(
      { success: false, error: "Please enter your name." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (!question) {
    return NextResponse.json(
      { success: false, error: "Please include a short message." },
      { status: 400 }
    );
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Thanks — looks like you've already reached out a few times. We'll be in touch soon.",
      },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TYLER_NOTIFICATION_EMAIL;

  // Best-effort send. Tyler's address lives only in server env — it is never
  // shipped to the browser, so it can't be scraped off the page. If email
  // isn't configured yet, we still log the message and return success so the
  // visitor always sees a warm confirmation.
  if (!apiKey || !to) {
    console.warn(
      "[contact] Email not configured (RESEND_API_KEY / TYLER_NOTIFICATION_EMAIL). Submission:",
      { name, email, company, question }
    );
    return NextResponse.json({ success: true });
  }

  try {
    const resend = new Resend(apiKey);
    // Resend does NOT throw on API errors (e.g. an unverified domain) — it
    // resolves with an `error` field. We must inspect it, or failed sends
    // would silently look successful and messages would be lost.
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to,
      // Reply goes straight to the visitor — one tap to respond.
      reply_to: email,
      subject: `New contact form message from ${name}`,
      text: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Company: ${company || "—"}`,
        "",
        "Message:",
        question,
      ].join("\n"),
      html: [
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
        `<p><strong>Company:</strong> ${company ? escapeHtml(company) : "—"}</p>`,
        `<p><strong>Message:</strong></p>`,
        `<p style="white-space:pre-wrap">${escapeHtml(question)}</p>`,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] Resend returned an error:", error, {
        name,
        email,
        company,
        question,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Something went wrong sending your message. Please try again.",
        },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[contact] Failed to send email:", err, {
      name,
      email,
      company,
      question,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong sending your message. Please try again.",
      },
      { status: 502 }
    );
  }

  // Email is already sent above, so only post to the CRM webhook here.
  await postLeadWebhook("contact", { name, email, company, question });

  return NextResponse.json({ success: true });
}
