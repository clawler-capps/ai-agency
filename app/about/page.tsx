import type { Metadata } from "next";
import Link from "next/link";
import BookingLink from "@/components/BookingLink";
import Headshot from "@/components/Headshot";
import { FOUNDER, PROOF } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Tyler Capps and Sacramento AI Agency",
  description:
    "Tyler Capps is an MIT-trained engineer and energy economist in Sacramento. He helps owners and teams hand repetitive work to AI and coaches their people to run it.",
};

// Facts only. Sources: Tyler's resume (AI-OS/personal/resume/Tyler-Capps-Resume.md) and
// his own spoken bio in the Aug 14 and Aug 18, 2026 Certarus pitch transcripts.
// Employer names are left out on purpose (one is his current day job).
// TODO(tyler): add interests outside work if you want them here.

const career = [
  {
    what: "Mechanical engineer",
    detail:
      "Took wireless torque sensors from proposal to shipment on more than 10 projects, including sensors for Formula One race cars and parts used on Patriot missiles. Built the manufacturing and shipping schedules that cut missed ship dates in half.",
  },
  {
    what: "MIT, Leaders for Global Operations fellow",
    detail:
      "MBA from MIT Sloan and an MS in mechanical engineering, finished together in 2017, with a focus on energy and sustainability. Before that, a BS in mechanical engineering from UC San Diego, magna cum laude.",
  },
  {
    what: "Energy economist and modeler",
    detail:
      "About 10 years of forecasts and cost-benefit studies for utilities and regulators across the U.S. and Canada. Lead modeler on efficiency and distributed-energy studies, promoted to associate director, and an expert witness in utility regulatory proceedings.",
  },
  {
    what: "Software product lead",
    detail:
      "Ran product, contracts, and delivery for an energy-analytics software tool, moving Excel-based models into web software that utilities license.",
  },
  {
    what: "Startup co-founder",
    detail:
      "Co-founded a career-coaching startup. Built a five-factor personality model in Python and R, ran the customer research, and led fundraising.",
  },
];

const skills = [
  "Economic and financial modeling",
  "Cost-benefit analysis",
  "Forecasting",
  "Python and R",
  "Excel model design",
  "Building with Claude: Projects, Skills, scheduled tasks",
  "Expert testimony and presenting to non-technical leaders",
  "Product development",
];

const howWeWork = [
  {
    title: "Start with your week",
    body: "Every engagement starts with the AI Leverage Assessment: a one-hour conversation about how you work, then a ranked plan with hours and dollars on each item.",
  },
  {
    title: "Your people build it",
    body: "I coach your team on their own real work. Anything done more than once becomes a reusable Skill in your accounts, so it stays when I leave.",
  },
  {
    title: "We keep score",
    body: "Each fix gets a target in hours per week. It only counts as saved once you confirm the hours in real use.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20 bg-paper">
      <section className="section-padding bg-paper border-b border-border">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[16rem_minmax(0,1fr)] gap-8 md:gap-12 items-start">
          <Headshot size={256} portrait priority className="w-full max-w-[16rem] h-auto" />
          <div>
            <p className="eyebrow mb-4">About</p>
            <h1 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-6">
              Hi, I&apos;m {FOUNDER.name}
            </h1>
            <div className="space-y-4 text-lg text-muted leading-relaxed">
              <p>
                I&apos;m an engineer and energy economist based in Sacramento. I started out
                designing sensors for race cars and missiles, then spent {FOUNDER.energyYears} years
                building the models utilities use to decide where hundreds of millions of
                dollars go.
              </p>
              <p>
                I look at problems through a technical lens, and I like giving people their
                time back. Sacramento AI Agency is how I do that for owners and teams: find
                the work that eats your week, hand it to AI, and coach your people to run it.
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <BookingLink location="about-snapshot" label="Get my free AI Snapshot →" href="/assessment" className="btn-primary px-6 py-3">
                Get my free AI Snapshot →
              </BookingLink>
              <BookingLink location="about-call" label="Book a free 15-min call" className="btn-secondary px-6 py-3">
                Book a free 15-min call
              </BookingLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream section-divider">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-3">Background</p>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-6">Career</h2>
          <ol className="space-y-5">
            {career.map((c) => (
              <li key={c.what} className="card p-5 sm:p-6">
                <p className="font-bold text-ink mb-1">{c.what}</p>
                <p className="text-sm sm:text-base text-ink/80 leading-relaxed">{c.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-padding bg-paper section-divider">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-6">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <li key={s} className="px-3 py-1.5 rounded-lg border border-border bg-cream text-sm text-ink">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-cream section-divider">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-3">The company</p>
          <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight mb-4">Sacramento AI Agency</h2>
          <p className="text-muted leading-relaxed mb-6 max-w-2xl">
            A one-person AI consultancy in Sacramento. I work with owner-run businesses and
            with teams inside larger companies, remotely across the U.S. and Canada and in
            person around Sacramento.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {howWeWork.map((h) => (
              <div key={h.title} className="card p-5 bg-paper">
                <p className="font-bold text-ink mb-2">{h.title}</p>
                <p className="text-sm text-ink/80 leading-relaxed">{h.body}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-ink text-white p-6 sm:p-8">
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-2">A current engagement</p>
            <p className="text-white/80 leading-relaxed">
              At a North American energy company, two of the people I coached now get{" "}
              <strong className="text-white">{PROOF.hoursPerWeek} hours a week</strong> back, confirmed by
              the client: about <strong className="text-white">{PROOF.dollarsPerYear} a year</strong> at
              $100/hr. One of them went from the least AI-fluent person on his team to shipping
              the company&apos;s first AI-built board deck.
            </p>
            <Link href="/case-study/energy" className="mt-4 inline-block text-sm font-semibold text-white underline underline-offset-4 hover:text-accent">
              Read the 2-page case summary →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-ink tracking-tight mb-4">Start with your own numbers</h2>
          <p className="text-muted mb-8 leading-relaxed">
            The free Snapshot takes about 3 minutes and shows your top 3 AI time savers, with
            dollars on each. Or book a 15-minute call and talk it through with me.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BookingLink location="about-final-snapshot" label="Get my free AI Snapshot →" href="/assessment" className="btn-primary px-8 py-4">
              Get my free AI Snapshot →
            </BookingLink>
            <BookingLink location="about-final-call" label="Book a free 15-min call" className="btn-secondary px-8 py-4">
              Book a free 15-min call
            </BookingLink>
          </div>
        </div>
      </section>
    </div>
  );
}
