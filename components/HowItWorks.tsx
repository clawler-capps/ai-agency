const steps = [
  {
    step: "1",
    title: "Assess",
    name: "We find your leverage",
    description:
      "You walk us through your week — a conversation, not a technical audit. We find where AI saves you the most time.",
    outcome: "Your Leverage Map: a one-page ranked plan of what to automate first — and what each play is worth per year.",
    color: "text-green-DEFAULT border-green-border bg-green-light",
    labelColor: "text-green-DEFAULT",
  },
  {
    step: "2",
    title: "Enable",
    name: "We build it together",
    description:
      "In your own accounts — your data stays in your systems — you build tools you actually run, not demos you forget.",
    outcome: "You leave every session with something working.",
    color: "text-blue-DEFAULT border-blue-border bg-blue-light",
    labelColor: "text-blue-DEFAULT",
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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-cream section-divider">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="eyebrow mb-3">Your journey, in three stages</p>
          <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight text-balance max-w-3xl">
            From &ldquo;I don&apos;t know where to start&rdquo; to a compounding system
          </h2>
          <p className="mt-4 text-lg text-muted max-w-xl leading-relaxed">
            No technical background needed. We do the heavy lifting and hand you a
            plan with real dollar figures on every line — one you can act on this week.
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

              <h3 className="text-xl font-bold text-ink mb-3">{s.name}</h3>
              <p className="text-muted leading-relaxed mb-4">{s.description}</p>

              <p className={`text-sm font-semibold leading-relaxed ${s.labelColor}`}>
                → {s.outcome}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 p-5 rounded-xl bg-ink/5 border border-border">
          <p className="font-mono text-xs tracking-widest uppercase text-muted shrink-0">
            What you get back
          </p>
          <p className="text-xl font-black text-accent tracking-tight">
            Time · Money · Focus
          </p>
        </div>
      </div>
    </section>
  );
}
