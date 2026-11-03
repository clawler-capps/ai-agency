// Server-side only. Shared anti-abuse helpers for form API routes.
import type { NextRequest } from "next/server";

// ── Simple in-memory rate limit ──────────────────────────────────────────────
// Keeps a single visitor (by IP) from flooding inboxes and the CRM. This lives
// in module memory, so it resets on redeploy and isn't shared across serverless
// instances — it's a courtesy guardrail, not a hardened defense. Honeypots and
// input caps do the heavier anti-abuse lifting.
export function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return function isRateLimited(key: string): boolean {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    hits.set(key, recent);
    return false;
  };
}

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Prevent header injection and inbox-bloat by capping field lengths.
export const clamp = (s: unknown, max: number) =>
  typeof s === "string" ? s.trim().slice(0, max) : "";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
