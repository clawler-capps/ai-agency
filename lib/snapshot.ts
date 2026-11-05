// Deterministic AI Opportunity Snapshot math, shared by the results page and
// the report email so the dollar figures always match.

export const WEEKS_PER_YEAR = 50;
export const CAPTURE_LOW = 0.3;
export const CAPTURE_HIGH = 0.6;
export const DEFAULT_HOURLY_VALUE = 75;
// Full-time hours in a year, for turning an annual salary into an hourly cost.
export const HOURS_PER_YEAR = 2080;
export const MIN_SALARY = 10_000;
export const MAX_SALARY = 2_000_000;

export type CostBasis = "hourly" | "salary";

// Whole dollars per hour, clamped to the same range as a typed-in hourly cost.
export const clampRate = (n: number) => Math.round(Math.min(Math.max(n, 10), 1000));
export const salaryToHourly = (salary: number) => clampRate(salary / HOURS_PER_YEAR);

// "$85,000 ÷ 2,080 hrs = $41/hr"
export const salaryMath = (salary: number) =>
  `${usd(salary)} ÷ ${HOURS_PER_YEAR.toLocaleString("en-US")} hrs = ${usd(salaryToHourly(salary))}/hr`;

export const ROLES = [
  "Owner or founder",
  "Executive or senior leader",
  "Manager or team lead",
  "Team member",
  "Other",
] as const;

export const REVENUE_BANDS = [
  "Under $500K",
  "$500K–$1M",
  "$1–5M",
  "$5–10M",
  "$10–50M",
  "$50M+",
] as const;

// Shown when the AI follow-up options can't be fetched in time.
export const FOLLOWUP_FALLBACK = [
  "Gathering information from different places",
  "Writing or typing it up by hand",
  "Waiting on other people to reply or approve",
  "Fixing mistakes and double-checking",
];

export const FOLLOWUP_QUESTION = "Where does that work slow down?";

// One short line under the gate and in the email footer.
export const PRIVACY_LINE =
  "Your answers (and your website, if you shared it) are processed by AI to write your snapshot. We never sell your information.";

export type ValueEstimate = {
  hoursPerWeek: number;
  hourlyValue: number;
  annualCost: number; // hours × rate × 50 weeks
  low: number; // conservative capture, 30%
  high: number; // 60%
  math: string; // the calculation, in plain words
};

export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

// Round to the nearest $100 so estimates don't look falsely precise.
const round100 = (n: number) => Math.round(n / 100) * 100;

// AI is assumed to capture 30–60% of the time spent today. That band is fixed
// and only shown as part of the low–high math.
export function estimateValue(hoursPerWeek: number, hourlyValue: number): ValueEstimate {
  const captureLow = CAPTURE_LOW;
  const captureHigh = CAPTURE_HIGH;
  const annualCost = hoursPerWeek * hourlyValue * WEEKS_PER_YEAR;
  const low = round100(annualCost * captureLow);
  const high = round100(annualCost * captureHigh);
  const pct = (f: number) => Math.round(f * 100);
  const math =
    `${hoursPerWeek} hrs/week × ${usd(hourlyValue)}/hr × ${WEEKS_PER_YEAR} weeks = ` +
    `${usd(annualCost)} a year. Capturing ${pct(captureLow)}–${pct(captureHigh)}% of that = ` +
    `${usd(low)}–${usd(high)} a year.`;
  return { hoursPerWeek, hourlyValue, annualCost, low, high, math };
}

