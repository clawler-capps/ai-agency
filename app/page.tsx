import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ServiceTiers from "@/components/ServiceTiers";
import BookingLink from "@/components/BookingLink";
import ChatWidget, { ChatLink } from "@/components/ChatWidget";
import Link from "next/link";
import Headshot from "@/components/Headshot";
import { BUILD_DAY_FORMAT, FOUNDER } from "@/lib/site";

// The page's one primary action, repeated: hero, end of The Problem, after the
// proof, and the final section. The call lives in the nav and the 10x section.
const SNAPSHOT_LABEL = "Get my free AI Snapshot →";

// ── Proof numbers (anonymized, from live engagements) ─────────────────────────
const proofStats = [
  {
    stat: "$14,400/yr",
    label: "median target per build",
    detail: "set in the Leverage Assessment, time valued at $100/hr",
  },
  {
    stat: "9–18 hrs/wk",
    label: "targeted per leader in live engagements",
    detail: "set by their AI Leverage Assessment, tracked on a scoreboard",
  },
  {
    stat: "12 hrs → 3 hrs",
    label: "a real board deck, first build",
    detail: "manual time is the client's estimate; now a reusable Skill rerun each quarter",
  },
];

// ── Snapshot block bullets (match what the live report shows) ─────────────────
const snapshotBullets = [
  "Your readiness score across 5 areas",
  "Your top 3 opportunities, with the dollars per year for each",
  "One prompt to try tonight",
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
    fix: "An AI agent that answers new leads in seconds, day or night.",
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
      "Law firms, CPAs, and agencies buried in repeat document work, intake forms, and manual billing.",
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
      "A serious operation with almost no tech infrastructure. More opportunity here than most consultants realize.",
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
      "Plenty of operating data already flowing from fleets, SCADA, ERP, and CRM, with no AI on top of it yet. That's the opportunity.",
    icon: "⚡",
  },
  {
    name: "Growth-Stage & Enterprise Teams",
    description:
      "A division or team already proving AI wins by hand and ready to make them standard, without a six-figure, year-long consulting project.",
    icon: "🏢",
  },
];

// ── Not for you if... ─────────────────────────────────────────────────────────
const notForYou = [
  "You want someone to disappear into a closet for six months and hand you a finished system.",
  "You're not willing to make small changes in how your team works to capture the wins.",
];

// ── Testimonials: real quotes, anonymized under NDA ───────────────────────────
// Role titles only, never names or the company. TODO(tyler): confirm each
// title + NDA-safe wording (working roles from the client files; official titles unconfirmed).
const testimonials = [
  {
    quote:
      "I couldn't have done this without these conversations. Never ever. I would still be banging around in the dark trying to find the lighter.",
    role: "Utility & Gas Markets lead",
    company: "25 years in the industry, North American energy company",
    story:
      "He started as the least AI-fluent person on a four-person team. Five sessions later he had built three reusable Skills and shipped his company's first AI-built work product, a board deck.",
  },
  {
    quote: "It was worth the money. Return on investment.",
    role: "VP, Growth & Strategy",
    company: "Publicly traded energy company",
    story: "",
  },
];

