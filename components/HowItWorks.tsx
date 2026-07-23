const steps = [
  {
    step: "1",
    title: "Assess",
    description:
      "An AI Leverage Assessment: a one-hour workflow interview per person, then a plan ranking every play by leverage — with ROI math conservative enough to hold up in front of a CFO.",
    detail: "AI Leverage Plan · impact × effort map · two build paths per play",
    color: "text-green-DEFAULT border-green-border bg-green-light",
    labelColor: "text-green-DEFAULT",
  },
  {
    step: "2",
    title: "Enable",
    description:
      "1:1 coaching tracks turn your people into fluent AI operators — shipping real builds as they learn, so the wins are felt in week one, not quarter three.",
    detail: "Setup · Skills · Systems — outcome-based, not session-counted",
    color: "text-blue-DEFAULT border-blue-border bg-blue-light",
    labelColor: "text-blue-DEFAULT",
  },
  {
    step: "3",
    title: "Lead",
    description:
      "We stay embedded: rotating coaching seats, strategic builds, governance, and a scoreboard tracking realized hours against target — validated with you, not assumed.",
    detail: "rotating seats · build roadmap · leverage scoreboard",
    color: "text-accent border-accent/30 bg-accent/light",
    labelColor: "text-accent",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-cream section-divider">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="eyebrow mb-3">How It Works</p>
          <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight text-balance max-w-3xl">
            From &ldquo;I don&apos;t know where to start&rdquo; to a compounding system — one rung at a time
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl leading-relaxed">
            No technical background needed. We do the heavy lifting and hand you a
            dollar-quantified plan you can act on this week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="card-hover p-8 group">
              {/* Step badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-mono font-bold mb-6 ${s.color}`}>
                <span>{s.step}</span>
                <span className="font-sans font-semibold tracking-normal">{s.title}</span>
              </div>

              <p className="text-ink leading-relaxed mb-4">{s.description}</p>

              <p className={`text-xs font-mono leading-relaxed ${s.labelColor} opacity-70`}>
                {s.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 rounded-xl bg-ink/5 border border-border">
          <p className="text-sm text-muted leading-relaxed">
            <strong className="text-ink">Why people before systems?</strong>{" "}
            Adoption is the product. A dashboard nobody uses saves nobody time — so we
            create believers first with wins they feel this week, then point that energy
            at the shared systems that create structural advantage.
          </p>
        </div>
      </div>
    </section>
  );
}
