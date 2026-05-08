import { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Zap, Building2, Users, DollarSign, GitBranch } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { simulateDecision } from "@/lib/gemini";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stages = [
  { value: "idea", label: "Idea Stage" },
  { value: "mvp", label: "MVP / Prototype" },
  { value: "early-revenue", label: "Early Revenue" },
  { value: "growth", label: "Growth Stage" },
  { value: "scaling", label: "Scaling" },
];

const DecisionSimulator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = (location.state as any)?.formData;
  const startupId = (location.state as any)?.startupId;

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analyzing your decision…");
  const [form, setForm] = useState({
    currentState: "",
    revenue: "",
    teamSize: "",
    stage: "mvp",
    decision: "",
  });

  if (!formData) return <Navigate to="/simulate" replace />;

  const update = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const inputClass =
    "w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";
  const labelClass = "mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMsg("Analyzing your decision…");

    const msgs = [
      "Mapping possible outcomes…",
      "Running probability simulations…",
      "Evaluating risk-reward trade-offs…",
      "Generating scenario forecasts…",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 2500);

    try {
      const outcomes = await simulateDecision({
        idea: formData.idea,
        currentState: form.currentState,
        revenue: form.revenue,
        teamSize: form.teamSize,
        stage: form.stage,
        decision: form.decision,
      });

      clearInterval(interval);
      
      if (startupId) {
        try {
          const savedDecisions = JSON.parse(localStorage.getItem("savedDecisions") || "[]");
          savedDecisions.push({
            id: crypto.randomUUID(),
            startup_id: startupId,
            current_state: form.currentState,
            revenue: form.revenue ? parseFloat(form.revenue) : 0,
            team_size: form.teamSize ? parseInt(form.teamSize) : 0,
            stage: form.stage,
            decision_text: form.decision,
            outcomes: outcomes,
            created_at: new Date().toISOString()
          });
          localStorage.setItem("savedDecisions", JSON.stringify(savedDecisions));
        } catch (e) {
          console.error("Failed to save decision to localStorage:", e);
        }
      }

      navigate("/decision-results", {
        state: { outcomes, decision: form.decision, formData, startupState: form },
      });
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      alert(`Simulation failed: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <motion.div
          className="flex min-h-[60vh] flex-col items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 h-12 w-12 rounded-full bg-primary/20 blur-xl" />
          </div>
          <p className="font-display text-lg text-foreground">{loadingMsg}</p>
          <div className="h-2 w-64 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: "0%" }}
              animate={{ width: "95%" }}
              transition={{ duration: 12, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-16 pt-24">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-2 font-display text-3xl font-bold">
              Decision <span className="gradient-text">Simulator</span>
            </h1>
            <p className="mb-2 text-muted-foreground">
              Describe your startup's current state and the decision you're considering.
            </p>
            <div className="mb-8 rounded-lg bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Idea:</span>{" "}
              {formData.idea.slice(0, 120)}
              {formData.idea.length > 120 ? "…" : ""}
            </div>
          </motion.div>

          <div className="glass-card p-8">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div>
                <label className={labelClass}>
                  <Building2 className="h-4 w-4 text-primary" />
                  Current State of Your Startup
                </label>
                <textarea
                  className={`${inputClass} min-h-[90px] resize-none`}
                  placeholder="Describe where your startup is today — traction, challenges, team dynamics, key metrics…"
                  value={form.currentState}
                  onChange={(e) => update("currentState", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>
                    <DollarSign className="h-4 w-4 text-primary" />
                    Monthly Revenue ($)
                  </label>
                  <input
                    className={inputClass}
                    type="number"
                    placeholder="0"
                    value={form.revenue}
                    onChange={(e) => update("revenue", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <Users className="h-4 w-4 text-primary" />
                    Team Size
                  </label>
                  <input
                    className={inputClass}
                    type="number"
                    placeholder="3"
                    value={form.teamSize}
                    onChange={(e) => update("teamSize", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <GitBranch className="h-4 w-4 text-primary" />
                    Stage
                  </label>
                  <select
                    className={inputClass}
                    value={form.stage}
                    onChange={(e) => update("stage", e.target.value)}
                  >
                    {stages.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <Zap className="h-4 w-4 text-accent" />
                  Your Decision
                </label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-none`}
                  placeholder="Describe the decision you're considering — e.g. 'Pivot from B2C to B2B', 'Raise a seed round', 'Hire 3 engineers', 'Launch in a new market'…"
                  value={form.decision}
                  onChange={(e) => update("decision", e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="gradient-btn flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base"
              >
                <Zap className="h-5 w-5" />
                Simulate Decision Outcomes
              </button>
            </motion.form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DecisionSimulator;
