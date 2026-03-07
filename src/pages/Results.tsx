import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Line,
} from "recharts";
import { Shield, TrendingUp, Clock, BarChart3, CheckCircle2, AlertTriangle, ArrowRight, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RiskGauge from "@/components/RiskGauge";
import AnimatedCounter from "@/components/AnimatedCounter";
import BoardroomCard from "@/components/BoardroomCard";
import MarketingStrategy from "@/components/MarketingStrategy";

const boardroomColors = [
  "linear-gradient(135deg, hsl(217,91%,60%), hsl(260,70%,60%))",
  "linear-gradient(135deg, hsl(142,71%,45%), hsl(160,60%,40%))",
  "linear-gradient(135deg, hsl(45,93%,47%), hsl(30,90%,55%))",
  "linear-gradient(135deg, hsl(0,72%,51%), hsl(350,80%,55%))",
];

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) return <Navigate to="/simulate" replace />;

  const { aiResults, formData } = location.state as any;

  const { metrics, financials, boardroom, marketing, verdict } = aiResults;

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-16 pt-24">
        <motion.h1 className="mb-2 font-display text-3xl font-bold" {...fade(0)}>
          Simulation <span className="gradient-text">Results</span>
        </motion.h1>
        <motion.p className="mb-8 text-muted-foreground" {...fade(0.05)}>
          Your AI boardroom has completed the analysis.
        </motion.p>

        {/* Top Metrics */}
        <motion.div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" {...fade(0.1)}>
          <div className="glass-card flex flex-col items-center p-6">
            <RiskGauge score={metrics.riskScore} />
          </div>
          {[
            { icon: TrendingUp, label: "Success Probability", value: metrics.successProbability, suffix: "%" },
            { icon: Clock, label: "Break-even", value: metrics.breakEvenMonths, suffix: " months" },
            { icon: BarChart3, label: "Growth Difficulty", value: metrics.growthDifficulty, suffix: "/10" },
          ].map((m) => (
            <div key={m.label} className="glass-card flex flex-col items-center justify-center p-6 text-center">
              <m.icon className="mb-2 h-5 w-5 text-primary" />
              <span className="font-display text-2xl font-bold text-foreground">
                <AnimatedCounter value={m.value} suffix={m.suffix} />
              </span>
              <span className="mt-1 text-xs text-muted-foreground">{m.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Revenue Chart */}
        <motion.div className="glass-card mb-8 p-6" {...fade(0.15)}>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Financial Projections (12 Months)</h2>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "3-Month Revenue", val: financials.threeMonthRevenue, prefix: "$" },
              { label: "Burn Rate / mo", val: financials.burnRate, prefix: "$" },
              { label: "12-Month ROI", val: financials.twelveMonthROI, suffix: "%" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-secondary/50 p-4 text-center">
                <span className="font-display text-xl font-bold text-foreground">
                  <AnimatedCounter value={f.val} prefix={f.prefix} suffix={f.suffix} />
                </span>
                <p className="mt-1 text-xs text-muted-foreground">{f.label}</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={financials.revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(222, 40%, 10%)",
                  border: "1px solid hsl(222, 20%, 18%)",
                  borderRadius: "0.75rem",
                  color: "hsl(210, 20%, 90%)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(217, 91%, 60%)" fill="url(#revGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="cost" stroke="hsl(0, 72%, 51%)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Marketing + Boardroom */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <motion.div {...fade(0.2)}>
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Marketing Strategy</h2>
            <MarketingStrategy platforms={marketing} />
          </motion.div>

          <motion.div {...fade(0.25)}>
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">AI Boardroom Discussion</h2>
            <div className="space-y-3">
              {boardroom.map((b: any, i: number) => (
                <BoardroomCard key={b.role} {...b} color={boardroomColors[i]} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Verdict */}
        <motion.div className="glow-border glass-card p-8" {...fade(0.3)}>
          <div className="mb-4 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Final Verdict</h2>
          </div>
          <p className="mb-6 text-lg font-medium gradient-text">"{verdict.summary}"</p>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <ArrowRight className="h-4 w-4 text-primary" /> Recommended Next Steps
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {verdict.nextSteps.map((s: string, i: number) => <li key={i}>{i + 1}. {s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Top 3 Risks
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {verdict.risks.map((r: string, i: number) => <li key={i}>{i + 1}. {r}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary" /> 30-Day Roadmap
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {verdict.roadmap.map((r: string, i: number) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Decision Simulator CTA */}
        <motion.div className="mt-8 flex justify-center" {...fade(0.35)}>
          <button
            onClick={() => navigate("/decision-simulator", { state: { formData } })}
            className="gradient-btn flex items-center gap-2 rounded-xl px-8 py-3.5 text-base"
          >
            <Zap className="h-5 w-5" />
            Simulate a Decision for This Startup
          </button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
