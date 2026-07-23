import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/tylercapps/intro";

interface PricingCardProps {
  showBookingButton?: boolean;
}

export default function PricingCard({ showBookingButton = true }: PricingCardProps) {
  const includes = [
    "A one-hour workflow interview per person — up to 4 people included",
    "Every pain point plotted on a business-impact × effort priority map",
    "Solutions ranked by leverage — each with a best-in-class path and a Claude-native path",
    "Per-play stat strip: time replaced · added tool cost · real ROI",
    "Conservative financial math: hours × $100/hr, annualized — a floor that holds up in front of a CFO",
    "“Start Monday” next steps, so momentum begins the same week",
    "90-minute team kickoff workshop",
    "A leverage scoreboard: targets set now, validated as builds ship",
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
          <p className="text-sm text-muted mt-1">One-time · lead + up to 3 team members</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-ink">$3,500</div>
          <div className="text-xs text-muted font-mono">+$750 per added person</div>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed mb-6 pb-6 border-b border-border">
        A complete picture of where AI returns the most time and money for your team —
        with ROI numbers you can defend, before you spend a dollar on tools.
      </p>

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
            href={CALENDLY_URL}
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
