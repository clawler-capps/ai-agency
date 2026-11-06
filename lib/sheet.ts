// Server-side only. Posts anonymous Snapshot statistics to Tyler's Google Sheet
// ("AI Snapshot Responses") through its Apps Script web app.
//
// Env: SNAPSHOT_SHEET_URL (the /exec URL) and SNAPSHOT_SHEET_SECRET (shared
// secret the script checks). No names or emails are ever sent. GoHighLevel
// holds contact details; the sheet is for answer statistics only.
//
// Never throws and never blocks the visitor: callers run it inside waitUntil.
// Logs status only, per the logging rule in lib/leads.ts.

import type { Status } from "@/lib/leads";

// Apps Script queues writes behind its lock, so a burst of steps can take a
// few seconds. This runs after the response, so the wait never reaches the visitor.
const SHEET_TIMEOUT_MS = 8000;

const EMAIL_ANYWHERE = /[^\s@<>()"']+@[^\s@<>()"']+\.[a-z]{2,}/gi;
export const looksLikeEmail = (s: string) => new RegExp(EMAIL_ANYWHERE.source, "i").test(s);
const scrub = (s: unknown) => (typeof s === "string" ? s.replace(EMAIL_ANYWHERE, "[email removed]") : s);

export async function postSheet(type: "lead" | "step", row: Record<string, unknown>): Promise<Status> {
  const url = process.env.SNAPSHOT_SHEET_URL;
  const secret = process.env.SNAPSHOT_SHEET_SECRET;
  if (!url || !secret) {
    console.log(`[sheet] ${type} skipped: sheet not configured`);
    return "skipped";
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SHEET_TIMEOUT_MS);
  try {
    // Apps Script answers a POST with a redirect to the result; fetch follows it.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, secret, row }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !data?.ok) {
      console.error(`[sheet] ${type} failed: status=${res.status} error=${data?.error ?? "bad response"}`);
      return "failed";
    }
    console.log(`[sheet] ${type} saved`);
    return "sent";
  } catch (err) {
    console.error(`[sheet] ${type} failed:`, err instanceof Error ? err.name : "error");
    return "failed";
  } finally {
    clearTimeout(timer);
  }
}

// Columns of the Leads tab, taken from the GHL lead payload. Name and email
// are left out on purpose.
const LEAD_COLUMNS = [
  "test",
  "industry",
  "company_size",
  "revenue_band",
  "role",
  "q1_answer",
  "q2_answer",
  "q3_answer",
  "q4_answer",
  "q5_answer",
  "q6_answer",
  "q7_answer",
  "q8_answer",
  "q9_answer",
  "bottleneck",
  "followup_choice",
  "followup_text",
  "hours_per_week",
  "cost_basis",
  "hourly_value",
  "score",
  "tier",
  "score_data",
  "score_process",
  "score_team",
  "score_leadership",
  "score_vertical",
  "est_value_low",
  "est_value_high",
  "top_opportunity",
  "consent",
] as const;

export function sheetLeadRow(payload: Record<string, unknown>, source: string): Record<string, unknown> {
  const row: Record<string, unknown> = { source };
  for (const key of LEAD_COLUMNS) row[key] = scrub(payload[key]);
  return row;
}
