// Progressive-opt-in question flow.
// Q1–Q2 are light, identity-only (no scoring) — they get the user moving
// before any judgement-laden question. Q3–Q9 score across 5 pillars.

export type Pillar =
  | "data"
  | "process"
  | "team"
  | "leadership"
  | "vertical";

export type QuestionOption = {
  label: "A" | "B" | "C" | "D";
  text: string;
  // Maturity weight, 1 (least mature) → 4 (most mature).
  // Omitted for non-scoring identity questions.
  score?: 1 | 2 | 3 | 4;
};

export type Question = {
  id: number;
  pillar: Pillar | "identity";
  question: string;
  helper?: string;
  options: QuestionOption[];
};

export const questions: Question[] = [
  // ── Identity / warm-up ────────────────────────────────────────────────────
  {
    id: 1,
    pillar: "identity",
    question: "First — which best describes your business?",
    helper: "No wrong answers. This just tailors your results.",
    options: [
      { label: "A", text: "Construction, trades, ADU, or real estate" },
      { label: "B", text: "Professional services (law, CPA, insurance)" },
      { label: "C", text: "Healthcare practice or multi-location clinic" },
      { label: "D", text: "Other (franchise, manufacturing, ag, e-commerce)" },
    ],
  },
  {
    id: 2,
    pillar: "identity",
    question: "How big is your team today?",
    options: [
      { label: "A", text: "Just me" },
      { label: "B", text: "2–10 people" },
      { label: "C", text: "11–50 people" },
      { label: "D", text: "50+ people" },
    ],
  },

  // ── Data readiness ────────────────────────────────────────────────────────
  {
    id: 3,
    pillar: "data",
    question: "Where does your customer information actually live?",
    options: [
      { label: "A", text: "Mostly in my head, sticky notes, or scattered emails", score: 1 },
      { label: "B", text: "Spreadsheets and inboxes", score: 2 },
      { label: "C", text: "A CRM, but the team uses it inconsistently", score: 3 },
      { label: "D", text: "A central CRM the whole team keeps current", score: 4 },
    ],
  },
  {
    id: 4,
    pillar: "data",
    question: "When you need a key number (revenue, jobs in progress, leads this month), how do you get it?",
    options: [
      { label: "A", text: "I estimate it — there's no real source of truth", score: 1 },
      { label: "B", text: "Someone compiles it manually in a spreadsheet", score: 2 },
      { label: "C", text: "I check a few tools and add it up myself", score: 3 },
      { label: "D", text: "It's in a live dashboard I can pull up anytime", score: 4 },
    ],
  },

  // ── Process maturity ──────────────────────────────────────────────────────
  {
    id: 5,
    pillar: "process",
    question: "Are your most repeated workflows (intake, onboarding, reporting) documented?",
    options: [
      { label: "A", text: "Not at all — they live in people's heads", score: 1 },
      { label: "B", text: "A few are written down somewhere", score: 2 },
      { label: "C", text: "Most have SOPs, but they're outdated", score: 3 },
      { label: "D", text: "Yes — SOPs are current and the team follows them", score: 4 },
    ],
  },
  {
    id: 6,
    pillar: "process",
    question: "How many hours per week does your team spend on repetitive, manual tasks?",
    options: [
      { label: "A", text: "30+ hours — it's a real problem", score: 1 },
      { label: "B", text: "15–30 hours", score: 2 },
      { label: "C", text: "5–15 hours", score: 3 },
      { label: "D", text: "Under 5 hours — we're pretty automated", score: 4 },
    ],
  },

  // ── Team capability ───────────────────────────────────────────────────────
  {
    id: 7,
    pillar: "team",
    question: "When you've introduced new tools in the past, how did it go?",
    options: [
      { label: "A", text: "Honestly, we still use the old way", score: 1 },
      { label: "B", text: "A few people picked it up, most didn't", score: 2 },
      { label: "C", text: "Adoption took time, but we got there", score: 3 },
      { label: "D", text: "The team is curious and adopts new tools quickly", score: 4 },
    ],
  },

  // ── Leadership commitment ─────────────────────────────────────────────────
  {
    id: 8,
    pillar: "leadership",
    question: "Where is AI on your priority list for this quarter?",
    options: [
      { label: "A", text: "Not on the radar — I'm still in 'what is this' mode", score: 1 },
      { label: "B", text: "Exploring, but no time or budget set aside", score: 2 },
      { label: "C", text: "I've allocated some budget and want the right project", score: 3 },
      { label: "D", text: "Top-3 priority — I'm actively investing", score: 4 },
    ],
  },

  // ── Vertical-specific workflow readiness ──────────────────────────────────
  {
    id: 9,
    pillar: "vertical",
    question: "Do you have a specific workflow in mind that you'd want to automate first?",
    options: [
      { label: "A", text: "Not really — I'm looking for guidance on where to start", score: 1 },
      { label: "B", text: "A general sense, but no specific list", score: 2 },
      { label: "C", text: "A few specific things in mind", score: 3 },
      { label: "D", text: "Yes — a clear list of tasks ready to automate", score: 4 },
    ],
  },
];

export const SCORING_QUESTIONS = questions.filter((q) => q.pillar !== "identity");

export const INDUSTRY_LABELS: Record<string, string> = {
  A: "Construction & Trades",
  B: "Professional Services",
  C: "Healthcare",
  D: "Operations & Other",
};

export const SIZE_LABELS: Record<string, string> = {
  A: "Solo",
  B: "2–10",
  C: "11–50",
  D: "50+",
};