// Keyword match on the visitor's own words → a named opportunity.
const OPPORTUNITIES: { title: string; how: string; match: RegExp }[] = [
  {
    title: "Faster lead follow-up and quotes",
    how: "AI drafts the first reply, quote, or estimate from your notes in minutes, so leads hear back the same day.",
    match: /lead|follow.?up|prospect|sales|quote|estimat|bid|crm/i,
  },
  {
    title: "Automated weekly reporting",
    how: "AI pulls the numbers together and writes the summary, so the report takes minutes instead of hours.",
    match: /report|spreadsheet|excel|dashboard|numbers|kpi|metric|bookkeep|account/i,
  },
  {
    title: "Email triage and drafted replies",
    how: "AI sorts the inbox and drafts replies in your voice; you just review and send.",
    match: /e-?mail|inbox|repl(y|ies)|respond/i,
  },
  {
    title: "Scheduling and dispatch",
    how: "AI handles the back-and-forth of booking and keeps the calendar straight.",
    match: /schedul|calendar|appointment|booking|dispatch|rout/i,
  },
  {
    title: "Meeting notes and action items",
    how: "AI writes the notes and the owner-by-owner to-do list before the meeting ends.",
    match: /meeting|notes|minutes|calls?\b/i,
  },
  {
    title: "Document and paperwork drafting",
    how: "AI produces first drafts of proposals, contracts, and forms from a short brief.",
    match: /proposal|contract|document|paperwork|form|invoice|billing|permit/i,
  },
  {
    title: "Cutting manual data entry",
    how: "AI moves information between systems so nobody retypes it.",
    match: /data entry|copy|paste|enter|typing|manual|input/i,
  },
  {
    title: "Marketing content on autopilot",
    how: "AI turns one idea into a week of posts, emails, and blog drafts.",
    match: /social|marketing|content|post|newsletter|blog|ads?\b/i,
  },
  {
    title: "Answering repeat customer questions",
    how: "AI answers the questions you get every day, and hands the tricky ones to you.",
    match: /customer|support|question|faq|phone|service/i,
  },
];

const DEFAULT_OPPORTUNITY = {
  title: "Automating your biggest time drain",
  how: "AI takes the repeatable part of this work so you only handle the judgment calls.",
};

export function matchOpportunity(bottleneck: string): { title: string; how: string } {
  return OPPORTUNITIES.find((o) => o.match.test(bottleneck)) ?? DEFAULT_OPPORTUNITY;
}

// Fallback picks for opportunities #2 and #3 when the AI report isn't available.
export function backupOpportunities(topTitle: string): { title: string; how: string; hours: number }[] {
  return [
    { ...OPPORTUNITIES[4], hours: 2 },
    { ...OPPORTUNITIES[2], hours: 3 },
    { ...OPPORTUNITIES[1], hours: 2 },
  ]
    .filter((o) => o.title !== topTitle)
    .slice(0, 2);
}

export function tonightPrompt(bottleneck: string, hoursPerWeek: number, industry?: string): string {
  const who = industry ? `I run a ${industry.toLowerCase()} business. ` : "";
  return (
    `${who}I lose about ${hoursPerWeek} hours a week on this: "${bottleneck}". ` +
    "Ask me 5 quick questions about how I do it today. Then give me a step-by-step plan to cut " +
    "that time in half using AI tools I already have, starting with the single easiest thing I can try tonight."
  );
}

export const claudeUrl = (prompt: string) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
export const chatgptUrl = (prompt: string) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;

// ── Report shape (shared by the page, the API, and the email) ───────────────
// The AI supplies words and hours only. Dollars are always computed with
// estimateValue() from the visitor's own rate.

export type ReportOpportunity = { title: string; why: string; hours: number };

export type Report = {
  headline: string;
  opportunities: ReportOpportunity[]; // #1 is always the visitor's own time drain
  today: string[];
  withAi: string[];
  prompt: string;
};

// "Your biggest AI opportunity: updating the numbers…" → "Your biggest AI
// opportunity". The #1 card right below already names the opportunity.
export function shortHeadline(h: string): string {
  const m = /^(your\b[^:]*\bai opportunit[^:]*?):\s*\S/i.exec(h.trim());
  return m ? m[1].trim() : h.trim();
}

// For quoting the visitor's own words in a label.
export const truncate = (s: string, max: number) => {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length <= max ? t : `${t.slice(0, max - 1).replace(/[\s,.;:]+\S*$/, "")}…`;
};

export function totalValue(opps: { hours: number }[], hourlyValue: number): { low: number; high: number } {
  return opps.reduce(
    (t, o) => {
      const v = estimateValue(o.hours, hourlyValue);
      return { low: t.low + v.low, high: t.high + v.high };
    },
    { low: 0, high: 0 }
  );
}
