import type { Metadata } from "next";
import Link from "next/link";
import PricingCard from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Pricing — Capps AI",
  description:
    "Four tiers from $1,000 assessment to $15K/month fractional CAO retainer. ROI-first AI consulting for Sacramento businesses.",
};

// ── Tier data ──────────────────────────────────────────────────────────────────
const tier2Tools = [
  {
    tool: "Fathom",
    why: "AI meeting notes — auto-transcribes, summarizes, assigns action items",
    complexity: "Low",
    cost: "$0/mo (free tier)",
    setup: "1–2 hrs",
    saved: "3–5 hrs/wk",
  },
  {
    tool: "DashThis",
    why: "Reporting dashboards — pulls GA, Meta Ads, Google Ads automatically",
    complexity: "Low–Medium",
    cost: "$49–$149/mo",
    setup: "2–4 hrs",
    saved: "4–8 hrs/mo",
  },
  {
    tool: "SaneBox",
    why: "Intelligent email triage — priority inbox, auto-snooze, unsubscribe",
    complexity: "Low",
    cost: "$7–$36/mo",
    setup: "30 min",
    saved: "1–3 hrs/wk",
  },
  {
    tool: "Custom GPT",
    why: "Train a GPT on your business data to handle 95% of repetitive Q&A",
    complexity: "Medium",
    cost: "$20/mo (ChatGPT Plus)",
    setup: "3–6 hrs",
    saved: "5–10 hrs/wk",
  },
];

const tier3Projects = [
  {
    name: "CRM Setup (Go HighLevel)",
    price: "$3,000–$5,000",
    desc: "Full CRM with pipelines, automations, and follow-up sequences. Or white-labeled as a monthly SaaS for your agency clients.",
  },
  {
    name: "Speed-to-Lead AI Agent",
    price: "$1,500–$3,000",
    desc: "Auto-respond to new leads in seconds, 24/7, via Make.com or Zapier. Never lose a lead to a slow response again.",
  },
  {
    name: "Process Optimization",
    price: "$2,000–$5,000",
    desc: "Fix the broken process before automating it. Map, simplify, document — then build the automation on a solid foundation.",
  },
  {
    name: "CEO Dashboard",
    price: "$1,500–$3,000",
    desc: "One real-time view: revenue, pipeline, ops metrics. Auto-pulls from all your tools. Never compile a report manually again.",
  },
];

