import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Clock, Zap, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load startups from localStorage instead of Supabase
    const savedStartups = JSON.parse(localStorage.getItem("savedStartups") || "[]");
    
    // Sort by created_at descending if available
    savedStartups.sort((a: any, b: any) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    setStartups(savedStartups);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (startups.length === 0) return null;

  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
        Your Saved <span className="gradient-text">Startups</span>
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startups.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card flex flex-col p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {s.pricing_model || "Startup"}
              </span>
            </div>
            
            <p className="mb-6 flex-1 text-sm text-foreground line-clamp-3">
              {s.idea}
            </p>
            
            <div className="mb-6 grid grid-cols-2 gap-4 border-y border-border/50 py-4 text-xs text-muted-foreground">
              <div>
                <span className="block font-semibold text-foreground">Budget</span>
                ${s.initial_budget?.toLocaleString()}
              </div>
              <div>
                <span className="block font-semibold text-foreground">Risk</span>
                {s.risk_appetite}%
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() =>
                  navigate("/results", {
                    state: {
                      aiResults: s.analysis_data,
                      formData: { idea: s.idea },
                      startupId: s.id,
                    },
                  })
                }
                className="flex w-full items-center justify-between rounded-lg bg-secondary/80 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                View Strategy <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() =>
                  navigate("/decision-simulator", {
                    state: {
                      formData: { idea: s.idea },
                      startupId: s.id,
                    },
                  })
                }
                className="flex w-full items-center justify-between rounded-lg border border-primary/20 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Simulate Decision <Zap className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
