const rungs = [
  {
    number: "01",
    title: "Tool Use",
    description:
      "Individuals prompt AI ad hoc. Useful moments, but nothing compounds — the value evaporates between sessions. Most companies live here.",
    color: "border-green-border bg-green-light",
    labelColor: "text-green-DEFAULT",
  },
  {
    number: "02",
    title: "Personal AI-OS",
    description:
      "One person's context, files, and a growing skill library — so the AI gets sharper every week. This is the rung that turns a skeptic into a champion.",
    color: "border-blue-border bg-blue-light",
    labelColor: "text-blue-DEFAULT",
  },
  {
    number: "03",
    title: "Vertical AI-OS",
    description:
      "Each function — sales, ops, finance, marketing — gets scoped skills connected to its own data, surfaced as one assistant per team. The repeatable layer of the work gets automated.",
    color: "border-accent/30 bg-accent/light",
    labelColor: "text-accent",
  },
  {
    number: "04",
    title: "Company-wide AI-OS",
    description:
      "An orchestration layer across the org: personal skills stay personal, shared skills live upstream, and the system knows where the data is and how to use it — governed, permissioned, compounding.",
    color: "border-purple-border bg-purple-light",
    labelColor: "text-purple-DEFAULT",
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
          <p className="eyebrow mb-3">The Core Framework</p>
          <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight text-balance max-w-3xl">
            The Ignition Ladder: four rungs from scattered AI use to a compounding operation
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl leading-relaxed">
            Every engagement climbs the same ladder. You don&apos;t need all four rungs on
            day one — you need to know which rung you&apos;re on, and what the next one is worth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {rungs.map((rung, i) => (
            <div key={i} className={`rounded-2xl border p-6 ${rung.color}`}>
              <div className={`text-xs font-mono font-bold mb-3 ${rung.labelColor}`}>
                RUNG {rung.number}
              </div>
              <h3 className="font-bold text-ink mb-2">{rung.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{rung.description}</p>
            </div>
          ))}
        </div>

        {/* Two lanes */}
        <div className="bg-ink text-white rounded-2xl p-8 sm:p-10">
          <p className="font-mono text-xs tracking-widest uppercase text-accent mb-3">
            How we climb it
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
          <p className="mt-6 text-sm text-white/50 italic">
            Lead with a Lane-A taste of success, then point that energy at a Lane-B system.
          </p>
        </div>
      </div>
    </section>
  );
}