// A third role, as a before-and-after rather than a quote (no cleared quote yet).
// Facts from the client scoreboard (Aug 21, 2026); hours not yet validated, so none shown.
// TODO(tyler): confirm title + NDA-safe.
const beforeAfter = {
  role: "Strategic Development & Financial Modeling lead",
  company: "Same energy company, a different seat",
  before: "The only person who could run the company's data-center financial model, so pricing questions waited on him.",
  after: "Built a self-serve quick-quote pricing engine with Claude, now being rebuilt in Excel so every equation can be traced. Hours saved not confirmed yet.",
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "I'm not technical. Is this for me?",
    a: "Yes. The interview is a conversation about how your business works. You don't need to know what an API is.",
  },
  {
    q: "I'm brand new to AI. Will I be lost?",
    a: "No. We start from zero and only recommend tools you can actually use. Most clients find a quick win they can run themselves the same week.",
  },
  {
    q: "How long does it take?",
    a: "The AI Leverage Assessment is a one-hour interview per person, with your Leverage Map delivered within days. Coaching runs weekly, and most people ship their first real build within the first few sessions.",
  },
  {
    q: "What kinds of businesses do you work with?",
    a: "Owner-operated and mid-market businesses in the Sacramento region (construction, real estate, professional services, healthcare, agriculture, and franchises), plus divisions of mid-size and enterprise companies (energy, logistics, industrials) with real operating data flowing and no AI capability on top of it yet. If your team is doing repetitive manual work, you're a fit.",
  },
  {
    q: "What if I don't implement anything after the assessment?",
    a: "The plan is yours regardless. Every play includes a Claude-native path you can run on tools you already have, often at $0 in added tool cost, and the plan ends with concrete start-Monday steps.",
  },
  {
    q: "How do I know it's actually working?",
    a: "We write down what each fix should save you, then check the real number after it's built. The assessment sets a target in hours per week, and a build only counts once you confirm the hours it saves in practice.",
  },
  {
    q: "What about patient or client data?",
    a: "For clinics, law firms, CPAs, and insurance offices: we start with work that needs no sensitive data at all, like scheduling, intake forms, follow-ups, and reports from numbers you already strip of names. When a build does touch patient or client records, it runs inside your own accounts, and a person checks anything before it goes out. If your practice needs a Business Associate Agreement, ask us before we start. Full details are on our Trust page.",
    link: { href: "/trust", label: "Read how we handle data →" },
  },
  {
    q: "We're a public company. How do you handle data, security, and compliance?",
    a: "Your data stays in your accounts, and a human checks anything before it goes to a client. Everything is built under your access controls and approved tools, so nothing leaves your systems. NDAs are standard, and embedded engagements include a written governance framework for your division as a named deliverable.",
  },
  {
    q: "Do you run on-site events?",
    a: `Yes. The AI Build Day is ${BUILD_DAY_FORMAT} where every person on your team ships a real tool for their own real problem, with your own people (the ones we trained first) coaching alongside me. Every tool leaves as a saved, reusable recipe your team keeps using.`,
  },
];

