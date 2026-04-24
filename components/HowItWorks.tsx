const steps = [
  {
    number: "01",
    icon: "🎙️",
    title: "AI-Guided Interview",
    description:
      "A 20–30 minute conversation about your business — your workflows, bottlenecks, team size, and biggest time drains. No tech knowledge required.",
    accent: "accent",
  },
  {
    number: "02",
    icon: "📊",
    title: "Professional Report",
    description:
      "Within 24–48 hours you receive a detailed report: an Effort/Impact matrix of every pain point, quick wins, recommended tools, and a financial ROI summary.",
    accent: "teal",
  },
  {
    number: "03",
    icon: "⚡",
    title: "Implement & Win",
    description:
      "We walk through your report on a 30-min follow-up call. You leave with a clear action plan — and optional hands-on implementation support.",
    accent: "accent",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-primary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Three steps from "I don't know where to start" to a clear,
            dollar-quantified AI roadmap.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-accent via-teal to-accent opacity-30" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative card-surface p-8 hover:border-accent/40 transition-colors group">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                    step.accent === "teal" ? "bg-teal/15" : "bg-accent/15"
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-4xl font-black ${
                    step.accent === "teal" ? "text-teal/20 group-hover:text-teal/40" : "text-accent/20 group-hover:text-accent/40"
                  } transition-colors`}>
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
