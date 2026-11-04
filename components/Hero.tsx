import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import ChatWidget from "@/components/ChatWidget";
import { SNAPSHOT_LINKED } from "@/lib/flags";

const bullets = [
  "A one-hour conversation about your week — no technical background needed",
  "Walk away with a plan with real dollar figures on every line — ready to act on this week",
  "Built for businesses where the owner still answers the phone",
];

const heroTextLink =
  "self-start sm:self-center text-base font-semibold text-ink underline underline-offset-4 hover:text-accent transition-colors";

export default function Hero() {
  return (
    <section className="relative bg-paper overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 bg-hero-texture pointer-events-none" />

      <div className="relative max-w-[76rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 lg:pb-16">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="eyebrow mb-6">
            For Sacramento owners and team leads
          </p>

          {/* Headline (the hook) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight text-balance mb-6">
            How to look like you hired{" "}
            <span className="text-accent">a whole new team</span>
            {" "}— without hiring anyone.
          </h1>

          {/* Phones: booking button right under the headline, before the story */}
          <BookingLink
            location="hero-mobile"
            label="Book a free 15-min call →"
            className="btn-primary w-full text-base px-8 py-4 mb-6 sm:hidden"
          >
            Book a free 15-min call →
          </BookingLink>

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
          <ul className="space-y-2.5 mb-8 max-w-xl">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-ink/80">
                <span className="text-accent font-bold mt-0.5 shrink-0">✓</span>
                <span className="text-base sm:text-lg">{b}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <BookingLink
              location="hero"
              label="Book a free 15-min call →"
              className="btn-primary text-base px-8 py-4 hidden sm:inline-flex"
            >
              Book a free 15-min call →
            </BookingLink>
            {SNAPSHOT_LINKED ? (
              <BookingLink
                location="hero-snapshot"
                label="Not ready to talk? Get the free 5-minute AI Snapshot"
                href="/assessment"
                className={heroTextLink}
              >
                Not ready to talk? Get the free 5-minute AI Snapshot →
              </BookingLink>
            ) : (
              <Link href="/pricing" className={heroTextLink}>
                See services and pricing →
              </Link>
            )}
            <ChatWidget />
          </div>
          <p className="mt-3 text-xs text-muted font-mono">
            15 MINUTES WITH TYLER · PICK A TIME ON THE NEXT SCREEN
          </p>
        </div>
      </div>
    </section>
  );
}
