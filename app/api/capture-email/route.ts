import { NextRequest, NextResponse } from "next/server";

interface CaptureEmailBody {
  name?: string;
  email: string;
  assessmentScore?: number;
  answers?: { questionId: number; label: string }[];
}

export async function POST(request: NextRequest) {
  let body: CaptureEmailBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, email, assessmentScore, answers } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // Log lead locally (useful during dev)
  console.log("[capture-email] New lead:", { name, email, assessmentScore, answers });

  // ── Wire up Resend (or any email provider) here ────────────────────────────
  // Example with Resend:
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // await resend.emails.send({
  //   from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
  //   to: process.env.TYLER_NOTIFICATION_EMAIL ?? "",
  //   subject: `New assessment lead: ${name ?? email}`,
  //   text: `Name: ${name}\nEmail: ${email}\nScore: ${assessmentScore}\nAnswers: ${JSON.stringify(answers, null, 2)}`,
  // });
  // ──────────────────────────────────────────────────────────────────────────

  return NextResponse.json({ success: true });
}
