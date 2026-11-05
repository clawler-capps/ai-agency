import type { Metadata } from "next";
import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import { PROOF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries | Sacramento AI Agency",
  description:
    "What AI can take off your plate in construction and ADU building, law and CPA and insurance offices, healthcare practices, and multi-site operators.",
};

type Industry = {
  id: string;
  icon: string;
  name: string;
  who: string;
  problem: string;
  build: string[];
  // TODO(tyler): a real example (client or pilot) per industry. Left out of the
  // page until one exists; the role-based examples below stand in.
};

const industries: Industry[] = [
  {
    id: "construction",
    icon: "🏗️",
    name: "Construction & ADU builders",
    who: "General contractors, ADU and remodel builders, specialty trades",
    problem:
      "Estimates get written at night, change orders live in texts, and the owner is the only one who knows where every job stands. Leads wait days for a bid.",
    build: [
      "An estimate drafter that turns site notes and photos into a priced first draft in your format",
      "A weekly job-status summary pulled from your schedule, texts, and invoices",
      "Same-day follow-up on every new lead and every unanswered bid",
    ],
  },
  {
    id: "professional-services",
    icon: "⚖️",
    name: "Professional services: law, CPA, insurance",
    who: "Small law firms, CPA and bookkeeping practices, independent insurance agencies",
    problem:
      "Intake forms get retyped, the same client emails get written fifty times a season, and billable people spend hours on admin nobody bills for.",
    build: [
      "Intake that reads a client's documents and fills your checklist, with missing items flagged",
      "First drafts of routine letters, engagement emails, and renewal notices in your voice",
      "Meeting notes that turn into a task list and a client recap before you leave the room",
    ],
  },
  {
    id: "healthcare",
    icon: "🏥",
    name: "Healthcare practices",
    who: "Dental, chiropractic, physical therapy, med spa, and small medical practices",
    problem:
      "Front-desk staff juggle phones, reminders, and insurance questions. No-shows leave gaps, and reviews and recalls fall behind.",
    build: [
      "Reminder and recall messages that fill cancelled slots, with no patient records leaving your systems",
      "Answers to common front-desk questions (hours, prep, insurance accepted) by chat and text",
      "Monthly practice reports from your scheduling numbers, without names",
    ],
  },
  {
    id: "multi-site",
    icon: "🔗",
    name: "Multi-site operators",
    who: "Franchise groups, multi-location service businesses, property managers",
    problem:
      "Every location runs a little differently. Weekly numbers arrive late and in five formats, and the same question gets answered by every manager.",
    build: [
      "One weekly roll-up across locations, in the same format every time",
      "A shared playbook assistant so every manager gets the same answer to the same question",
      "Alerts when one location's numbers drift from the rest",
    ],
  },
];

const roleExamples = [
  {
    role: "Business development lead (utility & gas markets)",
    built: "A reusable Skill that turns his notes into the quarterly board deck, plus a live contract dashboard and a weekly-update Skill.",
    result: "Board deck: about 12 hours down to 3. 0.75 hrs/week confirmed ($3,600/yr).",
  },
  {
    role: "Strategy lead",
    built: "Daily dictation in place of typing for updates, emails, and notes.",
    result: "2 hrs/week confirmed ($9,600/yr).",
  },
  {
    role: "Finance / financial-modeling lead",
    built: "A self-serve quick-quote pricing engine for new projects, being rebuilt in Excel so every equation can be traced.",
    result: "In progress. Hours not confirmed yet.",
  },
];

export default function IndustriesPage() {
  return (
    <div className="pt-20 bg-paper">
      <section className="section-padding bg-paper border-b border-border">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-4">Industries</p>
          <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-6">
            What we&apos;d build for a business like yours
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            The problem and what we&apos;d build first, then{" "}
            <a href="#examples" className="font-semibold text-ink underline underline-offset-4 hover:text-accent">real examples by role</a>.
            Every build starts with the work you already do by hand.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2">
            {industries.map((ind) => (
              <a key={ind.id} href={`#${ind.id}`} className="px-3 py-1.5 rounded-lg border border-border bg-cream text-sm font-semibold text-ink hover:border-ink/30">
                {ind.icon} {ind.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {industries.map((ind, i) => (
        <section key={ind.id} id={ind.id} className={`section-padding section-divider scroll-mt-20 ${i % 2 ? "bg-paper" : "bg-cream"}`}>
          <div className="max-w-4xl mx-auto">
            <p className="eyebrow mb-3">{ind.who}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-6">
              <span className="mr-2">{ind.icon}</span>{ind.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card p-5">
                <p className="text-xs font-mono font-bold text-accent mb-2">THE PROBLEM</p>
                <p className="text-sm text-ink/80 leading-relaxed">{ind.problem}</p>
              </div>
              <div className="card p-5">
                <p className="text-xs font-mono font-bold text-accent mb-2">WHAT WE&apos;D BUILD</p>
                <ul className="space-y-2">
                  {ind.build.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-ink/80">
                      <span className="shrink-0">→</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {ind.id === "healthcare" || ind.id === "professional-services" ? (
              <p className="mt-4 text-sm text-muted">
                Worried about patient or client data?{" "}
                <Link href="/trust#data" className="font-semibold text-ink underline underline-offset-4 hover:text-accent">
                  See how we handle it →
                </Link>
              </p>
            ) : null}
          </div>
        </section>
      ))}

      {/* Role-based examples from the current engagement. Figures: lib/site.ts PROOF
          source (client scoreboard, Aug 21, 2026); only client-confirmed hours shown.
          TODO(tyler): confirm titles + NDA-safe. */}
      <section id="examples" className="section-padding bg-paper section-divider scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-3">North American energy company</p>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-3">
            Examples by role, from a current engagement
          </h2>
          <p className="text-muted mb-6">
            We don&apos;t have a finished example for every industry yet. These come from three
            seats at one company, and the same work shows up in most businesses.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roleExamples.map((r) => (
              <div key={r.role} className="card p-5">
                <p className="font-bold text-ink mb-2">{r.role}</p>
                <p className="text-sm text-ink/80 leading-relaxed mb-3">{r.built}</p>
                <p className="text-sm font-semibold text-accent">{r.result}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            Hours count only after the client confirms them, valued at $100/hr. As of {PROOF.asOf}.
          </p>
        </div>
      </section>

      <section className="section-padding bg-ink text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-tight mb-4">See your own top 3 in 3 minutes</h2>
          <p className="text-white/60 mb-8">The free Snapshot works for any of these, with dollars on each idea.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BookingLink location="industries-snapshot" label="Get my free AI Snapshot →" href="/assessment" className="btn-primary px-8 py-4">
              Get my free AI Snapshot →
            </BookingLink>
            <BookingLink location="industries-call" label="Book a free 15-min call" className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/5">
              Book a free 15-min call
            </BookingLink>
          </div>
        </div>
      </section>
    </div>
  );
}
