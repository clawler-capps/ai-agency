import Link from "next/link";
import { BOOKING_URL } from "@/lib/booking";

const bullets = [
  "A one-hour conversation about your week — no technical background needed",
  "Walk away with a ranked, dollar-quantified plan you can act on this week",
  "For owner-operated Sacramento businesses and enterprise teams alike",
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

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-ink leading-[1.05] tracking-tight text-balance mb-6">
            Reclaim{" "}
            <span className="text-accent">8+ hours a week</span>
            {" "}— without becoming a &ldquo;tech person&rdquo;
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted font-light leading-relaxed max-w-2xl mb-8">
            Start with an AI Leverage Assessment: a one-hour conversation that finds
            where AI saves you the most time and makes you the most money — built to
            identify at least 10× its fee in annual value.
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
              Book Your Assessment →
            </a>
            <Link href="/pricing" className="btn-secondary text-base px-8 py-4">
              See Services &amp; Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
