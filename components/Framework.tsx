const layers = [
  {
    number: "S1",
    title: "Source",
    description:
      "Claude — the AI we build on, set up to know your business — learns your world, so it stops giving generic answers and starts sounding like you.",
    color: "border-green-border bg-green-light",
    labelColor: "text-green-DEFAULT",
  },
  {
    number: "S2",
    title: "Skills",
    description:
      "Your best work becomes reusable tools you call up in one click, any time.",
    color: "border-blue-border bg-blue-light",
    labelColor: "text-blue-DEFAULT",
  },
  {
    number: "S3",
    title: "Systems",
    description:
      "The repetitive parts run on autopilot — the work happens without you.",
    color: "border-accent/30 bg-accent/light",
    labelColor: "text-accent",
  },
];

const lanes = [
  {
    label: "Lane A — Individuals",
    body: "People gaining leverage inside their own workflows. The hard part is habit, not tech — so we start with wins they feel this week: a dashboard, a brief, a skill.",
    creates: "Creates believers.",
  },
  {
    label: "Lane B — Systems",
    body: "Shared, governed AI built into how the organization operates. One department, one real system, end-to-end — then the next.",
    creates: "Creates structural advantage.",
  },
];

export default function Framework() {
  return (
    <section id="framework" className="section-padding bg-paper section-divider">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="eyebrow mb-3">Our Core Framework</p>
          <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight text-balance max-w-3xl">
            From Tool to System
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl leading-relaxed">
            Most people use AI like a vending machine — ask a question, get an answer,
            repeat. We help you build something different:{" "}
            <strong className="text-ink">
              your own systems that handle the repetitive work for you
            </strong>
            , so your time goes back to the work only you can do.
          </p>
        </div>

        <p className="font-mono text-xs tracking-widest uppercase text-muted mb-5">
          What you&apos;ll build — Source → Skills → Systems
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {layers.map((layer, i) => (
            <div key={i} className={`rounded-2xl border p-6 ${layer.color}`}>
              <div className={`text-xs font-mono font-bold mb-3 ${layer.labelColor}`}>
                {layer.number}
              </div>
              <h3 className="font-bold text-ink mb-2">{layer.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{layer.description}</p>
            </div>
          ))}
        </div>

        {/* Two lanes */}
        <div className="bg-ink text-white rounded-2xl p-8 sm:p-10">
          <p className="font-mono text-xs tracking-widest uppercase text-accent mb-3">
            How it scales
          </p>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-6 text-balance">
            Two lanes, running at once
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lanes.map((lane, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-3">
                  {lane.label}
                </p>
                <p className="text-white/80 text-sm leading-relaxed mb-3">{lane.body}</p>
                <p className="text-accent text-sm font-semibold">{lane.creates}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 pt-6 border-t border-white/10 text-white/80 leading-relaxed max-w-2xl">
            <strong className="text-white">Six months from now,</strong> the work that
            drains you today runs quietly in the background — and your time goes to what
            actually grows the business.
          </p>
        </div>
      </div>
    </section>
  );
}
