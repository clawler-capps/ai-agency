import Link from "next/link";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ServiceTiers from "@/components/ServiceTiers";

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

// ── Testimonials ───────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "The assessment found 3 automations that saved us 15 hours a week. We covered the cost of the report in the first month.",
    name: "Sarah M.",
    role: "Owner, Coastal Realty Group",
    initials: "SM",
  },
  {
    quote:
      "I had no idea where to start with AI. Tyler mapped out exactly what to do first — and the ROI numbers made it a no-brainer.",
    name: "James R.",
    role: "Founder, Ridgeline Contractors",
    initials: "JR",
  },
  {
    quote:
      "We were spending 20 hours a month on manual reporting. The dashboard automation Tyler recommended cut that to under 2.",
    name: "Priya K.",
    role: "VP Ops, TechBridge Consulting",
    initials: "PK",
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
    a: "The free assessment is 5 minutes. The paid interview is about one hour. Your custom report and personalized AI roadmap are delivered in 24–48 hours.",
  },
  {
    q: "What kinds of businesses do you work with?",
    a: "Owner-operated and mid-market businesses in the Sacramento region — construction, real estate, professional services, healthcare, agriculture, manufacturing, and franchises — plus growth-stage and enterprise teams that want to systematize AI wins they've already proven by hand. If your team is doing repetitive manual work, you're a fit.",
  },
  {
    q: "What if I don't implement anything after the assessment?",
    a: "The report is yours regardless. Most clients find at least one quick win they can do themselves the same week — often free.",
  },
  {
    q: "Is the $1,000 assessment refundable?",
    a: "If you don't find at least $1,000 in monthly value in the recommendations, we'll talk. The goal is a clear ROI, not just taking your money.",
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

      {/* Who this is built for */}
      <section className="section-padding bg-cream section-divider">
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

      {/* Assessment CTA */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-4">Free · 5 minutes · No account required</p>
          <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-5 text-balance">
            Find your biggest AI quick win in the next 5 minutes
          </h2>
          <p className="text-lg text-muted mb-10 leading-relaxed">
            Take the free 5-minute assessment. No tech knowledge needed. Get an instant
            snapshot of where AI can save your business the most time — with ballpark ROI numbers.
          </p>
          <Link href="/assessment" className="btn-primary text-base px-10 py-4 inline-flex">
            Take the Free 5-Min Assessment →
          </Link>
          <p className="mt-4 text-xs text-muted font-mono">FREE · NO ACCOUNT REQUIRED · RESULTS IN SECONDS</p>
        </div>
      </section>

      {/* Social proof — hidden until real customer testimonials are collected
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="eyebrow mb-3">Client Results</p>
            <h2 className="text-4xl font-black text-ink tracking-tight">What clients say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover p-7">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-accent text-sm">★</span>
                  ))}
                </div>
                <p className="text-ink/80 text-sm leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-accent/light border border-accent/30 flex items-center justify-center text-xs font-bold text-accent">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

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
            Your next 30 minutes could save you 8+ hours every week
          </p>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-6 text-balance">
            Ready to find your first{" "}
            <span className="text-accent">AI quick win?</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            Start with the free 5-min assessment, or book a 15-min intro call. No pitch,
            no pressure — just a conversation about where AI can move the needle for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assessment" className="btn-primary text-base px-10 py-4 w-full sm:w-auto">
              Take the Free 5-Min Assessment →
            </Link>
            <a
              href="https://calendly.com/tylercapps/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors w-full sm:w-auto text-base"
            >
              Book a 15-Min Call
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
