import { motion } from "framer-motion";
import { Lightbulb, Brain, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Enter Your Startup Idea",
    description: "Describe your concept, budget, audience, and pricing model. Set your risk appetite and timeline.",
  },
  {
    icon: Brain,
    title: "AI Simulates Outcomes",
    description: "Our multi-agent system runs market analysis, financial projections, and strategic evaluations.",
  },
  {
    icon: BarChart3,
    title: "Get Boardroom Verdict",
    description: "Receive a comprehensive report with risk scores, growth projections, and a marketing roadmap.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three steps to validate your startup before investing a single dollar.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="glass-card-hover p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="mb-2 font-display text-sm font-medium text-primary">
                Step {i + 1}
              </div>
              <h3 className="mb-3 font-display text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
