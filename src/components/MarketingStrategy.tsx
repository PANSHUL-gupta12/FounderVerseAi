import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";

const iconMap: Record<string, any> = {
  Instagram, "Twitter/X": Twitter, YouTube: Youtube, LinkedIn: Linkedin,
};

interface Platform {
  platform: string;
  strategy: string;
  hooks: string[];
  schedule: string;
}

const MarketingStrategy = ({ platforms }: { platforms: Platform[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {platforms.map((p, i) => {
        const Icon = iconMap[p.platform] || Instagram;
        return (
          <div key={p.platform} className="glass-card-hover cursor-pointer overflow-hidden" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            <div className="flex items-center gap-3 p-4">
              <Icon className="h-5 w-5 text-primary" />
              <span className="flex-1 font-display text-sm font-semibold text-foreground">{p.platform}</span>
              <span className="hidden text-xs text-muted-foreground sm:block">{p.schedule}</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
            </div>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="border-t border-border px-4 py-4 text-sm">
                    <p className="mb-3 text-muted-foreground">{p.strategy}</p>
                    <div className="mb-2 text-xs font-medium text-foreground">Content Hooks:</div>
                    <ul className="mb-3 space-y-1">
                      {p.hooks.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">📅 Schedule: {p.schedule}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default MarketingStrategy;
