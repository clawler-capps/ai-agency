import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import { ASSESSMENT_CHECKOUT_URL, BUILD_DAY_FORMAT } from "@/lib/site";

type Rung = "Assess" | "Enable" | "Deploy" | "Lead";

const tiers = [
  {
    number: "Assess",
    name: "AI Leverage Assessment",
    price: "$997",
    priceNote: "for the owner · add team members later",
    tagline:
      "Know your best AI moves before you commit to anything. Each one is ranked, priced, and backed by real numbers.",
    highlights: [
      "Finds the few places AI will make a real difference for your business, whether that's an off-the-shelf tool, a custom build, or a Claude setup",
      "Your Leverage Map: a ranked to-do list of what to automate first, what it costs, and what it's worth per year",
      "At least 10× the fee identified in annual value, or your money back",
      "We write down what each fix should save you, then check the real number after it's built",
      "Start with just you. Add team members later, with group discounts for teams and divisions",
    ],
    cta: "See What's Inside",
    ctaHref: "/pricing#assess",
    external: false,
    color: "border-green-border",
    badgeColor: "bg-green-light text-green border-green-border",
    ctaColor: "bg-green hover:bg-green-hover text-white",
  },
  {
    number: "Enable",
    name: "AI Fluency Coaching",
    price: "$1,500",
    priceNote: "per person · outcome-based",
    tagline:
      "1:1 coaching graded on outcomes. You're done when you can do the work yourself, however many sessions that takes.",
    highlights: [
      "Source: Claude learns their world and starts sounding like them",
      "Skills: any task done more than once becomes a Skill, a saved recipe Claude follows the same way every time",
      "Systems: weekly reports, briefings, and follow-ups run on their own",
      "Typical result: $10K–$15K/yr in reclaimed time per person, about 10× the fee",
      "Group discounts for teams. Ask on a call",
    ],
    cta: "Compare the Tracks",
    ctaHref: "/pricing#enable",
    external: false,
    color: "border-blue-border",
    badgeColor: "bg-blue-light text-blue border-blue-border",
    ctaColor: "bg-blue hover:bg-blue-hover text-white",
  },
  {
    number: "Deploy",
    name: "AI Build Day",
    price: "$15K–$85K",
    priceNote: "scoped to your team on a call",
    tagline:
      `${BUILD_DAY_FORMAT[0].toUpperCase()}${BUILD_DAY_FORMAT.slice(1)} where every person on your team ships a real tool against their own real problem.`,
    highlights: [
      "Every attendee automates one real workflow, modeled at $10K–$15K/yr in reclaimed time each",
      "Your own people, the ones we trained first, coach the room, so the know-how stays in-house",
      "Every tool ships as a reusable Skill, one on a schedule before the room clears",
      "Teams design, price, and pitch their builds, judged on business value",
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
      "An embedded partner whose job is to return a multiple of what you pay in reclaimed hours and faster decisions.",
    highlights: [
      "Each month, 2–3 of your people go through the full program. That's 24–36 a year, until the whole team works this way",
      "Each person targets $10K–$15K/yr in reclaimed time: $360K–$540K/yr from seats alone",
      "Strategic builds, governance, and executive briefings stack on top",
      "The scoreboard tracks every hour, and an hour only counts once you confirm it",
    ],
    cta: "Book a free 15-min call",
    ctaHref: "/book",
    external: true,
    color: "border-purple-border",
    badgeColor: "bg-purple-light text-purple border-purple-border",
    ctaColor: "bg-purple hover:bg-purple-hover text-white",
  },
];

// The homepage shows Assess + Enable up top for owner-run businesses, and the
// team rungs (Build Day, Embedded) further down. Pricing shows the full ladder.
export default function ServiceTiers({ rungs, variant = "ladder" }: { rungs?: Rung[]; variant?: "ladder" | "teams" }) {
  const shown = rungs ? tiers.filter((t) => rungs.includes(t.number as Rung)) : tiers;
  return (
    <section id={variant === "teams" ? "larger-teams" : undefined} className="section-padding bg-cream section-divider">
      <div className="max-w-6xl mx-auto">
        {variant === "teams" ? (
          <div className="mb-8 lg:mb-10">
            <p className="eyebrow mb-3">For larger teams</p>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              When a whole team or division is ready
            </h2>
            <p className="mt-4 text-lg text-muted max-w-xl">
              These come after the Assessment, and only once the scoreboard shows they
              will pay for themselves. Most owner-run businesses never need them.
            </p>
            <p className="mt-3 text-sm">
              <Link href="/case-study/energy" className="font-semibold text-ink underline underline-offset-4 hover:text-accent">
                Download the 2-page case summary from an energy-company engagement →
              </Link>
            </p>
          </div>
        ) : (
        <div className="mb-8 lg:mb-10">
          <p className="eyebrow mb-3">The Service Ladder</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
            Assess → Enable → Lead
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl">
            Every engagement starts with the AI Leverage Assessment. Each rung after
            that is only recommended once the scoreboard shows it will pay for itself.
          </p>
          <p className="mt-3 text-sm text-muted max-w-xl">
            Most owner-run businesses start with the $997 Assessment and a coached build
            or two. Many stop there. The bigger rungs are for larger teams, once the
            scoreboard says they will pay off.
          </p>
        </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shown.map((tier, i) => (
            <div key={i} className={`card-hover p-6 sm:p-8 border-2 ${tier.color}`}>
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

              {tier.number === "Assess" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <BookingLink
                    location="tiers-assess-buy"
                    label="Book the Assessment"
                    href={ASSESSMENT_CHECKOUT_URL}
                    className={`inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-colors ${tier.ctaColor}`}
                  >
                    Book the Assessment →
                  </BookingLink>
                  <BookingLink
                    location="tiers-assess-call"
                    label="Start with a free 15-min call"
                    className="inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold border border-ink/20 text-ink hover:border-ink/40 hover:bg-ink/5 transition-colors"
                  >
                    Start with a free 15-min call
                  </BookingLink>
                  <Link href={tier.ctaHref} className="sm:col-span-2 text-center text-xs text-muted underline hover:text-ink">
                    {tier.cta}
                  </Link>
                </div>
              ) : tier.external ? (
                <BookingLink
                  location="tiers-lead"
                  label={tier.cta}
                  href={tier.ctaHref}
                  className={`inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-colors ${tier.ctaColor}`}
                >
                  {tier.cta}
                </BookingLink>
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
