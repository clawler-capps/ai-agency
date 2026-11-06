import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { questions } from "@/components/assessment/questions";
import { STEP_IDS, StepId } from "@/components/assessment/steps";
import { clientIp, createRateLimiter } from "@/lib/guard";
import { funnelEnabled } from "@/lib/leads";
import { looksLikeEmail, postSheet } from "@/lib/sheet";

// Anonymous Snapshot step events → Steps tab of the stats sheet.
// Everything is validated here, so the client can only choose a known step and,
// for multiple-choice steps, a valid option letter. No free text gets through.
// The sheet secret stays on the server. Always answers 204 right away.

// Leaves time for the sheet write that runs after the 204 (lib/sheet.ts).
export const maxDuration = 15;

// A full Snapshot sends 14 events; this leaves room for a few retakes.
const isRateLimited = createRateLimiter(60, 10 * 60 * 1000);
const MAX_BODY = 1000;

const done = () => new NextResponse(null, { status: 204 });

export async function POST(request: NextRequest) {
  const raw = await request.text().catch(() => "");
  // Too big, or anything that looks like an email: drop it.
  if (!raw || raw.length > MAX_BODY || looksLikeEmail(raw)) return done();

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return done();
  }

  const sessionId = typeof body.session_id === "string" ? body.session_id : "";
  const stepId = STEP_IDS.find((s) => s === body.step_id) as StepId | undefined;
  if (!/^[a-f0-9]{32}$/.test(sessionId) || !stepId) return done();

  // Multiple-choice steps: the option text for a valid letter. Others: "answered".
  let answer = "answered";
  if (stepId === "start") answer = "";
  const q = /^q(\d)$/.exec(stepId);
  if (q) {
    const question = questions.find((x) => x.id === Number(q[1]));
    const option = question?.options.find((o) => o.label === body.label);
    if (!option) return done();
    answer = option.text;
  }

  const test = body.test === true;
  // Same rule as the lead webhook: only Production writes real rows. Preview
  // and local runs write only deliberate test events (/assessment?test=1).
  if (!funnelEnabled() && !test) return done();
  if (isRateLimited(clientIp(request))) return done();

  waitUntil(
    postSheet("step", {
      session_id: sessionId,
      step_index: STEP_IDS.indexOf(stepId),
      step_id: stepId,
      answer,
      device: body.device === "mobile" ? "mobile" : "desktop",
      test,
    })
  );
  return done();
}