const tier4Includes = [
  "Ongoing AI strategy and quarterly roadmap",
  "Continuous automation buildouts and maintenance",
  "Monthly team training sessions",
  "Competitive intelligence briefings",
  "CEO dashboard management and evolution",
  "Priority support and advisory access",
  "You become embedded infrastructure — not a consultant who delivers and leaves",
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

// ── Financial projections ──────────────────────────────────────────────────────
const projections = [
  { month: "1", assessments: "2 × free", upsells: "—", retainers: "—", total: "$0" },
  { month: "2", assessments: "2 × $500", upsells: "1 × $1K", retainers: "—", total: "$2,000" },
  { month: "3", assessments: "3 × $1K", upsells: "1 × $3K", retainers: "—", total: "$6,000" },
  { month: "4", assessments: "4 × $1K", upsells: "2 × $2K", retainers: "1 × $5K", total: "$13,000" },
  { month: "6", assessments: "4 × $1K", upsells: "2 × $3K", retainers: "2 × $5K", total: "$20,000" },
  { month: "12", assessments: "8 × $1K", upsells: "4 × $3K", retainers: "5 × $10K", total: "$70,000" },
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
            <span className="text-accent">One Clear Funnel.</span>
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
              Tool Setup & Quick Wins
            </h2>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-black text-ink">$500–$1,500</span>
              <span className="text-muted font-mono text-sm">per tool / project</span>
            </div>
            <p className="mt-3 text-muted max-w-xl">
              Install and configure the tools recommended in your assessment. Done-for-you
              setup — you get results without the learning curve.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 font-mono text-xs text-muted tracking-wider">TOOL</th>
                  <th className="text-left py-3 pr-4 font-mono text-xs text-muted tracking-wider">WHY IT FITS</th>
                  <th className="text-left py-3 pr-4 font-mono text-xs text-muted tracking-wider hidden sm:table-cell">COST/MO</th>
                  <th className="text-left py-3 pr-4 font-mono text-xs text-muted tracking-wider hidden md:table-cell">SETUP</th>
                  <th className="text-left py-3 font-mono text-xs text-muted tracking-wider">TIME SAVED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tier2Tools.map((row, i) => (
                  <tr key={i} className="hover:bg-paper transition-colors">
                    <td className="py-4 pr-4 font-semibold text-ink">{row.tool}</td>
                    <td className="py-4 pr-4 text-muted leading-snug max-w-xs">{row.why}</td>
                    <td className="py-4 pr-4 text-muted font-mono text-xs hidden sm:table-cell">{row.cost}</td>
                    <td className="py-4 pr-4 text-muted font-mono text-xs hidden md:table-cell">{row.setup}</td>
                    <td className="py-4 text-green-DEFAULT font-semibold">{row.saved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tier 3 */}
      <section id="tier-3" className="section-padding bg-paper section-divider">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/light border border-accent/30 text-accent text-xs font-mono font-bold mb-4">
              Tier 3
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              Automation & Process Redesign
            </h2>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-black text-ink">$2,000–$5,000</span>
              <span className="text-muted font-mono text-sm">per project</span>
            </div>
            <p className="mt-3 text-muted max-w-xl">
              Redesign broken workflows first — then build the automation on a solid foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tier3Projects.map((proj, i) => (
              <div key={i} className="card-hover p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-ink">{proj.name}</h3>
                  <span className="shrink-0 text-sm font-semibold text-accent">{proj.price}</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{proj.desc}</p>
              </div>
            ))}
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
              <span className="text-3xl font-black text-white">$5,000–$15,000</span>
              <span className="text-white/50 font-mono text-sm">per month</span>
            </div>
            <p className="mt-3 text-white/60 max-w-xl leading-relaxed">
              Embedded AI leadership — not a consultant who delivers and leaves. Once your dashboards
              and automations are embedded in operations, removing you means removing infrastructure.
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
              <strong className="text-white">The system-based pricing advantage:</strong>{" "}
              Once dashboards and automations are embedded in operations, removing you means
              removing infrastructure. That&apos;s a very different conversation than &ldquo;should we
              renew the consultant?&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Financial projections */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="eyebrow mb-3">Revenue Model</p>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              Financial Projections
            </h2>
            <p className="mt-4 text-muted max-w-xl">
              Targets based on the four-tier funnel — assessments feed upsells, upsells feed retainers.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-ink text-white">
                <tr>
                  <th className="text-left px-5 py-3.5 font-mono text-xs tracking-wider text-white/50">MONTH</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs tracking-wider text-white/50">ASSESSMENTS</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs tracking-wider text-white/50">UPSELLS</th>
                  <th className="text-left px-5 py-3.5 font-mono text-xs tracking-wider text-white/50">RETAINERS</th>
                  <th className="text-right px-5 py-3.5 font-mono text-xs tracking-wider text-white/50">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-paper">
                {projections.map((row, i) => (
                  <tr key={i} className="hover:bg-cream transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-ink">Mo. {row.month}</td>
                    <td className="px-5 py-4 text-muted">{row.assessments}</td>
                    <td className="px-5 py-4 text-muted">{row.upsells}</td>
                    <td className="px-5 py-4 text-muted">{row.retainers}</td>
                    <td className={`px-5 py-4 font-black text-right font-mono ${
                      row.total === "$0" ? "text-muted" : "text-ink"
                    }`}>
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-muted font-mono">
            * PROJECTIONS BASED ON FOUR-TIER FUNNEL MODEL. ACTUAL RESULTS WILL VARY.
          </p>
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
              href="https://calendly.com"
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
