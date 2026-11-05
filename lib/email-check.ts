// Server-side only. Instant checks on the unlock email: syntax, common typos,
// throwaway domains, and a mail server for the domain. They catch mistakes
// and junk early, with a helpful message. They can't prove the inbox exists.
import { promises as dns } from "dns";

const MX_TIMEOUT_MS = 3000;

// Stricter than "something@something.something": no spaces, no double dots,
// a real-looking domain with a 2+ letter TLD.
const SYNTAX =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;

// Common mail providers, used to spot typos like gmial.com.
const POPULAR = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "live.com",
  "msn.com",
  "comcast.net",
  "sbcglobal.net",
  "att.net",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "verizon.net",
  "ymail.com",
  "googlemail.com",
];

// Real providers that sit one letter away from a popular one.
const REAL_LOOKALIKES = new Set(["mail.com", "email.com", "gmx.com", "gmx.net", "ymail.com", "rocketmail.com"]);

// Typos too far from the real domain for the distance check, or with a wrong TLD.
const KNOWN_TYPOS: Record<string, string> = {
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cmo": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.net": "gmail.com",
  "gmail.org": "gmail.com",
  "gmai.co": "gmail.com",
  "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "hotmail.co": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlook.co": "outlook.com",
  "outlook.con": "outlook.com",
  "icloud.co": "icloud.com",
  "icloud.con": "icloud.com",
};

// Throwaway inbox providers. Not exhaustive.
const DISPOSABLE = new Set([
  "10minutemail.com", "10minutemail.net", "20minutemail.com", "33mail.com", "anonbox.net",
  "burnermail.io", "byom.de", "dispostable.com", "discard.email", "dropmail.me", "emailfake.com",
  "emailondeck.com", "emailtemp.org", "fakeinbox.com", "fakemail.net", "getairmail.com",
  "getnada.com", "guerrillamail.biz", "guerrillamail.com", "guerrillamail.de", "guerrillamail.info",
  "guerrillamail.net", "guerrillamail.org", "guerrillamailblock.com", "harakirimail.com",
  "inboxbear.com", "inboxkitten.com", "incognitomail.org", "jetable.org", "mail.tm", "mail-temp.com",
  "mailcatch.com", "maildrop.cc", "mailinator.com", "mailinator.net", "mailinator2.com",
  "mailnesia.com", "mailpoof.com", "mailsac.com", "mintemail.com", "moakt.com", "mohmal.com",
  "mytemp.email", "nada.email", "nowmymail.com", "sharklasers.com", "spam4.me", "spambox.us",
  "spamgourmet.com", "temp-mail.io", "temp-mail.org", "tempail.com", "tempinbox.com",
  "tempmail.com", "tempmail.dev", "tempmail.net", "tempmail.plus", "tempmailo.com", "tempr.email",
  "throwawaymail.com", "trashmail.com", "trashmail.de", "trashmail.net", "tmail.ws", "tmpmail.net",
  "tmpmail.org", "yopmail.com", "yopmail.fr", "yopmail.net", "grr.la", "pokemail.net",
  "spamex.com", "mailnull.com", "fakemailgenerator.com", "emailnator.com", "luxusmail.org",
  "minuteinbox.com", "tempmailaddress.com", "trbvm.com", "linshiyouxiang.net", "1secmail.com",
  "1secmail.net", "1secmail.org", "mailto.plus", "fexpost.com", "fexbox.org", "rover.info",
  "kzccv.com", "vjuum.com", "laafd.com", "txcct.com", "dcctb.com", "cyclelove.cc",
]);

// Optimal string alignment distance (counts a swap of two letters as one edit).
function distance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

export function suggestDomain(domain: string): string | null {
  const d = domain.toLowerCase();
  if (POPULAR.includes(d) || REAL_LOOKALIKES.has(d)) return null;
  if (KNOWN_TYPOS[d]) return KNOWN_TYPOS[d];
  // Only fuzzy-match against longer domains, so short business domains
  // (aon.com vs aol.com) aren't flagged.
  const close = POPULAR.find((p) => {
    const dist = distance(d, p);
    return (p.length >= 9 && dist === 1) || (p.length >= 11 && dist === 2);
  });
  return close ?? null;
}

export type EmailCheck =
  | { ok: true; email: string }
  | { ok: false; reason: "syntax" | "typo" | "disposable" | "no-mx"; error: string; suggestion?: string };

async function hasMx(domain: string): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const lookup = dns.resolveMx(domain).then((r) => r.some((m) => m.exchange && m.exchange !== "."));
    const timeout = new Promise<boolean>((resolve) => {
      timer = setTimeout(() => resolve(true), MX_TIMEOUT_MS);
    });
    // A slow DNS answer counts as a pass, so a slow resolver never blocks anyone.
    return await Promise.race([lookup, timeout]);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    // Only a definite "no such domain / no MX" fails. Resolver hiccups pass.
    return !(code === "ENOTFOUND" || code === "ENODATA" || code === "ENONAME" || code === "NXDOMAIN");
  } finally {
    clearTimeout(timer);
  }
}

// keepTypo: the visitor saw the "Did you mean" suggestion and kept their own.
export async function checkEmail(raw: string, keepTypo = false): Promise<EmailCheck> {
  const email = raw.trim().toLowerCase();
  if (!SYNTAX.test(email) || email.includes("..")) {
    return { ok: false, reason: "syntax", error: "Please check your email address. It doesn't look complete." };
  }
  const [local, domain] = email.split("@");
  const suggested = suggestDomain(domain);
  if (suggested && !keepTypo) {
    const suggestion = `${local}@${suggested}`;
    return { ok: false, reason: "typo", error: `Did you mean ${suggestion}?`, suggestion };
  }
  if (DISPOSABLE.has(domain) || Array.from(DISPOSABLE).some((d) => domain.endsWith(`.${d}`))) {
    return {
      ok: false,
      reason: "disposable",
      error: "Please use a permanent email address. Temporary inboxes can't receive your snapshot.",
    };
  }
  if (!(await hasMx(domain))) {
    return {
      ok: false,
      reason: "no-mx",
      error: `We can't find a mail server for ${domain}. Please check the address.`,
    };
  }
  return { ok: true, email };
}
