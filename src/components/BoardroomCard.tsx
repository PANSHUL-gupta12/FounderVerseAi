import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Props {
  role: string;
  name: string;
  color: string;
  opinion: string;
  detail: string;
}

const BoardroomCard = ({ role, name, color, opinion, detail }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="glass-card-hover cursor-pointer overflow-hidden"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center gap-4 p-5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary-foreground"
          style={{ background: color }}
        >
          {role.slice(0, 3)}
        </div>
        <div className="flex-1">
          <div className="font-display text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
        <p className="hidden flex-1 text-sm text-muted-foreground md:block">{opinion}</p>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              <p className="mb-2 font-medium text-foreground md:hidden">{opinion}</p>
              {detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoardroomCard;
