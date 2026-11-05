import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import { ChatLink } from "@/components/ChatWidget";
import Headshot from "@/components/Headshot";
import { FOUNDER, PROOF } from "@/lib/site";

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
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-10 lg:gap-14 items-start">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <p className="eyebrow mb-6">
              For Sacramento owners and team leads
            </p>

            {/* Headline (the hook) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight text-balance mb-6">
              How to look like you hired{" "}
              <span className="text-accent">a whole new team</span>
              {" "}without hiring anyone.
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
            <p className="mt-4 text-sm text-ink">
              <ChatLink>Questions first? Ask our AI →</ChatLink>
            </p>
          </div>

          {/* The founder, in the hero's right half */}
          <aside className="card p-5 sm:p-6 flex lg:flex-col items-center lg:items-start gap-5 bg-cream/90">
            {/* Square on phones and tablets, 4:5 portrait in the wide hero column */}
            <Headshot size={112} priority className="lg:hidden" />
            <Headshot size={270} portrait priority className="hidden lg:block w-full h-auto" />
            <div>
              <p className="eyebrow mb-1">Who you&apos;ll work with</p>
              <p className="text-lg font-black text-ink">{FOUNDER.name}</p>
              <p className="text-sm text-muted leading-relaxed">
                {FOUNDER.credentials} · {FOUNDER.energyYears} years of energy modeling · based in Sacramento
              </p>
              <Link href="/about" className="mt-2 inline-block text-sm font-semibold text-ink underline underline-offset-4 hover:text-accent">
                More about Tyler →
              </Link>
            </div>
          </aside>
        </div>

        {/* Two before-and-afters, both from the current energy-company engagement */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border-l-4 border-accent/40 pl-5 py-1">
            <p className="text-base sm:text-lg text-ink/80 italic leading-relaxed">
              An executive walked into a high-stakes call planning to present the way
              he always had. At the last minute, he swapped in something built days
              before: an interactive dashboard in place of a deck. The room reacted
              like a different company had shown up. People started using the tool
              themselves, mid-call, to sell to their own side. His team stayed the same
              size. The system did the extra work.
            </p>
            {/* TODO(tyler): confirm title + NDA-safe (working role from the client files) */}
            <p className="mt-3 text-xs text-muted font-mono uppercase tracking-wide">
              VP, Growth &amp; Strategy · North American energy company · anonymized under NDA
            </p>
          </div>

          {/* Proven, client-confirmed figures only (lib/site.ts PROOF). Not a Sacramento
              small business. TODO(tyler): swap in a Sacramento small-business story when one exists. */}
          <div className="card p-5 sm:p-6">
            <p className="eyebrow mb-3">Real results from a current engagement</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-mono text-muted uppercase mb-1">Before</p>
                <p className="text-sm text-ink/80 leading-relaxed">
                  A quarterly board deck took about 12 hours by hand. Every update and email was typed out.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono text-muted uppercase mb-1">After</p>
                <p className="text-sm text-ink/80 leading-relaxed">
                  A reusable Skill builds the deck in about 3 hours. Updates are dictated.
                </p>
              </div>
            </div>
            <p className="text-2xl font-black text-accent">
              {PROOF.hoursPerWeek} hrs/week back · {PROOF.dollarsPerYear}/yr
            </p>
            <p className="mt-1 text-xs text-muted">Confirmed by the client, valued at $100/hr.</p>
            <p className="mt-3 text-xs text-muted font-mono uppercase tracking-wide">{PROOF.label}</p>
          </div>
        </div>

        {/* Bridge to the paid offer */}
        <p className="mt-8 text-lg sm:text-xl text-muted font-light leading-relaxed max-w-2xl">
          That&apos;s how we work: build one system once and let it carry the load.
          Ready for the full hour? The{" "}
          <strong className="font-semibold text-ink">AI Leverage Assessment</strong>{" "}
          is $997 for the owner. If we can&apos;t find 10× that in annual value, you get
          your money back.
        </p>
      </div>
    </section>
  );
}
