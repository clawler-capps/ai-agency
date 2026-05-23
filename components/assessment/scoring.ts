import { Pillar, Question, SCORING_QUESTIONS, INDUSTRY_LABELS } from "./questions";

export type Answer = { questionId: number; label: "A" | "B" | "C" | "D" };

export type Tier = "AI-Curious" | "AI-Ready" | "AI-Leading";

export type PillarScore = {
  pillar: Pillar;
  raw: number;        // sum of question scores in this pillar
  max: number;        // max possible for this pillar
  pct: number;        // 0–100
};

export type AssessmentResult = {
  tier: Tier;
  totalPct: number;           // 0–100
  pillars: PillarScore[];
  // Industry/size pulled from identity questions (Q1/Q2)
  industry: string;           // e.g., "Construction & Trades"
  industryLabel: "A" | "B" | "C" | "D";
  sizeLabel: "A" | "B" | "C" | "D";
  // Heuristic peer-relative framing — deterministic from score+industry
  peerPercentile: number;     // 1–99: "Top X%"
  peerFrame: string;          // pre-rendered string e.g. "Top 32% of Sacramento-area..."
  // Per-pillar narrative
  pillarSummaries: { pillar: Pillar; title: string; summary: string }[];
};

const PILLAR_TITLES: Record<Pillar, string> = {
  data: "Data Readiness",
  process: "Process Maturity",
  team: "Team Capability",
  leadership: "Leadership Commitment",
  vertical: "Workflow Clarity",
};

const PILLAR_NARRATIVES: Record<Pillar, [string, string, string, string]> = {
  // 4 bands: low / mid-low / mid-high / high
  data: [
    "Your data lives in heads, inboxes, and spreadsheets. Step one is consolidating it so AI has something to work with.",
    "You have data, but it's scattered. Centralizing your customer + ops data unlocks most of the AI wins.",
    "Solid data foundation. A few connections and clean-ups would make automation low-friction.",
    "Excellent — your data is in good shape. AI can plug in and produce ROI fast.",
  ],
  process: [
    "Workflows live in people's heads. The first win is documenting + automating one repetitive task end-to-end.",
    "Some workflows are written down. Picking the top 1–2 and automating them yields immediate hours back.",
    "Your processes are mostly mature. AI can layer on top of what's already working.",
    "Highly automated already. Opportunities now lean toward smarter routing and decision support.",
  ],
  team: [
    "Past tool rollouts have stalled. Adoption coaching matters as much as the tech itself.",
    "Mixed adoption history. The plan needs a champion and short, win-fast pilots.",
    "Your team can adopt new tools. Pick a project with a visible weekly impact.",
    "Adoption is a non-issue here. You can move directly to ambitious automation projects.",
  ],
  leadership: [
    "AI isn't yet a priority. The next step is a low-risk pilot to build internal evidence.",
    "Exploring without budget. A small, time-boxed pilot is the right move.",
    "Budget and intent are in place. Now it's about picking the right first project.",
    "Strong executive commitment. You're set up to compound multiple AI initiatives.",
  ],
  vertical: [
    "No specific use case yet. A 30-minute discovery would identify your top 3 candidates.",
    "Some directional ideas. Sharpening them into a prioritized list is the next step.",
    "Clear candidate workflows. Ready to scope a first build.",
    "You know exactly what you want to automate. Time to build.",
  ],
};

