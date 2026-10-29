// Server-side only. Import from API routes, never from client components.
import { Resend } from "resend";

export type LeadSource = "assessment" | "contact" | "questionnaire";
type Status = "sent" | "skipped" | "failed";

const WEBHOOK_TIMEOUT_MS = 5000;

async function postJson(url: string, body: unknown): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`[leads] Webhook responded ${res.status} ${res.statusText}. Payload:`, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[leads] Webhook post failed:", err, "Payload:", body);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// Best-effort webhook post. Never throws.
export async function postLeadWebhook(
  source: LeadSource,
  payload: Record<string, unknown>
): Promise<Status> {
  const urls: string[] = [];
  if (process.env.LEAD_WEBHOOK_URL) urls.push(process.env.LEAD_WEBHOOK_URL);
  // Legacy variable, questionnaire only.
  if (source === "questionnaire" && process.env.QUESTIONNAIRE_WEBHOOK_URL) {
    urls.push(process.env.QUESTIONNAIRE_WEBHOOK_URL);
  }
  if (urls.length === 0) {
    console.warn(`[leads] No webhook URL set, skipping forward (${source}). Payload:`, payload);
    return "skipped";
  }
  const body = { source, submittedAt: new Date().toISOString(), ...payload };
  const results = await Promise.all(urls.map((u) => postJson(u, body)));
  return results.every(Boolean) ? "sent" : "failed";
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function buildSubject(source: LeadSource, p: Record<string, unknown>): string {
  const who = [str(p.name), str(p.company) || str(p.business)].filter(Boolean).join(", ") || str(p.email) || "new lead";
  if (source === "assessment") {
    const tier = str(p.tier);
    const pct = typeof p.totalPct === "number" ? ` ${Math.round(p.totalPct)}%` : "";
    const detail = tier ? ` (${tier}${pct})` : "";
    return `[assessment] ${who}${detail}`;
  }
  return `[${source}] ${who}`;
}

function formatValue(v: unknown): string {
  if (v === undefined || v === null || v === "") return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return JSON.stringify(v, null, 2);
}

function buildBody(source: LeadSource, p: Record<string, unknown>): string {
  const lines = [`Source: ${source}`];
  for (const [key, value] of Object.entries(p)) {
    const text = formatValue(value);
    if (text) lines.push(`${key}: ${text}`);
  }
  return lines.join("\n");
}

// Best-effort notification email. Never throws.
async function sendLeadEmail(
  source: LeadSource,
  payload: Record<string, unknown>
): Promise<Status> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TYLER_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return "skipped";
  try {
    const resend = new Resend(apiKey);
    const email = str(payload.email);
    // Resend resolves with an error field instead of throwing.
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to,
      ...(email ? { reply_to: email } : {}),
      subject: buildSubject(source, payload),
      text: buildBody(source, payload),
    });
    if (error) {
      console.error("[leads] Resend returned an error:", error, "Payload:", payload);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[leads] Email send failed:", err, "Payload:", payload);
    return "failed";
  }
}

export async function forwardLead(
  source: LeadSource,
  payload: Record<string, unknown>
): Promise<{ webhook: Status; email: Status }> {
  const [webhook, email] = await Promise.all([
    postLeadWebhook(source, payload),
    sendLeadEmail(source, payload),
  ]);
  return { webhook, email };
}
