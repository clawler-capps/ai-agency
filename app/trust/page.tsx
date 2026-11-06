import type { Metadata } from "next";
import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import { FOUNDER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trust, Privacy & Terms | Sacramento AI Agency",
  description:
    "How Sacramento AI Agency handles your data and your clients' data: privacy policy, terms, HIPAA, and which AI vendors see what.",
};

// TODO(tyler): the privacy policy and terms have not had a legal review yet.
const LAST_UPDATED = "November 5, 2026";

// Which outside services see data, and what they see.
const vendors = [
  {
    name: "Anthropic (Claude)",
    sees: "Your Snapshot answers and, if you share it, your public website. In engagements, the documents you choose to share in your own Claude workspace.",
    why: "Writes your Snapshot and powers the tools we build. Business plans don't train on your data.",
  },
  {
    name: "GoHighLevel",
    sees: "Your name, email, company, and Snapshot results; chat messages; booked calls; and pages you visit on this site (its tracking script uses cookies).",
    why: "Our CRM, chat widget, and calendar.",
  },
  {
    name: "Resend",
    sees: "Your email address and the Snapshot report we send you.",
    why: "Delivers our emails.",
  },
  {
    name: "Google (Sheets)",
    sees: "Your Snapshot answers and which steps you finished, with no name or email attached.",
    why: "Where we keep anonymous answer statistics to improve the Snapshot.",
  },
  {
    name: "Vercel",
    sees: "Standard web traffic data (pages viewed, rough location, device). No cookies for analytics.",
    why: "Hosts this website and counts visits.",
  },
  // TODO(tyler): add Stripe ("payment details when you buy the Assessment") once the Payment Link is live.
];

// TODO(tyler): add back only once confirmed: "business AI plans only (no training on
// your data)" and "we delete any copies at the end of an engagement".
const dataRules = [
  "Your data stays in your accounts. We build inside the tools and logins you already control, and you can remove our access at any time.",
  "Start with no sensitive data. Most first builds (scheduling, intake, follow-ups, reports) work without patient or client records at all.",
  "A human checks before anything goes out. AI drafts; a person approves anything a client, patient, or regulator will see.",
  "NDAs are standard.",
];