export function scoreAssessment(answers: Answer[]): AssessmentResult {
  // Build pillar tallies from scoring questions only.
  const pillarTally: Record<Pillar, { raw: number; max: number; bands: number[] }> = {
    data: { raw: 0, max: 0, bands: [] },
    process: { raw: 0, max: 0, bands: [] },
    team: { raw: 0, max: 0, bands: [] },
    leadership: { raw: 0, max: 0, bands: [] },
    vertical: { raw: 0, max: 0, bands: [] },
  };

  for (const q of SCORING_QUESTIONS) {
    const ans = answers.find((a) => a.questionId === q.id);
    const opt = ans ? q.options.find((o) => o.label === ans.label) : undefined;
    const score = opt?.score ?? 1;
    const pillar = q.pillar as Pillar;
    pillarTally[pillar].raw += score;
    pillarTally[pillar].max += 4;
    pillarTally[pillar].bands.push(score);
  }

  const pillars: PillarScore[] = (Object.keys(pillarTally) as Pillar[]).map((p) => {
    const { raw, max } = pillarTally[p];
    return {
      pillar: p,
      raw,
      max,
      pct: max === 0 ? 0 : Math.round((raw / max) * 100),
    };
  });

  const totalRaw = pillars.reduce((sum, p) => sum + p.raw, 0);
  const totalMax = pillars.reduce((sum, p) => sum + p.max, 0);
  const totalPct = totalMax === 0 ? 0 : Math.round((totalRaw / totalMax) * 100);

  const tier: Tier =
    totalPct >= 70 ? "AI-Leading" : totalPct >= 40 ? "AI-Ready" : "AI-Curious";

  // Identity answers (Q1 = industry, Q2 = size)
  const industryAnswer = (answers.find((a) => a.questionId === 1)?.label ?? "D") as
    | "A" | "B" | "C" | "D";
  const sizeAnswer = (answers.find((a) => a.questionId === 2)?.label ?? "B") as
    | "A" | "B" | "C" | "D";
  const industry = INDUSTRY_LABELS[industryAnswer] ?? "Sacramento Businesses";

  // Heuristic peer-relative percentile.
  // Higher score → smaller "Top X%". Anchored to keep results plausible:
  // - AI-Leading: Top 5–18%
  // - AI-Ready:   Top 19–42%
  // - AI-Curious: Top 43–78%
  const peerPercentile = computePeerPercentile(totalPct, industryAnswer);
  const peerFrame = `Top ${peerPercentile}% of Sacramento-area ${industry.toLowerCase()} businesses`;

  // Build per-pillar narrative summaries.
  const pillarSummaries = pillars.map((p) => {
    const band = Math.max(0, Math.min(3, Math.floor(p.pct / 25.001)));
    return {
      pillar: p.pillar,
      title: PILLAR_TITLES[p.pillar],
      summary: PILLAR_NARRATIVES[p.pillar][band],
    };
  });

  return {
    tier,
    totalPct,
    pillars,
    industry,
    industryLabel: industryAnswer,
    sizeLabel: sizeAnswer,
    peerPercentile,
    peerFrame,
    pillarSummaries,
  };
}

function computePeerPercentile(totalPct: number, industry: "A" | "B" | "C" | "D"): number {
  // Map score% (0–100) → percentile (78 at low end, 5 at high end), then nudge
  // by industry so "AI-Ready in construction" feels more impressive than
  // "AI-Ready in professional services". Result is deterministic.
  const base = Math.round(78 - (totalPct / 100) * 73);
  // Construction/trades + ag/manufacturing tend to be less digitized on
  // average, so the same score signals a stronger relative position.
  const industryAdjust: Record<string, number> = { A: -4, B: 2, C: -1, D: -2 };
  const adjusted = base + (industryAdjust[industry] ?? 0);
  return Math.max(3, Math.min(85, adjusted));
}

export const TIER_META: Record<Tier, {
  badge: string;
  tagline: string;
  blurb: string;
  cta: "schedule" | "nurture";
}> = {
  "AI-Leading": {
    badge: "AI-Leading",
    tagline: "You're ahead of the pack",
    blurb: "Your data, process, and leadership are aligned. The next win is compounding — layering multiple AI initiatives into a moat your competitors can't catch.",
    cta: "schedule",
  },
  "AI-Ready": {
    badge: "AI-Ready",
    tagline: "You're set up to move fast",
    blurb: "You have the foundation in place. A focused first project would translate directly to hours saved and revenue captured — likely within 30 days.",
    cta: "schedule",
  },
  "AI-Curious": {
    badge: "AI-Curious",
    tagline: "You're early — and that's a fine place to be",
    blurb: "You see the potential, but the foundation isn't there yet. A short roadmap will show which step to take first so the rest builds on solid ground.",
    cta: "nurture",
  },
};

export const PILLAR_LABELS = PILLAR_TITLES;
