import Link from "next/link";
import { BOOKING_URL } from "@/lib/booking";

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
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-light border border-green-border text-green-DEFAULT text-xs font-mono font-bold mb-6">
        Assess · Start Here
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-ink">AI Leverage Assessment</h3>
          <p className="text-sm text-muted mt-1">One-time · most owners start with just themselves</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-ink">$997</div>
          <div className="text-xs text-muted font-mono">per person</div>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed mb-6 pb-6 border-b border-border">
        A complete picture of where AI returns the most time and money for your team —
        with ROI numbers you can defend, before you spend a dollar on tools.{" "}
        <strong className="text-ink">At least 10× the fee identified in annual value —
        or your money back.</strong>
      </p>

      <div className="mb-6 p-4 rounded-xl bg-paper border border-border">
        <p className="text-sm text-ink font-semibold">Assessing a team or division?</p>
        <p className="text-sm text-muted mt-1">
          Group discounts plus a team kickoff workshop — scoped on a call.
        </p>
      </div>

      <ul className="space-y-3 mb-8">
        {includes.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
            <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-green-light border border-green-border text-green-DEFAULT flex items-center justify-center text-xs font-bold">✓</span>
            {item}
          </li>
        ))}
      </ul>

      {showBookingButton ? (
        <>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-xl text-base font-semibold bg-green-DEFAULT hover:bg-green-hover text-white text-center transition-colors"
          >
            Book Your Assessment
          </a>
          <p className="mt-3 text-xs text-muted text-center font-mono">
            15-MIN INTRO CALL FIRST · PLAN DELIVERED WITHIN DAYS OF YOUR INTERVIEWS
          </p>
        </>
      ) : (
        <Link href="/pricing" className="block w-full py-4 rounded-xl text-base font-semibold bg-green-DEFAULT hover:bg-green-hover text-white text-center transition-colors">
          See Full Pricing Details
        </Link>
      )}
    </div>
  );
}
