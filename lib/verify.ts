// Server-side only. Email verification codes for the Snapshot unlock, with no
// database: the code's details travel in an HMAC-signed token (lib/token.ts).
//
// - The 6-digit code itself is never in the token, only a keyed hash of it,
//   so the token can't be used to work out the code.
// - Codes expire after 15 minutes.
// - Each code allows 5 tries. Every wrong try returns a new token with the
//   count raised, and the count is also kept in memory per code, so replaying
//   an older token doesn't reset it on the same server instance.
// - Up to 3 resends per address (the count travels in the token, backed by a
//   per-email rate limit in memory).
// The in-memory parts reset on redeploy and aren't shared across instances,
// like lib/guard.ts. The per-IP rate limits are the backstop.
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { signToken, verifyToken } from "@/lib/token";

export const CODE_TTL_MS = 15 * 60 * 1000;
export const MAX_ATTEMPTS = 5;
export const MAX_RESENDS = 3;

export type CodeContact = {
  firstName: string;
  email: string;
  company: string;
  companySize: string;
  consent: boolean;
};

export type CodeToken = {
  kind: "email-code";
  v: 1;
  nonce: string;
  codeHash: string;
  exp: number;
  attempts: number;
  sends: number; // 1 = first send, 2–4 = resends
  snap: string; // hash of the snapshot token this code unlocks
  contact: CodeContact;
};

function key(): string {
  return process.env.REPORT_SIGNING_SECRET?.trim() ?? "";
}

const hmac = (data: string) => createHmac("sha256", key()).update(data).digest("base64url");

// Binds a code to the exact snapshot it unlocks.
export const snapshotHash = (snapshotToken: string) => hmac(`snap:${snapshotToken}`);

const codeHash = (nonce: string, email: string, code: string) => hmac(`code:${nonce}:${email}:${code}`);

export function newCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function issueCodeToken(
  code: string,
  contact: CodeContact,
  snapshotToken: string,
  sends: number
): { token: string; exp: number } {
  const nonce = randomBytes(12).toString("base64url");
  const exp = Date.now() + CODE_TTL_MS;
  const payload: CodeToken = {
    kind: "email-code",
    v: 1,
    nonce,
    codeHash: codeHash(nonce, contact.email, code),
    exp,
    attempts: 0,
    sends,
    snap: snapshotHash(snapshotToken),
    contact,
  };
  return { token: signToken(payload), exp };
}

// Reads a code token without checking the code (for resends).
export function readCodeToken(token: unknown): CodeToken | null {
  const t = verifyToken<CodeToken>(token);
  return t && t.kind === "email-code" && t.v === 1 ? t : null;
}

// Wrong-try counts per code, per instance. Pruned as entries expire.
const attemptsSeen = new Map<string, { n: number; exp: number }>();
// Codes already used to unlock, so a second submit doesn't post a second lead.
const used = new Map<string, number>();

function prune() {
  const now = Date.now();
  attemptsSeen.forEach((v, k) => v.exp < now && attemptsSeen.delete(k));
  used.forEach((exp, k) => exp < now && used.delete(k));
}

export type CheckResult =
  | { ok: true; contact: CodeContact; nonce: string }
  | { ok: false; status: number; error: string; codeToken?: string; attemptsLeft?: number; expired?: boolean };

export function checkCode(rawToken: unknown, rawCode: unknown, snapshotToken: string): CheckResult {
  prune();
  const t = readCodeToken(rawToken);
  if (!t || t.snap !== snapshotHash(snapshotToken)) {
    return { ok: false, status: 400, error: "That code link isn't valid. Please send a new code.", expired: true };
  }
  if (Date.now() > t.exp) {
    return { ok: false, status: 400, error: "That code has expired. Please send a new one.", expired: true };
  }
  if (used.has(t.nonce)) {
    return { ok: false, status: 409, error: "This code was already used. Your snapshot is unlocked." };
  }
  const attempts = Math.max(t.attempts, attemptsSeen.get(t.nonce)?.n ?? 0);
  if (attempts >= MAX_ATTEMPTS) {
    return { ok: false, status: 429, error: "Too many tries. Please send a new code.", expired: true };
  }

  const code = typeof rawCode === "string" ? rawCode.replace(/\D/g, "") : "";
  const given = Buffer.from(codeHash(t.nonce, t.contact.email, code));
  const expected = Buffer.from(t.codeHash);
  const match = code.length === 6 && given.length === expected.length && timingSafeEqual(given, expected);

  if (!match) {
    const n = attempts + 1;
    attemptsSeen.set(t.nonce, { n, exp: t.exp });
    const left = MAX_ATTEMPTS - n;
    // Re-sign with the higher count (keeps the original expiry and code).
    const next: CodeToken = { ...t, attempts: n };
    return {
      ok: false,
      status: 400,
      error: left > 0
        ? `That code isn't right. ${left} ${left === 1 ? "try" : "tries"} left.`
        : "That code isn't right, and that was the last try. Please send a new code.",
      codeToken: left > 0 ? signToken(next) : undefined,
      attemptsLeft: left,
      expired: left <= 0,
    };
  }

  used.set(t.nonce, t.exp);
  return { ok: true, contact: t.contact, nonce: t.nonce };
}

// Undo "used" if saving the lead failed, so the visitor can retry the same code.
export function releaseCode(nonce: string) {
  used.delete(nonce);
}
