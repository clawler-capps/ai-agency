import Link from "next/link";

const tiers = [
  {
    number: "Tier 1",
    name: "AI Business Assessment",
    price: "$1,000",
    priceNote: "one-time",
    tagline: "Know exactly where AI can help — before spending a dollar on tools.",
    highlights: [
      "20–30 min AI-guided interview",
      "Effort/Impact matrix of every pain point",
      "Quick wins + recommended tools",
      "Financial ROI summary",
      "30-min follow-up call",
    ],
    cta: "Get Your Assessment",
    ctaHref: "/pricing#tier-1",
    color: "border-green-border",
    badgeColor: "bg-green-light text-green-DEFAULT border-green-border",
    ctaColor: "bg-green-DEFAULT hover:bg-green-hover text-white",
  },
  {
    number: "Tier 2",
    name: "Tool Setup & Quick Wins",
    price: "$500–$1,500",
    priceNote: "per tool / project",
    tagline: "Install the tools from your report. Done-for-you setup.",
    highlights: [
      "Fathom — AI meeting notes",
      "DashThis — reporting dashboards",
      "SaneBox — intelligent email triage",
      "Custom GPTs trained on your business",
    ],
    cta: "See Tier 2 Details",
    ctaHref: "/pricing#tier-2",
    color: "border-blue-border",
    badgeColor: "bg-blue-light text-blue-DEFAULT border-blue-border",
    ctaColor: "bg-blue-DEFAULT hover:bg-blue-hover text-white",
  },
  {
    number: "Tier 3",
    name: "Automation & Process Redesign",
    price: "$2,000–$5,000",
    priceNote: "per project",
    tagline: "Redesign broken workflows, then build the automations.",
    highlights: [
      "CRM setup (Go HighLevel)",
      "Speed-to-lead AI agents",
      "Make.com / Zapier automations",
      "CEO dashboards & reporting",
    ],
    cta: "See Tier 3 Details",
    ctaHref: "/pricing#tier-3",
    color: "border-accent/30",
    badgeColor: "bg-accent/light text-accent border-accent/30",
    ctaColor: "bg-accent hover:bg-accent-hover text-white",
  },
  {
    number: "Tier 4",
    name: "Fractional Chief AI Officer",
    price: "$5,000–$15,000",
    priceNote: "per month",
    tagline: "Embedded AI leadership — not a consultant who delivers and leaves.",
    highlights: [
      "Ongoing AI strategy & roadmap",
      "Continuous automation buildouts",
      "Monthly team training",
      "Competitive intelligence briefings",
      "CEO dashboard management",
    ],
    cta: "See Tier 4 Details",
    ctaHref: "/pricing#tier-4",
    color: "border-purple-border",
    badgeColor: "bg-purple-light text-purple-DEFAULT border-purple-border",
    ctaColor: "bg-purple-DEFAULT hover:bg-purple-hover text-white",
  },
];

export default function ServiceTiers() {
  return (
    <section className="section-padding bg-paper section-divider">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="eyebrow mb-3">Four-Tier Funnel</p>
          <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
            Services & Pricing
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl">
            Every engagement starts with the Assessment. Follow-on work is only
            recommended after we know it&apos;ll pay for itself.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiers.map((tier, i) => (
            <div key={i} className={`card-hover p-8 border-2 ${tier.color}`}>
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${tier.badgeColor}`}>
                  {tier.number}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-black text-ink">{tier.price}</div>
                  <div className="text-xs text-muted font-mono">{tier.priceNote}</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-ink mb-2">{tier.name}</h3>
              <p className="text-sm text-muted mb-5 leading-relaxed">{tier.tagline}</p>

              <ul className="space-y-2 mb-6">
                {tier.highlights.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-ink/80">
                    <span className="mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                className={`inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-colors ${tier.ctaColor}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
