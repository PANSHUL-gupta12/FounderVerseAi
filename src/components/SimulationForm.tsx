import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { simulateStartup } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

const SimulationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("AI Boardroom is discussing your idea…");
  const [risk, setRisk] = useState([50]);
  const [form, setForm] = useState({
    idea: "",
    budget: "",
    marketingBudget: "",
    audience: "",
    pricing: "freemium",
    timeline: "6months",
  });

  const update = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMsg("AI Boardroom is discussing your idea…");

    const msgs = [
      "Analyzing market conditions…",
      "Running financial projections…",
      "Evaluating risk factors…",
      "Generating marketing strategy…",
      "Compiling boardroom opinions…",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 3000);

    try {
      const data = await simulateStartup({ ...form, riskAppetite: risk[0] });

      clearInterval(interval);

      if (!data.metrics || !data.financials) {
        throw new Error("Incomplete data from AI simulation");
      }

      let startupId = null;
      try {
        let orgId = null;
        if (user) {
          const { data: orgData } = await supabase
            .from('organization_members')
            .select('org_id')
            .eq('user_id', user.id)
            .limit(1)
            .single();
          if (orgData) orgId = orgData.org_id;
        }

        const { data: dbData, error } = await supabase.from('startups').insert([{
          user_id: user?.id || null,
          org_id: orgId,
          idea: form.idea,
          initial_budget: form.budget ? parseFloat(form.budget) : 0,
          marketing_budget: form.marketingBudget ? parseFloat(form.marketingBudget) : 0,
          target_audience: form.audience,
          pricing_model: form.pricing,
          timeline: form.timeline,
          risk_appetite: risk[0],
          analysis_data: data
        }]).select('id').single();

        if (error) {
          console.error("Supabase insert error:", error);
        } else if (dbData) {
          startupId = dbData.id;
        }
      } catch (e) {
        console.error("Error saving to db:", e);
      }

      navigate("/results", { state: { aiResults: data, formData: form, startupId } });

    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      alert(`Simulation failed: ${err instanceof Error ? err.message : "Unknown error"}. Please try again.`);
    }
  };

  if (loading) {
    return (
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
            transition={{ duration: 15, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";
  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <label className={labelClass}>Startup Idea</label>
        <textarea
          className={`${inputClass} min-h-[100px] resize-none`}
          placeholder="Describe your startup idea in detail…"
          value={form.idea}
          onChange={(e) => update("idea", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Initial Budget ($)</label>
          <input className={inputClass} type="number" placeholder="50000" value={form.budget} onChange={(e) => update("budget", e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Marketing Budget ($)</label>
          <input className={inputClass} type="number" placeholder="10000" value={form.marketingBudget} onChange={(e) => update("marketingBudget", e.target.value)} required />
        </div>
      </div>

      <div>
        <label className={labelClass}>Target Audience</label>
        <input className={inputClass} placeholder="e.g. Tech-savvy millennials, B2B SaaS buyers" value={form.audience} onChange={(e) => update("audience", e.target.value)} required />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Pricing Model</label>
          <select className={inputClass} value={form.pricing} onChange={(e) => update("pricing", e.target.value)}>
            <option value="freemium">Freemium</option>
            <option value="subscription">Subscription</option>
            <option value="one-time">One-Time Purchase</option>
            <option value="usage-based">Usage-Based</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Timeline</label>
          <select className={inputClass} value={form.timeline} onChange={(e) => update("timeline", e.target.value)}>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="12months">12 Months</option>
            <option value="18months">18 Months</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Risk Appetite: <span className="text-primary">{risk[0]}%</span>
        </label>
        <Slider value={risk} onValueChange={setRisk} max={100} step={1} className="mt-2" />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Conservative</span>
          <span>Aggressive</span>
        </div>
      </div>

      <button type="submit" className="gradient-btn flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base">
        <Rocket className="h-5 w-5" />
        Run AI Simulation
      </button>
    </motion.form>
  );
};

export default SimulationForm;