export default function TrustPage() {
  return (
    <div className="pt-20 bg-paper">
      <section className="section-padding bg-paper border-b border-border">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-4">Trust</p>
          <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-6">
            How we handle your data
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Short version: your data stays in your accounts, we start with work that
            needs no sensitive data, and a human checks anything before it goes out. The
            details for clinics, law firms, CPAs, insurance offices, and public companies
            are below.
          </p>
          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            {[
              ["#data", "Client data"],
              ["#hipaa", "HIPAA"],
              ["#vendors", "AI vendors"],
              ["#privacy", "Privacy policy"],
              ["#terms", "Terms"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-ink underline underline-offset-4 hover:text-accent">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section id="data" className="section-padding bg-cream section-divider scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">How client data is handled</p>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-6">Four rules we work by</h2>
          <ul className="space-y-3">
            {dataRules.map((r) => (
              <li key={r} className="flex items-start gap-3 text-ink/80">
                <span className="text-accent font-bold mt-0.5 shrink-0">✓</span>
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="hipaa" className="section-padding bg-paper section-divider scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Healthcare practices</p>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-4">HIPAA</h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              We don&apos;t need patient records to find your best AI wins. The Assessment is
              a conversation about how your practice runs, and we ask you not to share
              protected health information (PHI) during it.
            </p>
            {/* TODO(tyler): confirm a BAA commitment and which AI tools are covered before
                promising more than this. */}
            <p>
              If your practice needs a Business Associate Agreement (BAA), ask us before we
              start. We&apos;ll talk through what the work involves and which tools would touch
              patient data, before anyone shares it.
            </p>
            <p>
              The free Snapshot on this site is not built for PHI. Please describe your work
              in general terms there, with no patient details.
            </p>
          </div>
        </div>
      </section>

      <section id="vendors" className="section-padding bg-cream section-divider scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-3">Which AI vendors see data</p>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-6">Every outside service, and what it sees</h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[560px] text-sm text-left border-separate border-spacing-0">
              <thead>
                <tr className="text-xs font-mono uppercase text-muted">
                  <th className="py-2 pr-4 border-b border-border">Service</th>
                  <th className="py-2 pr-4 border-b border-border">What it sees</th>
                  <th className="py-2 border-b border-border">Why we use it</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.name} className="align-top">
                    <td className="py-3 pr-4 border-b border-border font-semibold text-ink whitespace-nowrap">{v.name}</td>
                    <td className="py-3 pr-4 border-b border-border text-ink/80">{v.sees}</td>
                    <td className="py-3 border-b border-border text-muted">{v.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* TODO(tyler): confirm the full vendor list, e.g. any meeting-notes tool used on calls. */}
          <p className="mt-4 text-sm text-muted">
            In client engagements we use the AI tools you approve, in your accounts.
          </p>
        </div>
      </section>

      {/* Insurance section omitted until coverage is confirmed. TODO(tyler): carrier, E&O / cyber, limits. */}

      <section id="privacy" className="section-padding bg-cream section-divider scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Privacy policy</p>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-2">Privacy policy</h2>
          <p className="text-xs font-mono text-muted mb-6">
            LAST UPDATED {LAST_UPDATED.toUpperCase()}
          </p>
          <div className="space-y-5 text-sm text-ink/80 leading-relaxed">
            <div>
              <h3 className="font-bold text-ink mb-1">What we collect</h3>
              <p>
                What you give us: your name, email, company, and answers when you take the
                Snapshot, book a call, use the chat, or send the contact form. What your
                browser sends: pages viewed, device, and rough location. Vercel counts
                visits without cookies; our CRM&apos;s tracking script uses cookies so it can
                link your visits to a form you later send us.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-1">How we use it</h3>
              <p>
                To write and email your Snapshot, answer you, schedule calls, and run the
                work you hire us for. Your Snapshot answers are processed by AI (see the
                vendor table above). We keep anonymous answer statistics to improve the
                Snapshot. We send occasional tips only if you tick the box, and
                every email has an unsubscribe link.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-1">What we never do</h3>
              <p>We never sell your information or share it with advertisers.</p>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-1">Your choices</h3>
              <p>
                Email {FOUNDER.email} to see, correct, or delete what we hold about you,
                including requests under the California Consumer Privacy Act.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-1">How long we keep it</h3>
              <p>
                Snapshot and contact details stay in our CRM until you ask us to delete
                them. Client engagement data follows the rules in your agreement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="terms" className="section-padding bg-paper section-divider scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Terms</p>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-2">Terms of use</h2>
          <p className="text-xs font-mono text-muted mb-6">
            LAST UPDATED {LAST_UPDATED.toUpperCase()}
          </p>
          <div className="space-y-5 text-sm text-ink/80 leading-relaxed">
            <div>
              <h3 className="font-bold text-ink mb-1">The free Snapshot</h3>
              <p>
                The Snapshot is an automated estimate from your own answers. It&apos;s a
                starting point. It isn't professional, legal, or financial advice.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-1">The AI Leverage Assessment</h3>
              <p>
                $997 for the owner. If your Leverage Map doesn&apos;t identify at least 10× the
                fee in annual value, you get your money back, as described on our{" "}
                <Link href="/pricing#assess" className="underline underline-offset-2 hover:text-accent">pricing page</Link>.
                Full refund terms are in your engagement agreement.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-1">Paid engagements</h3>
              <p>
                Coaching, Build Days, and embedded work run under a written agreement that
                sets scope, fees, confidentiality, and data handling. If that agreement and
                these terms disagree, the agreement wins.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-1">What you own</h3>
              <p>
                The tools, Skills, and documents we build for you are yours, in your
                accounts.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-ink mb-1">Contact</h3>
              <p>
                Tyler Capps / Sacramento AI Agency, {FOUNDER.city}. {FOUNDER.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">Have a question about your data?</h2>
          <p className="text-white/60 mb-6">Ask on a free 15-minute call, or read the FAQ.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BookingLink location="trust" label="Book a free 15-min call →" className="btn-primary px-8 py-3">
              Book a free 15-min call →
            </BookingLink>
            <Link href="/#faq" className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/5">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
