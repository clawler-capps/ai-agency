import BookingLink from "@/components/BookingLink";

const steps = [
  {
    step: "1",
    title: "Assess",
    name: "We find your leverage",
    description:
      "You walk us through your week — a conversation, not a technical audit. We find where AI saves you the most time.",
    outcome: "Your Leverage Map: a one-page ranked plan of what to automate first — and what each play is worth per year.",
    color: "text-green border-green-border bg-green-light",
    labelColor: "text-green",
  },
  {
    step: "2",
    title: "Enable",
    name: "We build it together",
    description:
      "In your own accounts — your data stays in your systems — you build tools you actually run, not demos you forget.",
    outcome: "You leave every session with something working.",
    color: "text-blue border-blue-border bg-blue-light",
    labelColor: "text-blue",
  },
  {
    step: "3",
    title: "Lead",
    name: "It compounds",
    description:
      "What you build keeps paying off — automatically, every week.",
    outcome: "It becomes how your whole team works.",
    color: "text-accent border-accent/30 bg-accent/light",
    labelColor: "text-accent",
  },
];

// Source → Skills → Systems, moved here from the old Framework section.
const layers = [
  {
    number: "S1",
    title: "Source",
    description:
      "Claude, the AI we build on, learns your business, so it stops giving generic answers and starts sounding like you.",
    color: "border-green-border bg-green-light",
    labelColor: "text-green",
  },
  {
    number: "S2",
    title: "Skills",
    description: "Your best work becomes reusable tools you call up in one click, any time.",
    color: "border-blue-border bg-blue-light",
    labelColor: "text-blue",
  },
  {
    number: "S3",
    title: "Systems",
    description: "The repetitive parts run on autopilot. The work happens without you.",
    color: "border-accent/30 bg-accent/light",
    labelColor: "text-accent",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-cream section-divider">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 lg:mb-10">
          <p className="eyebrow mb-3">Your journey, in three stages</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight text-balance max-w-3xl">
            From &ldquo;I don&apos;t know where to start&rdquo; to a compounding system
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl leading-relaxed">
            No technical background needed. We do the heavy lifting and hand you a
            plan with real dollar figures on every line — one you can act on this week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="card-hover p-6 sm:p-8 group">
              {/* Step badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-mono font-bold mb-6 ${s.color}`}>
                <span>{s.step}</span>
                <span className="font-sans font-semibold tracking-normal">{s.title}</span>
              </div>

              <h3 className="text-xl font-bold text-ink mb-3">{s.name}</h3>
              <p className="text-muted leading-relaxed mb-4">{s.description}</p>

              <p className={`text-sm font-semibold leading-relaxed ${s.labelColor}`}>
                → {s.outcome}
              </p>
            </div>
          ))}
        </div>

        {/* The framework (was its own section): what gets built along the way */}
        <div id="framework" className="mt-10 scroll-mt-24">
          <p className="font-mono text-xs tracking-widest uppercase text-muted mb-2">
            Our framework · From Tool to System
          </p>
          <p className="text-lg text-muted max-w-2xl leading-relaxed mb-5">
            Most people use AI like a vending machine: ask, get an answer, repeat. We help
            you build{" "}
            <strong className="text-ink">your own systems that handle the repetitive work for you</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {layers.map((layer) => (
              <div key={layer.number} className={`rounded-2xl border p-5 ${layer.color}`}>
                <div className={`text-xs font-mono font-bold mb-2 ${layer.labelColor}`}>
                  {layer.number} · {layer.title}
                </div>
                <p className="text-sm text-muted leading-relaxed">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Snapshot CTA after the plan */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <p className="text-xl font-bold text-ink">Not sure where to start?</p>
          <BookingLink
            location="plan-snapshot"
            label="Get my free AI Snapshot →"
            href="/assessment"
            className="btn-primary w-full sm:w-auto text-base px-8 py-4"
          >
            Get my free AI Snapshot →
          </BookingLink>
        </div>
      </div>
    </section>
  );
}
