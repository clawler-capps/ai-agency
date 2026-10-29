import { NextRequest, NextResponse } from "next/server";
import { forwardLead } from "@/lib/leads";

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

  const status = await forwardLead("assessment", {
    name,
    email,
    company,
    tier,
    totalPct,
    industry,
    pillars,
    answers,
  });
  console.log("[capture-email] New lead:", { email, tier, status });

  return NextResponse.json({ success: true });
}
