import Link from "next/link";
import { BOOKING_URL } from "@/lib/booking";

const tiers = [
  {
    number: "Assess",
    name: "AI Leverage Assessment",
    price: "$3,500",
    priceNote: "up to 4 people · +$750/person",
    tagline:
      "Know your highest-leverage AI moves — ranked, priced, and ROI-backed — before you commit to anything.",
    highlights: [
      "A one-hour workflow interview per person",
      "Your AI Leverage Plan: every play ranked by leverage, two build paths each",
      "Conservative ROI math: hours reclaimed × $100/hr, annualized",
      "90-minute team kickoff workshop",
      "Sets the scoreboard every later engagement is measured against",
    ],
    cta: "See What's Inside",
    ctaHref: "/pricing#assess",
    external: false,
    color: "border-green-border",
    badgeColor: "bg-green-light text-green-DEFAULT border-green-border",
    ctaColor: "bg-green-DEFAULT hover:bg-green-hover text-white",
  },
  {
    number: "Enable",
    name: "AI Fluency Coaching",
    price: "$1,500+",
    priceNote: "per person",
    tagline:
      "1:1 coaching that turns your people into AI-fluent operators — shipping real builds as they learn.",
    highlights: [
      "Track A — Foundations: 3 tailored sessions + a custom Claude Project",
      "Track B — Mastery: 6 sessions + a custom Claude Skill for their highest-value work",
      "Weekly executive 1:1 included free for the engagement (a $4,500/mo value)",
      "15% bundle discount when training 4+ team members",
    ],
    cta: "Compare the Tracks",
    ctaHref: "/pricing#enable",
    external: false,
    color: "border-blue-border",
    badgeColor: "bg-blue-light text-blue-DEFAULT border-blue-border",
    ctaColor: "bg-blue-DEFAULT hover:bg-blue-hover text-white",
  },
  {
    number: "Deploy",
    name: "AI Build Day",
    price: "$15,000+",
    priceNote: "flat fee · fill the room",
    tagline:
      "One afternoon where every person on your team ships a real tool against their own real problem.",
    highlights: [
      "Voice-agent onramp: everyone arrives with a problem picked and a leverage plan in hand",
      "Your own coached champions work the floor — the capability stays in-house",
      "Every tool ships as a reusable Skill, one on a schedule before the room clears",
      "Design → price → pitch finale, judged on business value",
    ],
    cta: "See the Format",
    ctaHref: "/pricing#build-day",
    external: false,
    color: "border-accent/30",
    badgeColor: "bg-accent/light text-accent border-accent/30",
    ctaColor: "bg-accent hover:bg-accent-hover text-white",
  },
  {
    number: "Lead",
    name: "Embedded AI Partner",
    price: "$15,000+",
    priceNote: "per month",
    tagline:
      "Rotating-seat coaching, strategic builds, and governance — an embedded partner, not a vendor who delivers and leaves.",
    highlights: [
      "Rotating seats: assessment + 3 sessions + one real build per person, then the seat moves on",
      "Unlimited AI-led voice assessments + open office hours for all alumni",
      "Fractional AI Officer: strategic builds, governance framework, executive briefings",
      "AI Center of Excellence: an org-wide assistant that compounds context over time",
    ],
    cta: "Book a Call",
    ctaHref: BOOKING_URL,
    external: true,
    color: "border-purple-border",
    badgeColor: "bg-purple-light text-purple-DEFAULT border-purple-border",
    ctaColor: "bg-purple-DEFAULT hover:bg-purple-hover text-white",
  },
];

export default function ServiceTiers() {
  return (
    <section className="section-padding bg-cream section-divider">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="eyebrow mb-3">The Service Ladder</p>
          <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
            Assess → Enable → Lead
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl">
            Every engagement starts with the AI Leverage Assessment. Each rung after
            that is only recommended once the scoreboard shows it will pay for itself.
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
