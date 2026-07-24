import Link from "next/link";
import { BOOKING_URL } from "@/lib/booking";

const bullets = [
  "A one-hour conversation about your week — no technical background needed",
  "Walk away with a plan with real dollar figures on every line — ready to act on this week",
  "Built for businesses where the owner still answers the phone",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-paper overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 bg-hero-texture pointer-events-none" />

      {/* Decorative rule */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden lg:block" style={{ left: "calc(50% - 384px)" }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="eyebrow mb-6">
            Sacramento AI Agency — Tyler Capps
          </p>

          {/* Headline (the hook) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight text-balance mb-6">
            How to look like you hired{" "}
            <span className="text-accent">a whole new team</span>
            {" "}— without hiring anyone.
          </h1>

          {/* The story */}
          <div className="max-w-2xl border-l-4 border-accent/40 pl-5 py-1 mb-6">
            <p className="text-base sm:text-lg text-ink/80 italic leading-relaxed">
              An executive walked into a high-stakes call planning to present the way
              he always had. At the last minute, he swapped in something built days
              before — an interactive dashboard instead of a deck. The room reacted
              like a different company had shown up. People started using the tool
              themselves, mid-call, to sell to their own side. His team didn&apos;t
              grow the output — the system did.
            </p>
            <p className="mt-3 text-xs text-muted font-mono uppercase tracking-wide">
              A real result, anonymized under NDA
            </p>
          </div>

          {/* Bridge to the offer */}
          <p className="text-lg sm:text-xl text-muted font-light leading-relaxed max-w-2xl mb-8">
            He didn&apos;t add headcount. He added one system, built once. That&apos;s
            the whole model — and the{" "}
            <strong className="font-semibold text-ink">AI Leverage Assessment</strong>{" "}
            is where we find your version of it: at least 10× the fee identified in
            annual value, or your money back.
          </p>

          {/* Bullet proof points */}
          <ul className="space-y-2.5 mb-10 max-w-xl">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-ink/80">
                <span className="text-accent font-bold mt-0.5 shrink-0">✓</span>
                <span className="text-base sm:text-lg">{b}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-4"
            >
              Book a Free 15-Min Intro →
            </a>
            <Link href="/pricing" className="btn-secondary text-base px-8 py-4">
              See Services &amp; Pricing
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted font-mono">
            THE BUTTON OPENS AN EMAIL — NO FORMS, NO SCHEDULER. TYLER REPLIES WITHIN ONE BUSINESS DAY.
          </p>
        </div>
      </div>
    </section>
  );
}
