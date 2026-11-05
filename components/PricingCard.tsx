import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import { ASSESSMENT_CHECKOUT_URL } from "@/lib/site";

interface PricingCardProps {
  showBookingButton?: boolean;
}

export default function PricingCard({ showBookingButton = true }: PricingCardProps) {
  const includes = [
    "A one-hour workflow interview — a conversation about how you work, not a technical audit",
    "Finds the handful of places AI will actually move the needle for your business — and the many places it won't — off-the-shelf tool, custom build, or Claude-native system, whatever fits",
    "Every pain point plotted by payoff vs. effort, so the quick wins are obvious",
    "Recommendations ranked by payoff — each with a polished version and one that runs on tools you already pay for",
    "Every recommendation shows three numbers: hours it saves, what it costs to run, what it nets you per year",
    "Numbers you'd bet your own money on — counted low on purpose, solid enough for a CFO if you have one",
    "“Start Monday” next steps, so momentum begins the same week",
    "A running scoreboard: what each fix should save, checked against what it actually saves",
  ];

  return (
    <div id="assess" className="card border-2 border-green-border p-8 lg:p-10">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-light border border-green-border text-green text-xs font-mono font-bold mb-6">
        Assess · Start Here
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-ink">AI Leverage Assessment</h3>
          <p className="text-sm text-muted mt-1">One-time · start with just you, add team members later</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-ink">$997</div>
          <div className="text-xs text-muted font-mono">for the owner</div>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed mb-6 pb-6 border-b border-border">
        A complete picture of where AI returns the most time and money for your team —
        with ROI numbers you can defend, before you spend a dollar on tools.{" "}
        <strong className="text-ink">At least 10× the fee identified in annual value —
        or your money back.</strong>
      </p>

      <div className="mb-6 p-4 rounded-xl bg-paper border border-border">
        <p className="text-sm text-ink font-semibold">Add team members later</p>
        <p className="text-sm text-muted mt-1">
          The $997 covers the owner. Small teams don&apos;t multiply it by headcount:
          add people once your own map shows it&apos;s worth it, with group discounts
          and a kickoff workshop for teams and divisions.
        </p>
      </div>

      <ul className="space-y-3 mb-8">
        {includes.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
            <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-green-light border border-green-border text-green flex items-center justify-center text-xs font-bold">✓</span>
            {item}
          </li>
        ))}
      </ul>

      {showBookingButton ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BookingLink
              location="pricing-assess-buy"
              label="Book the Assessment"
              href={ASSESSMENT_CHECKOUT_URL}
              className="block w-full py-4 rounded-xl text-base font-semibold bg-green hover:bg-green-hover text-white text-center transition-colors"
            >
              Book the Assessment →
            </BookingLink>
            <BookingLink
              location="pricing-assess"
              label="Start with a free 15-min call →"
              className="block w-full py-4 rounded-xl text-base font-semibold border border-ink/20 text-ink hover:border-ink/40 hover:bg-ink/5 text-center transition-colors"
            >
              Start with a free 15-min call
            </BookingLink>
          </div>
          <p className="mt-3 text-xs text-muted text-center font-mono">
            $997 FOR THE OWNER · 10× OR YOUR MONEY BACK · PLAN DELIVERED WITHIN DAYS OF YOUR INTERVIEW
          </p>
        </>
      ) : (
        <Link href="/pricing" className="block w-full py-4 rounded-xl text-base font-semibold bg-green hover:bg-green-hover text-white text-center transition-colors">
          See Full Pricing Details
        </Link>
      )}
    </div>
  );
}
