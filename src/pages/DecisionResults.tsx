import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2,
  ArrowRight, RotateCcw, Zap, ChevronDown, ChevronUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const impactColors = {
  positive: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  negative: "from-destructive/20 to-destructive/5 border-destructive/30",
  neutral: "from-primary/20 to-primary/5 border-primary/30",
};

const impactIcons = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: Minus,
};

const impactLabels = {
  positive: "Positive Impact",
  negative: "Negative Impact",
  neutral: "Mixed Impact",
};

const DecisionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(1);

  if (!location.state) return <Navigate to="/simulate" replace />;
  const { outcomes, decision, formData, startupState } = location.state as any;
  if (!outcomes) return <Navigate to="/simulate" replace />;

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  const getProbabilityColor = (prob: number) => {
    if (prob >= 60) return "text-emerald-400";
    if (prob >= 30) return "text-yellow-400";
    return "text-destructive";
  };

  const getDangerColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "critical": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-16 pt-24">
        <motion.h1 className="mb-2 font-display text-3xl font-bold" {...fade(0)}>
          Decision <span className="gradient-text">Outcomes</span>
        </motion.h1>
        <motion.p className="mb-2 text-muted-foreground" {...fade(0.05)}>
          Simulated outcomes for your strategic decision.
        </motion.p>
        <motion.div
          className="mb-8 rounded-lg bg-secondary/50 px-4 py-3 text-sm"
          {...fade(0.08)}
        >
          <span className="font-medium text-foreground">Decision:</span>{" "}
          <span className="text-muted-foreground">
            {decision.slice(0, 150)}
            {decision.length > 150 ? "…" : ""}
          </span>
        </motion.div>

        {/* Probability Overview Bar */}
        <motion.div className="glass-card mb-8 p-6" {...fade(0.1)}>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Success Probability Overview
          </h2>
          <div className="space-y-3">
            {outcomes.map((o: any) => {
              const Icon = impactIcons[o.impact as keyof typeof impactIcons];
              return (
                <div key={o.id} className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 shrink-0 ${
                    o.impact === "positive" ? "text-emerald-400" :
                    o.impact === "negative" ? "text-destructive" : "text-primary"
                  }`} />
                  <span className="w-48 shrink-0 truncate text-sm text-foreground">
                    {o.title}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={`h-full rounded-full ${
                        o.impact === "positive" ? "bg-emerald-500" :
                        o.impact === "negative" ? "bg-destructive" : "bg-primary"
                      }`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${o.successProbability}%` }}
                      transition={{ duration: 1, delay: 0.3 + o.id * 0.15 }}
                    />
                  </div>
                  <span className={`w-12 text-right text-sm font-bold ${getProbabilityColor(o.successProbability)}`}>
                    {o.successProbability}%
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Outcome Cards */}
        <div className="mb-8 space-y-4">
          {outcomes.map((o: any, idx: number) => {
            const Icon = impactIcons[o.impact as keyof typeof impactIcons];
            const isExpanded = expandedId === o.id;
            return (
              <motion.div
                key={o.id}
                className={`overflow-hidden rounded-xl border bg-gradient-to-br ${impactColors[o.impact as keyof typeof impactColors]}`}
                {...fade(0.15 + idx * 0.08)}
              >
                <button
                  className="flex w-full items-center justify-between p-5 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : o.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      o.impact === "positive" ? "bg-emerald-500/20" :
                      o.impact === "negative" ? "bg-destructive/20" : "bg-primary/20"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        o.impact === "positive" ? "text-emerald-400" :
                        o.impact === "negative" ? "text-destructive" : "text-primary"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {o.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {impactLabels[o.impact as keyof typeof impactLabels]} · {o.timeframe}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end mr-2">
                      <span className={`text-lg font-bold ${getProbabilityColor(o.successProbability)}`}>
                        {o.successProbability}%
                      </span>
                      <span className={`mt-1 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getDangerColor(o.dangerLevel)}`}>
                        Danger: {o.dangerLevel}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <motion.div
                    className="border-t border-border/50 px-5 pb-5 pt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="mb-4 text-sm text-muted-foreground">{o.description}</p>

                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-background/50 p-3">
                        <span className="text-xs font-medium text-muted-foreground">Revenue Impact</span>
                        <p className={`font-display text-lg font-bold ${o.revenueChange >= 0 ? "text-emerald-400" : "text-destructive"}`}>
                          {o.revenueChange >= 0 ? "+" : ""}{o.revenueChange}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-background/50 p-3">
                        <span className="text-xs font-medium text-muted-foreground">Cost Impact</span>
                        <p className="font-display text-lg font-bold text-yellow-400">
                          +{o.costChange}%
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          Benefits
                        </h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                          {o.benefits.map((b: string, i: number) => (
                            <li key={i} className="flex gap-1.5">
                              <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
                          Risks
                        </h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                          {o.risks.map((r: string, i: number) => (
                            <li key={i} className="flex gap-1.5">
                              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <motion.div className="flex flex-wrap gap-3" {...fade(0.5)}>
          <button
            onClick={() =>
              navigate("/decision-simulator", { state: { formData } })
            }
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" />
            Simulate Another Decision
          </button>
          <button
            onClick={() => navigate("/simulate")}
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Zap className="h-4 w-4" />
            New Simulation
          </button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default DecisionResults;
