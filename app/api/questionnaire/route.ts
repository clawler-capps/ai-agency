import { NextRequest, NextResponse } from "next/server";
import { forwardLead } from "@/lib/leads";

interface QuestionnaireBody {
  name?: string;
  email?: string;
  business?: string;
  hoursPerWeek?: string;
  timeDrains?: string;
  tools?: string;
  aiTools?: string;
  comfortLevel?: number | string;
  automationBlocker?: string;
  team?: string;
  goals?: string;
}

export async function POST(request: NextRequest) {
  let body: QuestionnaireBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { name, email } = body;

  if (!name || !name.trim()) {
    return NextResponse.json(
      { success: false, error: "Name is required" },
      { status: 400 }
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, error: "A valid email is required" },
      { status: 400 }
    );
  }

  // Forwarding is best-effort: a missing or failing webhook or email must
  // never block the visitor. forwardLead logs the payload on failure so
  // submissions stay recoverable from server logs.
  const status = await forwardLead("questionnaire", { ...body });
  console.log("[questionnaire] Submission:", { email, status });

  // Acknowledge the submission regardless of webhook outcome so the visitor
  // always sees the thank-you card. Failures are surfaced in the server logs.
  return NextResponse.json({ success: true });
}
