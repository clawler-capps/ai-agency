import type { Metadata } from "next";
import Link from "next/link";
import PricingCard from "@/components/PricingCard";
import { BOOKING_URL } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Pricing — Sacramento AI Agency",
  description:
    "Start with a $997 AI Leverage Assessment. Outcome-based AI fluency coaching, team build days, and embedded AI leadership — for Sacramento businesses and enterprise teams.",
};

// ── The Leverage Map — what the assessment deliverable contains ───────────────
const planSections = [
  {
    number: "01",
    title: "Executive Summary: Where You Are, and What's Next",
    description:
      "The honest read on your current AI position — friction today vs. the outcome ahead — with a headline metric in hours per week and dollars per year.",
    color: "border-green-border bg-green-light",
    labelColor: "text-green-DEFAULT",
  },
  {
    number: "02",
    title: "Priority Map: Impact vs. Effort",
    description:
      "Every recommendation plotted on a business-impact × effort grid, so the quick wins are unmistakable and the higher-ceiling builds are sequenced, not skipped.",
    color: "border-blue-border bg-blue-light",
    labelColor: "text-blue-DEFAULT",
  },
  {
    number: "03",
    title: "Solutions Ranked by Leverage — Two Paths Each",
    description:
      "Each play comes with Path A (best-in-class build) and Path B (Claude-native, minimal new tools) plus a stat strip: time replaced · added tool cost · real ROI. You pick your complexity tolerance.",
    color: "border-accent/30 bg-accent/light",
    labelColor: "text-accent",
  },
  {
    number: "04",
    title: "Financial Impact + Start-Monday Next Steps",
    description:
      "Hours reclaimed × $100/hr, annualized — a deliberately conservative floor. Then a short list of what to do Monday so momentum starts the same week.",
    color: "border-purple-border bg-purple-light",
    labelColor: "text-purple-DEFAULT",
  },
];

// ── Enable — outcome-based coaching, graded on the three S's ──────────────────
const threeSs = [
  {
    letter: "S1",
    name: "Source",
    outcome:
      "Claude learns your world — your role, your context, your voice — so it stops giving generic answers and starts sounding like you.",
    color: "border-green-border bg-green-light",
    labelColor: "text-green-DEFAULT",
  },
  {
    letter: "S2",
    name: "Skills",
    outcome:
      "Any task you do more than once becomes a reusable Skill — your best work packaged into tools you call up in one click, any time.",
    color: "border-blue-border bg-blue-light",
    labelColor: "text-blue-DEFAULT",
  },
  {
    letter: "S3",
    name: "Systems",
    outcome:
      "The repetitive parts run on autopilot — reclaiming the hours your Leverage Map flagged, starting with the highest-leverage areas.",
    color: "border-accent/30 bg-accent/light",
    labelColor: "text-accent",
  },
];

// ── Build Day — the five components of the stack ──────────────────────────────
const buildDayStack = [
  {
    title: "Per-person assessment onramp",
    description:
      "A leverage-assessment call for every attendee before the event — everyone arrives with a real problem, sample files, and a personal Leverage Map. No blank pages.",
  },
  {
    title: "Champion training",
    description:
      "3–5 of your own people — the ones we've already coached — align on coaching a room, then work the floor on the day. The capability stays in-house when the room clears.",
  },
  {
    title: "The build day itself",
    description:
      "A guaranteed win in hour one, then cross-functional teams of 4–5 build real tools against their own real workflows, with coaches circulating.",
  },
  {
    title: "Design → Price → Pitch finale",
    description:
      "Every team designs, prices, and pitches its build to leadership, Shark-Tank style — judged on business value, not novelty.",
  },
  {
    title: "The Monday-after follow-through",
    description:
      "Every tool ships as a reusable Skill (not a chat), one build goes on a schedule before anyone leaves, and 1–3 builds are named for pilot with an owner attached.",
  },
];

const buildDayTiers = [
  {
    name: "AI Build Day",
    format: "Two in-person half-days, your champions on the floor",
    reach: "~40 people",
    value: "Modeled value: $400K–$600K/yr in reclaimed time",
    featured: true,
  },
  {
    name: "Build Day + Pilot Sprint",
    format: "The Build Day, plus pilot acceleration and a leadership readout",
    reach: "~40 people",
    value: "For teams that want the top builds shipped, not just started",
  },
  {
    name: "Virtual Build Day",
    format: "A lighter, expert-led virtual half-day for distributed teams",
    reach: "~15 people",
    value: "Modeled value: $150K–$225K/yr in reclaimed time",
  },
];

