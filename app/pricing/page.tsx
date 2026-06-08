import type { Metadata } from "next";
import Link from "next/link";
import PricingCard from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Pricing — Sacramento AI Agency",
  description:
    "Start with a $1,000 AI Business Assessment. ROI-first AI consulting and team training for Sacramento businesses and growth-stage teams.",
};

// ── Tier data ──────────────────────────────────────────────────────────────────
const CALENDLY_URL = "https://calendly.com/tylercapps/intro";

// Tier 2 — Solution Buildout. We build the priority plays from the assessment,
// on Claude. Deliberately no specific third-party tool names — this is what's
// actually being delivered today.
const tier2Buildout = [
  {
    name: "Highest-Leverage Play, Built",
    desc: "We take the top-ranked solution from your plan and build it end to end on Claude — the one with the biggest hours-saved and dollar return.",
  },
  {
    name: "Wins Proven by Hand → Repeatable Systems",
    desc: "If you've already done it manually once, we turn it into a reliable system your team can run every time without re-inventing it.",
  },
  {
    name: "Opportunity-to-Output in Minutes",
    desc: "Reporting, briefings, proposals, market pulses — the recurring deliverables that ate hours now take minutes.",
  },
  {
    name: "Scoped to Your ROI",
    desc: "We only build what the assessment showed will pay for itself. Each play is scoped on a call against the value you already saw.",
  },
];

// Tier 3 — Claude Proficiency Program. The 1:1 team training Tyler is actively
// rolling out. Four stages, ~60-min weekly sessions.
const proficiencyStages = [
  {
    number: "01",
    title: "Assess — Baseline & Goals",
    desc: "Map each person's starting point, identify their top 3 high-ROI areas, and deliver a personalized learning roadmap.",
    color: "border-green-border bg-green-light",
    labelColor: "text-green-DEFAULT",
  },
  {
    number: "02",
    title: "Train: Foundations — Everyday Claude",
    desc: "Prompting that works, managing conversations, working with files, and web search — the daily fundamentals.",
    color: "border-blue-border bg-blue-light",
    labelColor: "text-blue-DEFAULT",
  },
  {
    number: "03",
    title: "Train: Working Smarter — Projects & Personalization",
    desc: "Claude Projects, custom instructions, and organizing context so Claude fits how they actually work.",
    color: "border-accent/30 bg-accent/light",
    labelColor: "text-accent",
  },
  {
    number: "04",
    title: "Level Up — Skills & Adjacent Tools",
    desc: "Reusable Skills for their real work, plus adjacent tools only where they genuinely extend Claude.",
    color: "border-purple-border bg-purple-light",
    labelColor: "text-purple-DEFAULT",
  },
];

const proficiencyOutcomes = [
  "A custom Claude Project built around their work",
  "One custom Skill they keep and reuse",
  "A personal prompt & playbook library",
  "An adjacent-tools cheat sheet",
];

const tier4Includes = [
  "Ongoing AI strategy and quarterly roadmap",
  "Continuous buildout of new leverage, on Claude",
  "Team training and enablement",
  "Executive briefings and decision support",
  "Priority support and advisory access",
  "A partner who stays accountable to your results — not a consultant who delivers and disappears",
];

// ── Report sections ────────────────────────────────────────────────────────────
const reportSections = [
  {
    number: "01",
    title: "Executive Summary + Effort/Impact Matrix",
    description:
      "Every pain point plotted on a 2×2 grid. Quick Wins quadrant (low effort, high impact) leads. You see immediately where to start.",
    color: "border-green-border bg-green-light",
    labelColor: "text-green-DEFAULT",
  },
  {
    number: "02",
    title: "Quick Wins",
    description:
      "Tools that solve a pain point by simply installing them. Each entry includes: tool name, why it fits your business, complexity, monthly cost, setup time, and time saved per week.",
    color: "border-blue-border bg-blue-light",
    labelColor: "text-blue-DEFAULT",
  },
  {
    number: "03",
    title: "Recommended Solutions & 4-Day Quick Start",
    description:
      "Specific tools and automations matched to each pain point, plus a day-by-day implementation plan so you know exactly what to do first.",
    color: "border-accent/30 bg-accent/light",
    labelColor: "text-accent",
  },
  {
    number: "04",
    title: "Financial Impact Summary",
    description:
      "Hours saved/week × $100/hr × 4 weeks − tool costs = net monthly value. Example: 8 hrs/wk × $100 × 4 = $3,200 − $59/mo = $3,141/mo net. This appears at the top AND bottom of the report.",
    color: "border-purple-border bg-purple-light",
    labelColor: "text-purple-DEFAULT",
  },
];


