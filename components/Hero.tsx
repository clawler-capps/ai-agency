import BookingLink from "@/components/BookingLink";
import { ChatLink } from "@/components/ChatWidget";

// What the free AI Snapshot gives, so the bullets match the button under them.
const bullets = [
  "Answer a few quick questions about your week. No tech background needed.",
  "See your top 3 AI time savers, with dollars per year on each",
  "Built for businesses where the owner still answers the phone",
];

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

          {/* What the Snapshot gives */}
          <ul className="space-y-2 mb-6 max-w-xl">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-ink/80">
                <span className="text-accent font-bold mt-0.5 shrink-0">✓</span>
                <span className="text-base sm:text-lg">{b}</span>
              </li>
            ))}
          </ul>

          {/* The one primary action, above the fold on phones and desktop */}
          <BookingLink
            location="hero"
            label="Get my free AI Snapshot →"
            href="/assessment"
            className="btn-primary w-full sm:w-auto text-base px-8 py-4"
          >
            Get my free AI Snapshot →
          </BookingLink>
          <p className="mt-3 text-xs text-muted font-mono">
            FREE · 3 MINUTES · YOUR TOP 3 AI TIME SAVERS, IN DOLLARS
          </p>
          <p className="mt-4 mb-10 text-sm text-ink">
            <ChatLink>Questions first? Ask our AI →</ChatLink>
          </p>

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

          {/* Bridge to the paid offer */}
          <p className="text-lg sm:text-xl text-muted font-light leading-relaxed max-w-2xl">
            He didn&apos;t add headcount. He added one system, built once. That&apos;s
            the whole model. Ready for the full hour? The{" "}
            <strong className="font-semibold text-ink">AI Leverage Assessment</strong>{" "}
            is $997. If we can&apos;t find 10× that in annual value, you get your money
            back.
          </p>
        </div>
      </div>
    </section>
  );
}
