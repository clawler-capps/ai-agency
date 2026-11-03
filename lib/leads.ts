// Server-side only. Import from API routes, never from client components.
//
// Logging rule: never log names, emails, or answers. Log status only, so
// Vercel logs hold no personal data.
import { Resend } from "resend";

export type LeadSource = "website-assessment" | "contact" | "questionnaire";
export type Status = "sent" | "skipped" | "failed";

const WEBHOOK_TIMEOUT_MS = 5000;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Tyler at Sacramento AI Agency <reports@sacramentoaiagency.com>";
export const REPLY_TO = process.env.RESEND_REPLY_TO ?? "tyler@sacramentoaiagency.com";

// Only production posts to the CRM. Preview deploys leave FUNNEL_ENABLED unset
// so test submissions never create GoHighLevel contacts.
export const funnelEnabled = () => process.env.FUNNEL_ENABLED === "true";

async function postJson(source: LeadSource, url: string, body: unknown): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    console.log(`[leads] Webhook (${source}) responded ${res.status}`);
    return res.ok;
  } catch (err) {
    console.error(`[leads] Webhook (${source}) post failed:`, err instanceof Error ? err.name : "error");
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// Posts to LEAD_WEBHOOK_URL (GoHighLevel Inbound Webhook). Never throws.
// "skipped" means the funnel is off or no URL is set.
export async function postLeadWebhook(
  source: LeadSource,
  payload: Record<string, unknown>
): Promise<Status> {
  if (!funnelEnabled()) {
    console.log(`[leads] Webhook (${source}) skipped: FUNNEL_ENABLED is not true`);
    return "skipped";
  }
  const urls: string[] = [];
  if (process.env.LEAD_WEBHOOK_URL) urls.push(process.env.LEAD_WEBHOOK_URL);
  // Legacy variable, questionnaire only.
  if (source === "questionnaire" && process.env.QUESTIONNAIRE_WEBHOOK_URL) {
    urls.push(process.env.QUESTIONNAIRE_WEBHOOK_URL);
  }
  if (urls.length === 0) {
    console.warn(`[leads] Webhook (${source}) skipped: no webhook URL set`);
    return "skipped";
  }
  const body = { source, submittedAt: new Date().toISOString(), ...payload };
  const results = await Promise.all(urls.map((u) => postJson(source, u, body)));
  return results.every(Boolean) ? "sent" : "failed";
}

// Sends one email through Resend. Never throws. Returns the Resend id on success.
export async function sendEmail(
  label: string,
  message: { to: string; subject: string; text: string; html?: string; replyTo?: string }
): Promise<{ status: Status; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !message.to) {
    console.warn(`[leads] Email (${label}) skipped: Resend not configured`);
    return { status: "skipped" };
  }
  try {
    // Resend resolves with an error field instead of throwing.
    const { data, error } = await new Resend(apiKey).emails.send({
      from: FROM_EMAIL,
      to: message.to,
      reply_to: message.replyTo ?? REPLY_TO,
      subject: message.subject,
      text: message.text,
      ...(message.html ? { html: message.html } : {}),
    });
    if (error) {
      console.error(`[leads] Email (${label}) failed: ${error.name}`);
      return { status: "failed" };
    }
    console.log(`[leads] Email (${label}) sent: ${data?.id}`);
    return { status: "sent", id: data?.id };
  } catch (err) {
    console.error(`[leads] Email (${label}) failed:`, err instanceof Error ? err.name : "error");
    return { status: "failed" };
  }
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function formatValue(v: unknown): string {
  if (v === undefined || v === null || v === "") return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return JSON.stringify(v, null, 2);
}

// Plain-text dump of a lead for Tyler's notification email.
export function formatLead(source: LeadSource, p: Record<string, unknown>): string {
  const lines = [`Source: ${source}`];
  for (const [key, value] of Object.entries(p)) {
    const text = formatValue(value);
    if (text) lines.push(`${key}: ${text}`);
  }
  return lines.join("\n");
}

// Webhook post plus a notification email to Tyler, both best effort.
export async function forwardLead(
  source: LeadSource,
  payload: Record<string, unknown>
): Promise<{ webhook: Status; email: Status }> {
  const who =
    [str(payload.name), str(payload.company) || str(payload.business)].filter(Boolean).join(", ") ||
    "new lead";
  const [webhook, email] = await Promise.all([
    postLeadWebhook(source, payload),
    sendEmail(`${source}-notify`, {
      to: process.env.TYLER_NOTIFICATION_EMAIL ?? "",
      replyTo: str(payload.email) || undefined,
      subject: `[${source}] ${who}`,
      text: formatLead(source, payload),
    }),
  ]);
  return { webhook, email: email.status };
}
