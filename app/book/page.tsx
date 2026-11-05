import type { Metadata } from "next";
import Headshot from "@/components/Headshot";
import { BOOKING_EMBED_URL, BOOKING_URL } from "@/lib/booking";
import { ASSESSMENT_CHECKOUT_LIVE, FOUNDER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a free 15-minute call | Sacramento AI Agency",
  description: "Pick a time for a free 15-minute call with Tyler Capps. No pitch, just a look at where AI can save you time.",
};

const covers = [
  "Where your week goes, and the one or two tasks AI can take off it first",
  "Whether the $997 AI Leverage Assessment is worth it for you right now, honestly",
  "What a first build would cost and save, in plain numbers",
];

export default function BookPage({ searchParams }: { searchParams: { for?: string } }) {
  const forAssessment = searchParams.for === "assessment";
  return (
    <div className="pt-20 bg-paper">
      <section className="section-padding bg-paper">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[20rem_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
          <div>
            <p className="eyebrow mb-4">Free · 15 minutes · No pitch</p>
            <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-5">
              {forAssessment ? "Book your AI Leverage Assessment" : "Book a free 15-minute call"}
            </h1>
            {forAssessment && !ASSESSMENT_CHECKOUT_LIVE && (
              <p className="mb-5 text-sm text-ink/80 leading-relaxed">
                Pick a time below for your first call. We&apos;ll confirm the Assessment and
                how to pay on the call.
                {/* TODO(tyler): Stripe Payment Link (NEXT_PUBLIC_ASSESSMENT_CHECKOUT_URL) */}
              </p>
            )}
            <div className="flex items-center gap-4 mb-6">
              <Headshot size={88} priority />
              <div>
                <p className="font-bold text-ink">{FOUNDER.name}</p>
                <p className="text-sm text-muted">{FOUNDER.credentials} · {FOUNDER.city}</p>
              </div>
            </div>
            <p className="font-semibold text-ink mb-3">What the call covers</p>
            <ul className="space-y-2.5">
              {covers.map((c) => (
                <li key={c} className="flex items-start gap-3 text-ink/80">
                  <span className="text-accent font-bold mt-0.5 shrink-0">✓</span>
                  <span className="text-sm sm:text-base leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card overflow-hidden bg-cream min-h-[640px]">
            {BOOKING_EMBED_URL ? (
              <iframe
                src={BOOKING_EMBED_URL}
                width="100%"
                height="760"
                frameBorder="0"
                title="Schedule a call with Tyler Capps"
                className="block w-full"
              />
            ) : (
              <div className="p-8 text-center">
                <p className="text-ink font-semibold mb-3">The calendar isn&apos;t connected yet.</p>
                <a href={BOOKING_URL} className="btn-primary px-6 py-3">Email Tyler to pick a time →</a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
