import { NextRequest, NextResponse } from "next/server";

interface PillarPayload {
  pillar: string;
  raw: number;
  max: number;
  pct: number;
}

interface CaptureEmailBody {
  name?: string;
  email: string;
  company?: string;
  tier?: "AI-Curious" | "AI-Ready" | "AI-Leading";
  totalPct?: number;
  pillars?: PillarPayload[];
  industry?: string;
  answers?: { questionId: number; label: string }[];
}

export async function POST(request: NextRequest) {
  let body: CaptureEmailBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, email, company, tier, totalPct, pillars, industry, answers } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  console.log("[capture-email] New lead:", {
    name,
    email,
    company,
    tier,
    totalPct,
    industry,
    pillars,
    answers,
  });

  // ── Wire up Resend (or any email provider) here ────────────────────────────
  // Example with Resend:
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // await resend.emails.send({
  //   from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
  //   to: process.env.TYLER_NOTIFICATION_EMAIL ?? "",
  //   subject: `[${tier ?? "lead"}] ${company ?? name ?? email}`,
  //   text: [
  //     `Name: ${name}`,
  //     `Email: ${email}`,
  //     `Company: ${company}`,
  //     `Industry: ${industry}`,
  //     `Tier: ${tier} (${totalPct}%)`,
  //     `Pillars: ${JSON.stringify(pillars, null, 2)}`,
  //     `Answers: ${JSON.stringify(answers, null, 2)}`,
  //   ].join("\n"),
  // });
  // ──────────────────────────────────────────────────────────────────────────

  return NextResponse.json({ success: true });
}