export default function HomePage() {
  return (
    <>
      <ChatWidget />
      <Hero />

      {/* Problem */}
      <section className="section-padding bg-ink text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 lg:mb-10">
            <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-3">
              The Problem
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance max-w-3xl">
              You&apos;re wearing every hat, and your team&apos;s buried in repetitive work
            </h2>
            <p className="mt-4 text-lg text-white/60 max-w-2xl leading-relaxed">
              You&apos;ve heard about AI. Maybe you&apos;ve dabbled with ChatGPT. But you don&apos;t
              have a system, and you don&apos;t have time for another 10-hour course.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-7 hover:border-white/20 transition-colors">
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

          {/* Snapshot CTA, first ask after the pain is named */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <p className="text-xl font-bold">See where your hours go this week.</p>
            <BookingLink
              location="problem-snapshot"
              label={SNAPSHOT_LABEL}
              href="/assessment"
              className="btn-primary w-full sm:w-auto text-base px-8 py-4"
            >
              {SNAPSHOT_LABEL}
            </BookingLink>
          </div>
        </div>
      </section>

      {/* Founder strip: the guide shows up early, right after the first Snapshot
          ask, in 2 lines (StoryBrand guide block: empathy, authority, plan pointer).
          The full bio lives on /about so it doesn't hold up the path to the Snapshot. */}
      <section id="about" className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-cream section-divider">
        <div className="max-w-4xl mx-auto flex items-center gap-5 sm:gap-6">
          <Headshot size={96} />
          <div>
            <p className="eyebrow mb-1">Who you&apos;re hiring</p>
            <p className="text-base sm:text-lg text-ink leading-relaxed">
              I&apos;m {FOUNDER.name}. I spent {FOUNDER.energyYears} years building the models energy
              companies use to decide where their money goes, after an MBA and an MS in
              engineering at MIT.
            </p>
            <p className="text-base sm:text-lg text-muted leading-relaxed">
              Now I find the busywork eating your week, hand it to AI, and coach your team to
              run it themselves.{" "}
              <Link href="/about" className="font-semibold text-ink underline underline-offset-4 hover:text-accent whitespace-nowrap">
                More about Tyler →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* How it works: the three-step plan, with the framework folded in */}
      <HowItWorks />

      {/* Proof: anonymized numbers from live engagements */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 lg:mb-10">
            <p className="eyebrow mb-3">Real Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight text-balance max-w-2xl">
              From live engagements
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl leading-relaxed">
              Targets are set in each Leverage Assessment. A build counts as realized only
              after the client confirms the hours.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proofStats.map((p, i) => (
              <div key={i} className="card-hover p-5 sm:p-7">
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
            publicly traded company, run under NDA, with a compliance review on
            everything executives see.{" "}
            <Link href="/case-study/energy" className="font-semibold text-ink underline underline-offset-4 hover:text-accent">
              Download the 2-page case summary →
            </Link>
          </p>
        </div>
      </section>

      {/* Social proof: real quotes, anonymized under NDA (next to the numbers) */}
      <section className="section-padding bg-ink text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 lg:mb-10">
            <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-3">
              Client Results
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">What clients say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-7">
                <p className="text-white/90 text-lg leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-sm font-semibold text-white">{t.role}</div>
                  <div className="text-xs text-white/50">{t.company}</div>
                </div>
                {t.story && <p className="mt-4 text-sm text-white/70 leading-relaxed">{t.story}</p>}
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-7">
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-4">Before and after</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-mono text-white/40 uppercase mb-1">Before</p>
                <p className="text-white/80 leading-relaxed">{beforeAfter.before}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-white/40 uppercase mb-1">After</p>
                <p className="text-white/80 leading-relaxed">{beforeAfter.after}</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="text-sm font-semibold text-white">{beforeAfter.role}</div>
              <div className="text-xs text-white/50">{beforeAfter.company}</div>
            </div>
          </div>
          <p className="mt-6 text-xs text-white/40 font-mono">
            REAL QUOTES FROM CURRENT ENGAGEMENTS · ANONYMIZED UNDER NDA
          </p>
        </div>
      </section>

      {/* Free AI Opportunity Snapshot block, right after the proof */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Free AI Opportunity Snapshot</p>
          <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight text-balance mb-5">
            How to find your top 3 AI time savers in 3 minutes, even if you&apos;ve never used AI
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-6">
            Answer a few quick questions about how your business runs. Your report builds
            on screen as soon as you finish, with the hours and dollars worked out for
            each one.
          </p>
          <ul className="space-y-2.5 mb-8">
            {snapshotBullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-ink/80">
                <span className="text-accent font-bold mt-0.5 shrink-0">✓</span>
                <span className="text-base sm:text-lg">{b}</span>
              </li>
            ))}
          </ul>
          <BookingLink
            location="home-snapshot"
            label={SNAPSHOT_LABEL}
            href="/assessment"
            className="btn-primary w-full sm:w-auto text-base px-8 py-4"
          >
            {SNAPSHOT_LABEL}
          </BookingLink>
          <p className="mt-3 text-xs text-muted">
            No email until your report is ready. Unsubscribe any time.
          </p>
        </div>
      </section>

      {/* Who this is built for */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 lg:mb-10">
            <p className="eyebrow mb-3">Who this is built for</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight text-balance max-w-3xl">
              We built this for owner-run businesses and the teams growing past them
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl leading-relaxed">
              Whether you run a small Sacramento business wearing every hat, or you lead a
              growth-stage division that&apos;s already proving AI wins by hand, the goal is
              practical wins you can use this month.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 lg:mb-10">
            {industries.map((ind, i) => (
              <div key={i} className="card-hover p-5 sm:p-6 group">
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

          <p className="-mt-2 mb-8 lg:mb-10 text-base">
            <Link href="/industries" className="font-semibold text-ink underline underline-offset-4 hover:text-accent">
              See what we&apos;d build for construction, professional services, healthcare, and multi-site operators →
            </Link>
          </p>

          {/* Not for you if... */}
          <div className="bg-ink text-white rounded-2xl p-6 sm:p-10">
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

          {/* Snapshot CTA, closes the gap before the service ladder */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <p className="text-xl font-bold text-ink">Sound like your business?</p>
            <BookingLink
              location="fit-snapshot"
              label={SNAPSHOT_LABEL}
              href="/assessment"
              className="btn-primary w-full sm:w-auto text-base px-8 py-4"
            >
              {SNAPSHOT_LABEL}
            </BookingLink>
          </div>
        </div>
      </section>

      <ServiceTiers rungs={["Assess", "Enable"]} />

      {/* The 10× Rule: the high-intent zone keeps the call */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-4">The 10× Rule</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight mb-5 text-balance">
            If we can&apos;t find 10× the fee, don&apos;t hire us
          </h2>
          <p className="text-lg text-muted mb-6 leading-relaxed">
            The AI Leverage Assessment exists to prove value before you commit to
            anything. After one hour of conversation, your Leverage Map shows the few
            places AI will make a real difference for your business, using an
            off-the-shelf tool, a custom build, or a Claude setup. It also shows where AI
            won&apos;t help. If the map
            doesn&apos;t identify at least 10× the $997 fee in annual value,{" "}
            <strong className="text-ink">you get your money back</strong>.
          </p>
          <p className="text-base text-ink font-semibold mb-8">
            Bill $200/hr? Eight hours back a week is about $77,000 a year, for a $997
            assessment.
          </p>
          <BookingLink
            location="ten-x"
            label="Book a free 15-min call →"
            className="btn-secondary text-base px-10 py-4 inline-flex"
          >
            Book a free 15-min call →
          </BookingLink>
          <p className="mt-4 text-xs text-muted font-mono">ONE HOUR · 10× IDENTIFIED OR YOUR MONEY BACK · MAP DELIVERED WITHIN DAYS</p>
          <p className="mt-5 text-sm">
            <BookingLink
              location="ten-x-snapshot"
              label="Not ready? Get the free Snapshot first →"
              href="/assessment"
              className="font-semibold text-ink underline underline-offset-4 hover:text-accent transition-colors"
            >
              Not ready? Get the free Snapshot first →
            </BookingLink>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 lg:mb-10">
            <p className="eyebrow mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
              Questions you might be asking
            </h2>
            <p className="mt-4 text-base text-ink">
              <ChatLink>Don&apos;t see your question? Ask our AI →</ChatLink>
            </p>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5">
                <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
                {"link" in faq && faq.link && (
                  <Link href={faq.link.href} className="mt-2 inline-block text-sm font-semibold text-ink underline underline-offset-4 hover:text-accent">
                    {faq.link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team rungs, below the fold for owner-run visitors (full ladder on /pricing) */}
      <ServiceTiers rungs={["Deploy", "Lead"]} variant="teams" />

      {/* Final CTA */}
      <section className="section-padding bg-ink text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-6">
            Free · 3 minutes · Report on screen
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-6 text-balance">
            Ready to find your first{" "}
            <span className="text-accent">AI quick win?</span>
          </h2>
          <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
            Start with the free AI Snapshot. Answer a few questions about your week and
            see your top 3 AI time savers, with dollars on each.
          </p>
          <BookingLink
            location="final-cta"
            label={SNAPSHOT_LABEL}
            href="/assessment"
            className="btn-primary text-base px-10 py-4 w-full sm:w-auto"
          >
            {SNAPSHOT_LABEL}
          </BookingLink>
          <p className="mt-5 text-sm">
            <BookingLink
              location="final-call"
              label="Or book a free 15-min call →"
              className="font-semibold text-white underline underline-offset-4 hover:text-accent transition-colors"
            >
              Or book a free 15-min call →
            </BookingLink>
          </p>
        </div>
      </section>
    </>
  );
}
