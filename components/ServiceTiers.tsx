import Link from "next/link";
import { BOOKING_URL } from "@/lib/booking";

const tiers = [
  {
    number: "Assess",
    name: "AI Leverage Assessment",
    price: "$997",
    priceNote: "per person",
    tagline:
      "Know your highest-leverage AI moves — ranked, priced, and ROI-backed — before you commit to anything.",
    highlights: [
      "Finds where AI has the highest leverage to save you time and make you money — off-the-shelf tool, custom build, or Claude-native system, whatever fits",
      "Your Leverage Map: every play ranked by leverage, two build paths each",
      "Built to identify at least 10× the fee in annual value — or we keep digging",
      "Sets the scoreboard every later engagement is measured against",
      "Teams & divisions: group discounts + a kickoff workshop — ask on a call",
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
    price: "$1,500",
    priceNote: "per person · outcome-based",
    tagline:
      "1:1 coaching graded on outcomes, not session counts — you're done when the capabilities exist.",
    highlights: [
      "Source: Claude learns their world — it stops being generic, starts sounding like them",
      "Skills: a reusable Skill for every task they do more than once",
      "Systems: the repetitive work runs on autopilot — hours their Leverage Map flagged",
      "Typical result: $10K–$15K/yr in reclaimed time per person — ~10× the fee",
      "Group discounts for teams — ask on a call",
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
    price: "$15K–$85K",
    priceNote: "scoped to your team on a call",
    tagline:
      "One afternoon where every person on your team ships a real tool against their own real problem.",
    highlights: [
      "Every attendee automates one real workflow — modeled at $10K–$15K/yr in reclaimed time each",
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
    price: "from $15,000",
    priceNote: "per month · 5–10× target, on your scoreboard",
    tagline:
      "An embedded partner whose job is returning a multiple of what you pay — in reclaimed hours, faster decisions, and capability that stays.",
    highlights: [
      "Each month, 2–3 of your people go through the full program — 24–36 a year, until the whole team runs this way",
      "Each person targets $10K–$15K/yr in reclaimed time: $360K–$540K/yr from seats alone",
      "Strategic builds, governance, and executive briefings stack on top",
      "The scoreboard tracks it all — validated hours, not vibes",
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
          <p className="mt-3 text-sm text-muted max-w-xl">
            Most owner-run businesses start — and often stop — with the $997 Assessment
            and a coached build or two. The bigger rungs exist for the teams that want
            them; the scoreboard decides.
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
