// Server-side only. Signs the generated snapshot so the unlock endpoint can
// email that exact report without a second AI call.
//
// The token is signed, not encrypted: the visitor can read what's inside
// (their own answers and their own report), but can't change it.
import { createHmac, timingSafeEqual } from "crypto";

const MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const MAX_TOKEN_LENGTH = 40_000;

const b64 = (b: Buffer) => b.toString("base64url");

function secret(): string | null {
  const s = process.env.REPORT_SIGNING_SECRET?.trim();
  return s && s.length >= 32 ? s : null;
}

export const signingConfigured = () => secret() !== null;

function mac(body: string, key: string): Buffer {
  return createHmac("sha256", key).update(body).digest();
}

export function signToken(payload: object): string {
  const key = secret();
  if (!key) throw new Error("REPORT_SIGNING_SECRET not set");
  const body = b64(Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })));
  return `${body}.${b64(mac(body, key))}`;
}

// Returns the payload, or null if the token is missing, tampered, or expired.
export function verifyToken<T>(token: unknown): T | null {
  const key = secret();
  if (!key || typeof token !== "string" || token.length > MAX_TOKEN_LENGTH) return null;
  const [body, sig, extra] = token.split(".");
  if (!body || !sig || extra !== undefined) return null;
  const expected = mac(body, key);
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof data?.iat !== "number" || Date.now() - data.iat > MAX_AGE_MS) return null;
    return data as T;
  } catch {
    return null;
  }
}
