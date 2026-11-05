import type { Metadata } from "next";
import BookingLink from "@/components/BookingLink";
import { PROOF } from "@/lib/site";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Case summary: an energy-company AI engagement — Sacramento AI Agency",
  description:
    "Two-page case summary of an embedded AI engagement with a North American energy company: the approach, the scoreboard, and the hours realized.",
};

// Proven figures only, from the client's leverage scoreboard (see lib/site.ts PROOF
// for the source file and which rows count). TODO(tyler): confirm NDA-safe wording,
// and update PROOF when more builds are validated.
const headline = [
  { stat: `${PROOF.hoursPerWeek} hrs/wk`, label: "back each week, confirmed by the client" },
  { stat: PROOF.dollarsPerYear, label: "a year in reclaimed time, at $100/hr" },
  { stat: "2", label: "people coached to a confirmed win so far" },
  { stat: "12 → 3 hrs", label: "a board deck, the company's first AI-built work product" },
];

const people = [
  {
    role: "VP, Growth & Strategy",
    before: "Writing every update and email by hand between back-to-back calls.",
    after: "Dictating daily with a voice tool: 2 hrs/week back, confirmed. Then sponsoring the rollout to the team.",
  },
  {
    role: "Utility & Gas Markets lead, 25 years in the industry",
    before: "Assessed as the least AI-fluent person on the team.",
    after: "Built three reusable Skills and shipped the company's first AI-built board deck (about 12 hours down to 3), plus a live dashboard that flagged expired contracts on its first load.",
  },
  {
    role: "Strategic Development & Financial Modeling lead",
    before: "The only person who could run the company's data-center financial model.",
    after: "Built a self-serve quick-quote pricing engine with Claude, now being rebuilt in Excel so every equation can be traced. Hours not confirmed yet.",
  },
];

const page = "mx-auto max-w-[8.5in] bg-white text-ink shadow-sm print:shadow-none border border-border print:border-0 rounded-2xl print:rounded-none p-8 sm:p-12 print:p-[0.6in]";

export default function EnergyCaseSummary() {
  return (
    <div className="pt-20 print:pt-0 bg-paper print:bg-white">
      <div className="max-w-[8.5in] mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-sm text-muted">Two pages · prints to PDF from your browser</p>
        <PrintButton />
      </div>

      {/* Page 1 */}
      <article className={`${page} mb-8 print:mb-0 break-after-page`}>
        <p className="eyebrow mb-2">Case summary · anonymized under NDA</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          Embedded AI coaching for a North American energy company
        </h1>
        <p className="text-muted mb-1">
          A division of a publicly traded energy company. Leaders in Growth &amp; Strategy,
          coached one-on-one, with every win checked on a shared scoreboard.
        </p>
        <p className="text-xs font-mono text-muted mb-6">
          {PROOF.label.toUpperCase()} · FIGURES AS OF {PROOF.asOf.toUpperCase()}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {headline.map((h) => (
            <div key={h.label} className="rounded-xl border border-border p-4">
              <p className="text-2xl font-black text-accent">{h.stat}</p>
              <p className="text-sm text-ink/80 leading-snug">{h.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold mb-2">The situation</h2>
        <p className="text-sm text-ink/80 leading-relaxed mb-5">
          Rich operating data and a modern stack, but no AI layer on top. A few people
          used chat tools to clean up emails; nobody had built anything that ran on its
          own. Leadership wanted proof before a wider rollout, and every output had to
          pass a human accuracy and compliance check.
        </p>

        <h2 className="text-lg font-bold mb-2">What we did</h2>
        <ol className="text-sm text-ink/80 leading-relaxed space-y-2 list-decimal pl-5 mb-5">
          <li><strong>AI Leverage Assessment for each leader.</strong> A one-hour interview each, then a ranked map of where their hours go and what AI could take off the list, with an hours-per-week target on every item.</li>
          <li><strong>One-on-one coaching on their own work.</strong> Each person built against their real weekly tasks, not exercises. Work done more than once became a reusable Skill.</li>
          <li><strong>A shared scoreboard.</strong> Targets from the Assessments sit next to realized hours. A build only counts once the person confirms the hours it saves in practice.</li>
        </ol>

        <h2 className="text-lg font-bold mb-2">How the hours are counted</h2>
        <p className="text-sm text-ink/80 leading-relaxed">
          Hours only count once the person confirms them against real use. Builds that are
          finished but not yet confirmed, and builds still in progress, are left out of the
          figures above.
        </p>
      </article>

      {/* Page 2 */}
      <article className={`${page} mb-10 print:mb-0`}>
        <h2 className="text-lg font-bold mb-4">Three seats, before and after</h2>
        <div className="space-y-4 mb-8">
          {people.map((p) => (
            <div key={p.role} className="rounded-xl border border-border p-4">
              <p className="font-bold mb-2">{p.role}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-3 text-sm">
                <p><span className="block text-xs font-mono text-muted uppercase">Before</span>{p.before}</p>
                <p><span className="block text-xs font-mono text-muted uppercase">After</span>{p.after}</p>
              </div>
            </div>
          ))}
        </div>
        {/* TODO(tyler): confirm each title + NDA-safe (roles from the client files). */}
        <p className="text-xs text-muted mb-6">Roles shown instead of names.</p>

        <blockquote className="border-l-4 border-accent/40 pl-4 mb-8">
          <p className="italic text-ink/80 leading-relaxed">
            &ldquo;I couldn&apos;t have done this without these conversations. Never ever. I would
            still be banging around in the dark trying to find the lighter.&rdquo;
          </p>
          <footer className="mt-2 text-xs font-mono text-muted uppercase">Utility &amp; Gas Markets lead</footer>
        </blockquote>

        <h2 className="text-lg font-bold mb-2">What carried over to the rest of the company</h2>
        <ul className="text-sm text-ink/80 leading-relaxed list-disc pl-5 space-y-1 mb-8">
          <li>Two internal tools were reused outside their intended audience within weeks, including a report format another team adopted.</li>
          <li>A market-finding model was presented to the leadership team and moved to a paid build.</li>
          <li>Every tool lives in the company&apos;s own accounts as a reusable Skill, so it stays when we leave.</li>
        </ul>

        <div className="rounded-xl bg-paper print:bg-white border border-border p-5">
          <p className="font-bold mb-1">Run the same play on your team</p>
          <p className="text-sm text-ink/80 mb-3">
            Start with a $997 AI Leverage Assessment, or a free 15-minute call.
            sacramentoaiagency.com · tyler@sacramentoaiagency.com
          </p>
          <BookingLink location="case-summary-call" label="Book a free 15-min call →" className="btn-primary px-6 py-3 print:hidden">
            Book a free 15-min call →
          </BookingLink>
        </div>
      </article>
    </div>
  );
}
