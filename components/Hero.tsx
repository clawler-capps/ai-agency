import BookingLink from "@/components/BookingLink";
import { ChatLink } from "@/components/ChatWidget";
import Headshot from "@/components/Headshot";
import Todo from "@/components/Todo";
import { FOUNDER } from "@/lib/site";

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
            <p className="mt-4 text-sm text-ink">
              <ChatLink>Questions first? Ask our AI →</ChatLink>
            </p>
          </div>

          {/* The founder, in the hero's right half */}
          <aside className="card p-5 sm:p-6 flex lg:flex-col items-center lg:items-start gap-5 bg-cream/90">
            <Headshot size={136} />
            <div>
              <p className="eyebrow mb-1">Who you&apos;ll work with</p>
              <p className="text-lg font-black text-ink">{FOUNDER.name}</p>
              <p className="text-sm text-muted leading-relaxed">
                {FOUNDER.credentials} · {FOUNDER.energyYears} years in energy
                {!FOUNDER.energyYearsConfirmed && <> <Todo>confirm years</Todo></>} · based in Sacramento
              </p>
              <a href="#about" className="mt-2 inline-block text-sm font-semibold text-ink underline underline-offset-4 hover:text-accent">
                More about Tyler →
              </a>
            </div>
          </aside>
        </div>

        {/* Two before-and-afters: an energy executive and a Sacramento small business */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border-l-4 border-accent/40 pl-5 py-1">
            <p className="text-base sm:text-lg text-ink/80 italic leading-relaxed">
              An executive walked into a high-stakes call planning to present the way
              he always had. At the last minute, he swapped in something built days
              before — an interactive dashboard instead of a deck. The room reacted
              like a different company had shown up. People started using the tool
              themselves, mid-call, to sell to their own side. His team didn&apos;t
              grow the output — the system did.
            </p>
            {/* TODO(tyler): confirm title + NDA-safe */}
            <p className="mt-3 text-xs text-muted font-mono uppercase tracking-wide">
              VP, Growth &amp; Strategy · North American energy company · anonymized under NDA
            </p>
          </div>

          {/* TODO(tyler): a real Sacramento client or pilot, with hours saved per week */}
          <div className="card p-5 sm:p-6 border-dashed border-amber-500">
            <p className="eyebrow mb-3">Sacramento small business · before and after</p>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs font-mono text-muted uppercase mb-1">Before</p>
                <p className="text-sm text-ink/80 leading-relaxed">
                  <Todo>the weekly chore, e.g. &ldquo;owner writes every estimate by hand at night&rdquo;</Todo>
                </p>
              </div>
              <div>
                <p className="text-xs font-mono text-muted uppercase mb-1">After</p>
                <p className="text-sm text-ink/80 leading-relaxed">
                  <Todo>what we built and how it runs now</Todo>
                </p>
              </div>
            </div>
            <p className="text-2xl font-black text-accent">
              <Todo>X hrs/week saved</Todo>
            </p>
            <p className="mt-2 text-xs text-muted font-mono uppercase tracking-wide">
              <Todo>type of business, e.g. ADU builder, 6 people · real client or pilot</Todo>
            </p>
          </div>
        </div>

        {/* Bridge to the paid offer */}
        <p className="mt-8 text-lg sm:text-xl text-muted font-light leading-relaxed max-w-2xl">
          One system, built once, instead of a new hire. That&apos;s the whole model.
          Ready for the full hour? The{" "}
          <strong className="font-semibold text-ink">AI Leverage Assessment</strong>{" "}
          is $997 for the owner. If we can&apos;t find 10× that in annual value, you get
          your money back.
        </p>
      </div>
    </section>
  );
}