// ── Lead — the retainer tiers ─────────────────────────────────────────────────
const retainerTiers = [
  {
    name: "AI Embedded",
    price: "from $15,000",
    per: "/mo",
    tagline: "The delivery engine — continuous capability-building across your team.",
    includes: [
      "3 rotating seats: assessment + 3 sessions + one real build per person",
      "A Leverage Assessment for each person as their seat comes up",
      "Open office hours for all program alumni",
      "Async support + quarterly roadmap review",
    ],
  },
  {
    name: "Fractional AI Officer",
    price: "Custom",
    per: "scoped to your mandate",
    tagline: "Everything in Embedded, plus an embedded AI leadership mandate.",
    featured: true,
    includes: [
      "Up to 2 strategic builds per month",
      "A governance & compliance framework for your division",
      "Monthly executive briefing to your sponsor and their exec line",
      "A standing build roadmap, org-wide rollout as new teams come online",
    ],
  },
  {
    name: "AI Center of Excellence",
    price: "Custom",
    per: "scoped org-wide",
    tagline: "Everything in Officer, plus your own org-wide AI assistant.",
    includes: [
      "A white-labeled, org-wide compounding assistant",
      "Every assessed employee gets a personal AI agent that compounds context over time",
      "Per-seat scaling beyond ~100 seats",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="pt-20 bg-paper">
      {/* Header */}
      <section className="section-padding bg-paper border-b border-border">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-4">The Service Ladder</p>
          <h1 className="text-5xl sm:text-6xl font-black text-ink tracking-tight mb-6">
            Assess. Enable.<br />
            <span className="text-accent">Lead.</span>
          </h1>
          <p className="text-lg text-muted max-w-xl leading-relaxed">
            Every engagement starts with the AI Leverage Assessment. Each rung after
            that is only recommended once the scoreboard shows it will pay for itself.
          </p>
        </div>
      </section>

      {/* Assess — AI Leverage Assessment */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-3xl mx-auto">
          <PricingCard showBookingButton={true} />
        </div>
      </section>

      {/* Inside Your Leverage Map */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="eyebrow mb-3">What You Receive</p>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              Inside Your Leverage Map
            </h2>
            <p className="mt-4 text-muted text-sm max-w-xl">
              A per-person, card-based plan ranked highest leverage to lowest — built from
              your workflows, your systems, and your economics. Not a generic AI deck.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {planSections.map((s, i) => (
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
            <p className="text-sm text-ink font-semibold mb-1">The ROI math, every time:</p>
            <p className="text-sm font-mono text-green-DEFAULT">
              hours reclaimed/wk × $100/hr × 48 wks = annual value floor
            </p>
            <p className="text-xs text-muted mt-2">
              Example: 9 hrs/wk × $100 × 48 =&nbsp;
              <strong className="text-ink">$43,200/yr</strong> — a deliberately conservative
              floor. For executives whose deals move the bottom line monthly, it understates
              the return.
            </p>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-ink text-white">
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-2">
              Then we keep score
            </p>
            <p className="text-sm text-white/80 leading-relaxed">
              The assessment sets a target. From there, every engagement runs against a{" "}
              <strong className="text-white">leverage scoreboard</strong>: a build only counts
              as realized once you confirm the real hours it saves in practice — validated,
              not just shipped. You always know exactly what your investment has returned.
            </p>
          </div>
        </div>
      </section>

      {/* Enable — AI Fluency Coaching */}
      <section id="enable" className="section-padding bg-cream section-divider">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-light border border-blue-border text-blue-DEFAULT text-xs font-mono font-bold mb-4">
              Enable
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              AI Fluency Coaching
            </h2>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-2xl font-black text-ink">$1,500</span>
              <span className="text-muted font-mono text-sm">per person · outcome-based</span>
            </div>
            <p className="mt-3 text-muted max-w-xl">
              The From Tool to System program: 1:1 coaching built around how each person
              actually works — and graded on outcomes, not session counts. You&apos;re done
              when the three S&apos;s exist, not when the calendar runs out. Remote across
              the U.S. &amp; Canada, in-person option in Sacramento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {threeSs.map((s, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${s.color}`}>
                <div className={`text-xs font-mono font-bold mb-3 ${s.labelColor}`}>
                  {s.letter} — {s.name.toUpperCase()}
                </div>
                <h3 className="font-bold text-ink mb-2">{s.name}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.outcome}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-accent/light border border-accent/30">
              <p className="text-sm text-ink font-semibold mb-2">
                What a coached person is worth
              </p>
              <p className="text-sm text-muted leading-relaxed">
                The typical result is <strong className="text-ink">$10K–$15K per year in
                reclaimed time</strong> — roughly 10× the fee — plus a person who keeps
                finding the next win on their own. That&apos;s the point: the capability
                stays after we leave.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-paper border border-border">
              <p className="text-sm text-ink font-semibold mb-2">Terms</p>
              <ul className="space-y-1.5 text-sm text-muted">
                <li>→ Group discounts for teams — scoped on a call</li>
                <li>→ Ongoing monthly per-seat coaching available on request</li>
                <li>→ Remote (U.S. &amp; Canada) · in-person option in Sacramento</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-3 inline-flex"
            >
              Book a Call to Discuss Team Coaching
            </a>
          </div>
        </div>
      </section>

      {/* Deploy — AI Build Day */}
      <section id="build-day" className="section-padding bg-paper section-divider">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/light border border-accent/30 text-accent text-xs font-mono font-bold mb-4">
              Deploy
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              AI Build Day
            </h2>
            <p className="mt-3 text-muted max-w-xl">
              Your department doesn&apos;t need another AI training. It needs one afternoon
              where every person ships a real tool against their own real problem — coached
              by the experts you&apos;ve already built. Not a training. A build day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {buildDayStack.map((item, i) => (
              <div key={i} className="card-hover p-6">
                <div className="text-xs font-mono font-bold text-accent mb-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
            <div className="p-6 rounded-2xl bg-ink text-white">
              <div className="text-xs font-mono font-bold text-accent mb-3">WHY IT STICKS</div>
              <p className="text-sm text-white/80 leading-relaxed">
                Most hackathon demos die within weeks. Ours ship as reusable Skills with an
                internal champion bench behind them — the two mechanisms that make week two
                look like day one.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            {buildDayTiers.map((tier, i) => (
              <div
                key={i}
                className={
                  tier.featured
                    ? "card p-6 border-2 border-accent ring-1 ring-accent/30"
                    : "card-hover p-6"
                }
              >
                {tier.featured && (
                  <div className="inline-flex px-2.5 py-1 rounded-md bg-accent text-white text-xs font-mono font-bold mb-3">
                    The Flagship
                  </div>
                )}
                <h3 className="font-bold text-ink">{tier.name}</h3>
                <p className="text-sm text-muted leading-relaxed mt-2">{tier.format}</p>
                <p className="text-xs text-muted font-mono mt-2">{tier.reach}</p>
                <p className="text-sm text-accent font-semibold mt-3">{tier.value}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-cream border border-border max-w-2xl">
            <p className="text-sm text-ink font-semibold mb-1">Pricing</p>
            <p className="text-sm text-muted leading-relaxed">
              One flat fee — fill the room. Build Days are scoped to your team size and
              format on a call; every attendee automates one real workflow, modeled at
              $10K–$15K/yr in reclaimed time each. Travel &amp; lodging at cost outside
              Sacramento; room, AV, and catering are client-side.
            </p>
          </div>

          <div className="mt-8">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-3 inline-flex"
            >
              Book a Call to Scope a Build Day
            </a>
          </div>
        </div>
      </section>

      {/* Lead — Embedded AI Partner */}
      <section id="lead" className="section-padding bg-ink text-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-light border border-purple-border text-purple-DEFAULT text-xs font-mono font-bold mb-4">
              Lead
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Embedded AI Partner
            </h2>
            <p className="mt-3 text-white/60 max-w-xl leading-relaxed">
              The goal is simple: <strong className="text-white">return a multiple of what
              you pay, every month</strong> — in reclaimed hours, faster decisions, and a
              team that keeps getting more capable. Rotating seats move person after person
              through the full program, so the capability compounds instead of plateauing.
            </p>
            <p className="mt-3 text-white/80 max-w-xl leading-relaxed text-sm font-mono">
              Engagements start at $15,000/mo — upper tiers are scoped to your mandate on a call.
            </p>
          </div>

          {/* The return math */}
          <div className="mb-10 p-7 rounded-2xl bg-white/5 border border-white/10">
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-3">
              The math we run toward
            </p>
            <p className="text-white/80 leading-relaxed max-w-3xl">
              Rotating seats put <strong className="text-white">24–36 people a year</strong>{" "}
              through the program. At the typical{" "}
              <strong className="text-white">$10K–$15K/yr reclaimed per person</strong>,
              that&apos;s <strong className="text-white">$360K–$540K/yr from coaching
              alone</strong> — before strategic builds (median $14K/yr each), the adoption
              ripple, and the enterprise upside of faster decisions. The target we hold
              ourselves to: <strong className="text-accent">5–10× your investment in
              annual value</strong>, tracked on your leverage scoreboard and validated with
              you — not assumed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10 items-start">
            {retainerTiers.map((tier, i) => (
              <div
                key={i}
                className={
                  tier.featured
                    ? "p-7 rounded-2xl bg-white/10 border-2 border-purple-DEFAULT"
                    : "p-7 rounded-2xl bg-white/5 border border-white/10"
                }
              >
                {tier.featured && (
                  <div className="inline-flex px-2.5 py-1 rounded-md bg-purple-DEFAULT text-white text-xs font-mono font-bold mb-3">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <div className="flex items-baseline gap-1.5 mt-2 mb-3">
                  <span className="text-2xl font-black">{tier.price}</span>
                  <span className="text-white/50 text-sm">{tier.per}</span>
                </div>
                <p className="text-sm text-white/60 mb-4 leading-relaxed">{tier.tagline}</p>
                <ul className="space-y-2">
                  {tier.includes.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-purple-DEFAULT mt-0.5 shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-7 rounded-2xl bg-white/5 border border-white/10 max-w-2xl">
            <p className="text-sm text-white/60 leading-relaxed">
              <strong className="text-white">Governance, built in:</strong>{" "}
              AI drafts, humans decide. Every client- and exec-facing output passes a human
              accuracy and compliance check — a feature, not a constraint, and one your
              compliance team will thank you for.
            </p>
          </div>

          <div className="mt-8">
            <a
              href={BOOKING_URL}
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
            Not sure where you sit on the ladder?
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Book a free intro call. We&apos;ll listen to how your team works, ask a few
            questions, and tell you honestly whether the Assessment makes sense right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={BOOKING_URL}
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
