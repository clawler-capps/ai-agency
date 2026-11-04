import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { questions } from "@/components/assessment/questions";
import { clientIp, createRateLimiter } from "@/lib/guard";
import { SnapshotToken, cleanAnswers, parseDetails, snapshotInput } from "@/lib/intake";
import { generateReport, reportCost, sendTemplateAlert, templateReport } from "@/lib/report";
import { signToken, signingConfigured } from "@/lib/token";

// AI Opportunity Snapshot, step 1 (before the email gate).
// Writes the report with one Claude call and returns it with a signed token.
// The page shows it blurred; /api/capture-email unlocks and emails it.

export const maxDuration = 60;

// Each run costs about a cent, so keep it tight. Spend is also capped at Anthropic.
const isRateLimited = createRateLimiter(6, 60 * 60 * 1000);

const fail = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }
  if (!signingConfigured()) {
    console.error("[snapshot] REPORT_SIGNING_SECRET is not set");
    return fail("The snapshot is unavailable right now. Please try again later.", 503);
  }

  const answers = cleanAnswers(body.answers);
  if (answers.length !== questions.length) return fail("Some answers are missing. Please retake the snapshot.", 400);
  const parsed = parseDetails(body);
  if ("error" in parsed) return fail(parsed.error, 400);
  const input = snapshotInput(answers, parsed.details);

  // Honeypot: return a template report with no token, and spend nothing.
  if (typeof body.fax === "string" && body.fax.trim()) {
    return NextResponse.json({ success: true, report: templateReport(input), token: "" });
  }
  if (isRateLimited(clientIp(request))) {
    return fail("You've run a few snapshots already. Please try again in an hour.", 429);
  }

  const gen = await generateReport(input);
  const payload: SnapshotToken = { v: 1, answers, details: parsed.details, report: gen.report, source: gen.source };
  const token = signToken(payload);

  // Status only. Never log answers.
  console.log(
    `[snapshot] source=${gen.source} ms=${Date.now() - startedAt} website=${input.website ? "yes" : "no"}` +
      (gen.usage
        ? ` tokens_in=${gen.usage.input} tokens_out=${gen.usage.output} cost_usd=${reportCost(gen.usage).toFixed(4)}`
        : "")
  );
  if (gen.source === "template") {
    console.error(`[snapshot] Claude failed: ${gen.errors.map((e) => e.split(":")[1]?.trim() ?? "error").join(", ")}`);
    waitUntil(sendTemplateAlert(gen.errors));
  }

  return NextResponse.json({ success: true, report: gen.report, token, source: gen.source });
}