export default function PricingPage() {
  return (
    <div className="pt-20 bg-paper">
      {/* Header */}
      <section className="section-padding bg-paper border-b border-border">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-4">Transparent Pricing</p>
          <h1 className="text-5xl sm:text-6xl font-black text-ink tracking-tight mb-6">
            Four Tiers.<br />
            <span className="text-accent">One Clear Path.</span>
          </h1>
          <p className="text-lg text-muted max-w-xl leading-relaxed">
            Every engagement starts with the Assessment. We don&apos;t recommend
            follow-on work until we know it will pay for itself.
          </p>
        </div>
      </section>

      {/* Tier 1 — Assessment */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-3xl mx-auto">
          <PricingCard showCheckoutButton={true} />
        </div>
      </section>

      {/* Report structure */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="eyebrow mb-3">What You Receive</p>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              Inside the Assessment Report
            </h2>
            <p className="mt-4 text-muted text-sm max-w-xl">
              A 4-section document delivered via Gamma within 24–48 hours. Financial
              ROI summary appears at the top AND the bottom — so the number is never buried.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reportSections.map((s, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${s.color}`}>
                <div className={`text-xs font-mono font-bold mb-3 ${s.labelColor}`}>
                  SECTION {s.number}
                </div>
                <h3 className="font-bold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 rounded-xl bg-green-light border border-green-border">
            <p className="text-sm text-ink font-semibold mb-1">ROI formula, every time:</p>
            <p className="text-sm font-mono text-green-DEFAULT">
              hours saved/wk × $100/hr × 4 wks − tool costs = net monthly value
            </p>
            <p className="text-xs text-muted mt-2">
              Example: 8 hrs/wk × $100 × 4 = $3,200 − $59/mo =&nbsp;
              <strong className="text-ink">$3,141/mo net</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Tier 2 */}
      <section id="tier-2" className="section-padding bg-cream section-divider">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-light border border-blue-border text-blue-DEFAULT text-xs font-mono font-bold mb-4">
              Tier 2
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              Solution Buildout
            </h2>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-black text-ink">Book a call</span>
              <span className="text-muted font-mono text-sm">scoped to your plan</span>
            </div>
            <p className="mt-3 text-muted max-w-xl">
              Once the assessment shows what&apos;s worth building, we build it — turning the wins
              you&apos;ve proven by hand into repeatable systems, all on Claude.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tier2Buildout.map((item, i) => (
              <div key={i} className="card-hover p-6">
                <h3 className="font-bold text-ink mb-2">{item.name}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-3 inline-flex"
            >
              Book a Call to Scope It
            </a>
          </div>
        </div>
      </section>

      {/* Tier 3 — Claude Proficiency Program */}
      <section id="tier-3" className="section-padding bg-paper section-divider">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/light border border-accent/30 text-accent text-xs font-mono font-bold mb-4">
              Tier 3
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              Claude Proficiency Program
            </h2>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-black text-ink">Book a call</span>
              <span className="text-muted font-mono text-sm">priced per team</span>
            </div>
            <p className="mt-3 text-muted max-w-xl">
              1:1 training that makes each team member genuinely fluent with Claude — about
              four 60-minute sessions on a weekly cadence, remote or in-person in Sacramento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {proficiencyStages.map((stage, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${stage.color}`}>
                <div className={`text-xs font-mono font-bold mb-3 ${stage.labelColor}`}>
                  STAGE {stage.number}
                </div>
                <h3 className="font-bold text-ink mb-2">{stage.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-cream border border-border">
            <p className="text-sm text-ink font-semibold mb-3">What each person walks away with:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {proficiencyOutcomes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-accent mt-0.5 shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-3 inline-flex"
            >
              Book a Call to Discuss Team Training
            </a>
          </div>
        </div>
      </section>

      {/* Tier 4 */}
      <section id="tier-4" className="section-padding bg-ink text-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-light border border-purple-border text-purple-DEFAULT text-xs font-mono font-bold mb-4">
              Tier 4
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Fractional Chief AI Officer
            </h2>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-black text-white">Book a call</span>
              <span className="text-white/50 font-mono text-sm">monthly retainer</span>
            </div>
            <p className="mt-3 text-white/60 max-w-xl leading-relaxed">
              Embedded AI leadership for businesses that are serious about making AI a permanent part
              of how they operate — not a one-time project that fades after the engagement ends.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {tier4Includes.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-purple-DEFAULT mt-0.5 shrink-0">→</span>
                <p className="text-sm text-white/80">{item}</p>
              </div>
            ))}
          </div>

          <div className="p-7 rounded-2xl bg-white/5 border border-white/10 max-w-xl">
            <p className="text-sm text-white/60 leading-relaxed">
              <strong className="text-white">What this looks like in practice:</strong>{" "}
              New leverage gets built as your business evolves, your team keeps getting more
              fluent, and you get a strategic partner who knows your operations deeply — and
              keeps finding the next win over time.
            </p>
          </div>

          <div className="mt-8">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors"
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-ink tracking-tight mb-4">
            Not sure which tier is right for you?
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Book a free intro call. We&apos;ll listen to your business, ask a few questions,
            and tell you honestly whether the Assessment makes sense right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com/tylercapps/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4 w-full sm:w-auto"
            >
              Book a Free Intro Call
            </a>
            <Link href="/#faq" className="btn-secondary px-8 py-4 w-full sm:w-auto">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
