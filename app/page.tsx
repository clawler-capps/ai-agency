import Link from "next/link";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Framework from "@/components/Framework";
import ServiceTiers from "@/components/ServiceTiers";
import { BOOKING_URL } from "@/lib/booking";

// ── Proof numbers (anonymized, from live engagements) ─────────────────────────
const proofStats = [
  {
    stat: "$14,400/yr",
    label: "median value per coached build",
    detail: "in reclaimed time, priced at a conservative $100/hr",
  },
  {
    stat: "9–18 hrs/wk",
    label: "targeted per leader in live engagements",
    detail: "set by their AI Leverage Assessment, tracked on a scoreboard",
  },
  {
    stat: "12 hrs → 3 hrs",
    label: "a real board deck, first build",
    detail: "then ~1 hour every quarter as a reusable Skill — in perpetuity",
  },
];

// ── Problem data ──────────────────────────────────────────────────────────────
const problems = [
  {
    icon: "📋",
    title: "Manual reporting eats your Mondays",
    description:
      "You copy-paste from 4 systems into a spreadsheet every week. 2–3 hours gone before the week even starts.",
    fix: "Automated dashboard that pulls every source in real time.",
  },
  {
    icon: "🚨",
    title: "Leads go cold overnight",
    description:
      "A new lead comes in at 9pm and nobody responds until morning. Top performers respond in under 2 minutes.",
    fix: "Speed-to-lead AI agent — responds in seconds, 24/7.",
  },
  {
    icon: "🌀",
    title: "Action items die in inboxes",
    description:
      "Hours of meetings with no record of what was decided or who owns what. Decisions evaporate by Friday.",
    fix: "Auto-transcribe, summarize, and assign action items.",
  },
];

// ── Industries / Ideal Client ─────────────────────────────────────────────────
const industries = [
  {
    name: "Construction & Trades",
    description:
      "Estimating by hand, losing track of job status across crews, drowning in emails that should be systems.",
    icon: "🏗️",
  },
  {
    name: "Real Estate Brokerages",
    description:
      "Leads slipping through, a CRM nobody actually uses, monthly marketing reports you still compile yourself.",
    icon: "🏘️",
  },
  {
    name: "Professional Services",
    description:
      "Law firms, CPAs, agencies — buried in repetitive document work, intake forms, and manual billing.",
    icon: "⚖️",
  },
  {
    name: "Healthcare Practices",
    description:
      "Admin overhead eating your margin. Scheduling gaps and patient communication still done by hand.",
    icon: "🏥",
  },
  {
    name: "Agriculture & Ranching",
    description:
      "A serious operation with almost no tech infrastructure. More leverage here than most consultants realize.",
    icon: "🌾",
  },
  {
    name: "Franchise Groups",
    description:
      "Scaling across locations but every unit runs differently. Inconsistent process is the hidden tax on growth.",
    icon: "🔗",
  },
  {
    name: "Manufacturing",
    description:
      "Legacy systems, manual inventory tracking, zero real-time visibility into operations.",
    icon: "⚙️",
  },
  {
    name: "Energy, Logistics & Industrials",
    description:
      "Rich operating data already flowing — fleets, SCADA, ERP, CRM — and no AI layer on top. The plumbing is ahead of the usage. That's the opportunity, not a gap.",
    icon: "⚡",
  },
  {
    name: "Growth-Stage & Enterprise Teams",
    description:
      "A division or team already proving AI wins by hand and ready to systematize them — without a six-figure, year-long transformation engagement.",
    icon: "🏢",
  },
];

// ── Not for you if... ─────────────────────────────────────────────────────────
const notForYou = [
  "You want someone to disappear into a closet for six months and hand you a finished system.",
  "You're not willing to make small changes in how your team works to capture the wins.",
];

