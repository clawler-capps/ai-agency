import { NextRequest, NextResponse } from "next/server";

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

  const webhookUrl = process.env.QUESTIONNAIRE_WEBHOOK_URL;

  // Forwarding to the webhook is best-effort: a missing OR failing webhook must
  // never block the visitor from completing the form. We always log the payload
  // so submissions stay recoverable from server logs even if forwarding fails.
  if (!webhookUrl) {
    console.warn(
      "[questionnaire] QUESTIONNAIRE_WEBHOOK_URL is not set — skipping forward. Payload:",
      body
    );
    return NextResponse.json({ success: true });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, submittedAt: new Date().toISOString() }),
    });

    if (!res.ok) {
      console.error(
        `[questionnaire] Webhook responded with ${res.status} ${res.statusText}. Payload:`,
        body
      );
    }
  } catch (err) {
    console.error(
      "[questionnaire] Failed to forward to webhook:",
      err,
      "Payload:",
      body
    );
  }

  // Acknowledge the submission regardless of webhook outcome so the visitor
  // always sees the thank-you card. Failures are surfaced in the server logs.
  return NextResponse.json({ success: true });
}
