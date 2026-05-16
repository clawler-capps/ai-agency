const steps = [
  {
    step: "A",
    title: "Audit",
    description:
      "A 20–30 minute conversation about your business, tools, and daily pain points. No tech knowledge needed — you just talk, we listen.",
    detail: "Zoom or AI voice agent interview → transcript fed to Claude",
    color: "text-green-DEFAULT border-green-border bg-green-light",
    labelColor: "text-green-DEFAULT",
  },
  {
    step: "O",
    title: "Optimize",
    description:
      "We analyze the transcript and build your custom AI assessment with ROI numbers — before recommending any tools. Fix the process first.",
    detail: "Claude-generated Gamma report · Effort/Impact matrix · ROI summary",
    color: "text-blue-DEFAULT border-blue-border bg-blue-light",
    labelColor: "text-blue-DEFAULT",
  },
  {
    step: "A",
    title: "Automate",
    description:
      "You get a prioritized action plan — from quick wins you can run this week to complex automations we build alongside you.",
    detail: "4-Day Quick Start · tool config · process documentation",
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
            From &ldquo;I don&apos;t know where to start&rdquo; to a clear AI roadmap — in 3 simple steps
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
            <strong className="text-ink">Why optimize before automating?</strong>{" "}
            If a task takes 15 steps but should take 7, automating the current process
            just speeds up the inefficiency. We redesign first, then automate.
          </p>
        </div>
      </div>
    </section>
  );
}