// ── Testimonials — real quotes, anonymized under NDA ──────────────────────────
const testimonials = [
  {
    quote: "It was worth the money. Return on investment.",
    role: "Growth & Strategy executive",
    company: "Publicly traded energy company",
  },
  {
    quote:
      "The board deck that would have taken me days took about three hours — and it looked better than what I'd have done by hand. Honestly, I would have stopped at 'good enough.' Now it's a reusable Skill: one prompt, every quarter.",
    role: "Gas & utility markets lead",
    company: "Publicly traded energy company",
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "I'm not technical — is this for me?",
    a: "Yes. The interview is a conversation about how your business works, not a technical audit. You don't need to know what an API is.",
  },
  {
    q: "I'm brand new to AI. Will I be lost?",
    a: "No. We start from zero and only recommend tools you can actually use. Most clients find a quick win they can run themselves the same week.",
  },
  {
    q: "How long does it take?",
    a: "The AI Leverage Assessment is a one-hour interview per person, with your Leverage Map delivered within days. Coaching runs weekly — most people ship their first real build inside the first few sessions.",
  },
  {
    q: "What kinds of businesses do you work with?",
    a: "Owner-operated and mid-market businesses in the Sacramento region — construction, real estate, professional services, healthcare, agriculture, and franchises — plus divisions of mid-size and enterprise companies (energy, logistics, industrials) with real operating data flowing and no AI capability on top of it yet. If your team is doing repetitive manual work, you're a fit.",
  },
  {
    q: "What if I don't implement anything after the assessment?",
    a: "The plan is yours regardless. Every play includes a Claude-native path you can run on tools you already have — often at $0 in added tool cost — and the plan ends with concrete start-Monday steps.",
  },
  {
    q: "How do I know it's actually working?",
    a: "Every engagement runs against a leverage scoreboard. The assessment sets a target in hours per week; a build only counts as realized once you confirm the real hours it saves in practice. Proven, not promised.",
  },
  {
    q: "We're a public company — how do you handle data, security, and compliance?",
    a: "Everything is built in your accounts, under your access controls and approved tools — nothing leaves your systems. Client- and executive-facing outputs pass a human accuracy and compliance review before they ship. NDAs are standard, and for embedded engagements a governance framework for your division is a named deliverable, not a promise.",
  },
  {
    q: "Do you run on-site events?",
    a: "Yes — the AI Build Day: one afternoon where every person on your team ships a real tool against their own real problem, with your own coached champions working the floor. Every tool leaves as a reusable Skill, not a demo that dies in two weeks.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Problem */}
      <section className="section-padding bg-ink text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-3">
              The Problem
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-balance max-w-3xl">
              You&apos;re wearing every hat — and your team&apos;s buried in repetitive work
            </h2>
            <p className="mt-4 text-lg text-white/60 max-w-2xl leading-relaxed">
              You&apos;ve heard about AI. Maybe you&apos;ve dabbled with ChatGPT. But you don&apos;t
              have a system, and you don&apos;t have time for another 10-hour course.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-white/20 transition-colors">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold mb-3">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{p.description}</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs font-mono text-accent">THE FIX →</p>
                  <p className="text-sm text-white/80 mt-1">{p.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <Framework />

      {/* Proof — anonymized numbers from live engagements */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="eyebrow mb-3">Real Numbers</p>
            <h2 className="text-4xl font-black text-ink tracking-tight text-balance max-w-2xl">
              From live engagements — measured, then validated with the client
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proofStats.map((p, i) => (
              <div key={i} className="card-hover p-7">
                <div className="text-3xl font-black text-accent mb-2">{p.stat}</div>
                <p className="font-semibold text-ink mb-2">{p.label}</p>
                <p className="text-sm text-muted leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted font-mono">
            FIGURES FROM CURRENT CLIENT SCOREBOARDS · TIME VALUED AT A CONSERVATIVE $100/HR
          </p>
          <p className="mt-3 text-sm text-muted max-w-2xl">
            Current engagements include an embedded partnership with a division of a
            publicly traded company — run under NDA, with a compliance review gate on
            executive-facing outputs.
          </p>
        </div>
      </section>

      {/* Who this is built for */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="eyebrow mb-3">Who this is built for</p>
            <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight text-balance max-w-3xl">
              We built this for owner-operated businesses — and the teams scaling beyond them
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl leading-relaxed">
              Whether you run a small Sacramento business wearing every hat, or you lead a
              growth-stage division that&apos;s already proving AI wins by hand, the goal is the
              same: practical wins this month, not a year-long &ldquo;digital transformation.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {industries.map((ind, i) => (
              <div key={i} className="card-hover p-6 group">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">{ind.icon}</span>
                  <div>
                    <h3 className="font-bold text-ink mb-2">{ind.name}</h3>
                    <p className="text-sm text-muted leading-relaxed">{ind.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Not for you if... */}
          <div className="bg-ink text-white rounded-2xl p-8 sm:p-10">
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-3">
              Honest disclaimer
            </p>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-6 text-balance">
              This isn&apos;t for you if…
            </h3>
            <ul className="space-y-3">
              {notForYou.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80">
                  <span className="text-accent mt-1 shrink-0">✕</span>
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/50 italic">
              We&apos;d rather tell you up front than waste an hour on a call.
            </p>
          </div>
        </div>
      </section>

      <ServiceTiers />

      {/* The 10× Rule — assessment CTA */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-4">The 10× Rule</p>
          <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-5 text-balance">
            If we can&apos;t find 10× the fee, don&apos;t hire us
          </h2>
          <p className="text-lg text-muted mb-10 leading-relaxed">
            The AI Leverage Assessment exists to prove value before you commit to
            anything. One hour of conversation, and your Leverage Map shows where AI has
            the highest leverage to save you time and make you money — whether that&apos;s
            an off-the-shelf tool, a custom build, or a Claude-native system. If the map
            doesn&apos;t identify at least 10× the $997 fee in annual value,{" "}
            <strong className="text-ink">you get your money back</strong>.
          </p>
          <p className="text-base text-ink font-semibold mb-10">
            Bill $200/hr? Eight hours back a week is ~$77,000 a year — against a $997
            assessment. That&apos;s the whole pitch.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-10 py-4 inline-flex"
          >
            Book Your Assessment — $997 →
          </a>
          <p className="mt-4 text-xs text-muted font-mono">ONE HOUR · 10× IDENTIFIED OR YOUR MONEY BACK · MAP DELIVERED WITHIN DAYS</p>
        </div>
      </section>

      {/* Social proof — real quotes, anonymized under NDA */}
      <section className="section-padding bg-ink text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-3">
              Client Results
            </p>
            <h2 className="text-4xl font-black tracking-tight">What clients say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-7">
                <p className="text-white/90 text-lg leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-sm font-semibold text-white">{t.role}</div>
                  <div className="text-xs text-white/50">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/40 font-mono">
            REAL QUOTES FROM CURRENT ENGAGEMENTS · ANONYMIZED UNDER NDA
          </p>
        </div>
      </section>

      {/* Who you're hiring */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Who you&apos;re hiring</p>
          <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-5">
            One senior operator — not a bench of juniors billed at partner rates
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            Sacramento AI Agency is Tyler Capps. The model is deliberately built so your
            own people become the delivery team — champions get coached, tools ship as
            reusable Skills in your accounts, and the scoreboard stays with you. That&apos;s
            why the capability survives the engagement instead of walking out the door
            with the consultant.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="eyebrow mb-3">FAQ</p>
            <h2 className="text-4xl font-black text-ink tracking-tight">
              Questions you might be asking
            </h2>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6">
                <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-ink text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-6">
            Your next 15 minutes could save you 8+ hours every week
          </p>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-6 text-balance">
            Ready to find your first{" "}
            <span className="text-accent">AI quick win?</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            Reach out and we&apos;ll set up a 15-minute intro call. No pitch, no pressure —
            just a conversation about where AI can move the needle for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-10 py-4 w-full sm:w-auto"
            >
              Book a 15-Min Call →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
