import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/tylercapps/intro";

const tiers = [
  {
    number: "Tier 1",
    name: "AI Business Assessment",
    price: "$1,000",
    priceNote: "one-time",
    tagline: "Know exactly where AI can help — before spending a dollar on tools.",
    highlights: [
      "One-hour interview",
      "Effort/Impact matrix of every pain point",
      "Quick wins + ranked, ROI-backed solutions",
      "Financial ROI summary",
      "Personalized roadmap to roll out specific AI fluency",
    ],
    cta: "Get Your Assessment",
    ctaHref: "/pricing#tier-1",
    external: false,
    color: "border-green-border",
    badgeColor: "bg-green-light text-green-DEFAULT border-green-border",
    ctaColor: "bg-green-DEFAULT hover:bg-green-hover text-white",
  },
  {
    number: "Tier 2",
    name: "Solution Buildout",
    price: null,
    priceNote: null,
    tagline: "Turn the wins you've proven by hand into repeatable systems.",
    highlights: [
      "We build the highest-leverage solutions from your plan",
      "All built on Claude — no brittle tool sprawl",
      "Opportunity-to-output cycle measured in minutes",
      "Scoped to the ROI you saw in the assessment",
    ],
    cta: "Book a Call",
    ctaHref: CALENDLY_URL,
    external: true,
    color: "border-blue-border",
    badgeColor: "bg-blue-light text-blue-DEFAULT border-blue-border",
    ctaColor: "bg-blue-DEFAULT hover:bg-blue-hover text-white",
  },
  {
    number: "Tier 3",
    name: "Claude Proficiency Program",
    price: null,
    priceNote: null,
    tagline: "1:1 training that makes your team genuinely fluent with Claude.",
    highlights: [
      "~4 sessions of 60-min 1:1 coaching, weekly cadence",
      "Personalized learning roadmap per team member",
      "A custom Claude Project + one custom Skill they keep",
      "Remote, or in-person in Sacramento",
    ],
    cta: "Book a Call",
    ctaHref: CALENDLY_URL,
    external: true,
    color: "border-accent/30",
    badgeColor: "bg-accent/light text-accent border-accent/30",
    ctaColor: "bg-accent hover:bg-accent-hover text-white",
  },
  {
    number: "Tier 4",
    name: "Fractional Chief AI Officer",
    price: null,
    priceNote: null,
    tagline: "Embedded AI leadership — not a consultant who delivers and leaves.",
    highlights: [
      "Ongoing AI strategy & quarterly roadmap",
      "Continuous buildout of new leverage, on Claude",
      "Team training and enablement",
      "A partner who stays accountable to your results",
    ],
    cta: "Book a Call",
    ctaHref: CALENDLY_URL,
    external: true,
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
            Every engagement starts with the Assessment. Follow-on work is scoped
            on a call — and only recommended once we know it&apos;ll pay for itself.
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
                  {tier.price ? (
                    <>
                      <div className="text-2xl font-black text-ink">{tier.price}</div>
                      <div className="text-xs text-muted font-mono">{tier.priceNote}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-black text-ink">Book a call</div>
                      <div className="text-xs text-muted font-mono">custom scope</div>
                    </>
                  )}
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

              {tier.external ? (
                <a
                  href={tier.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-colors ${tier.ctaColor}`}
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  href={tier.ctaHref}
                  className={`inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-colors ${tier.ctaColor}`}
                >
                  {tier.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
