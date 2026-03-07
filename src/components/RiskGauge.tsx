import { motion } from "framer-motion";

interface Props {
  score: number; // 0-100
}

const RiskGauge = ({ score }: Props) => {
  const circumference = 2 * Math.PI * 54;
  const halfCirc = circumference / 2;
  const offset = halfCirc - (score / 100) * halfCirc;

  const color =
    score <= 30 ? "hsl(142, 71%, 45%)" : score <= 60 ? "hsl(45, 93%, 47%)" : "hsl(0, 72%, 51%)";

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80">
        {/* Background arc */}
        <path
          d="M 10 75 A 54 54 0 0 1 130 75"
          fill="none"
          stroke="hsl(222, 20%, 18%)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Animated arc */}
        <motion.path
          d="M 10 75 A 54 54 0 0 1 130 75"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={halfCirc}
          initial={{ strokeDashoffset: halfCirc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="-mt-4 text-center">
        <span className="font-display text-2xl font-bold text-foreground">{score}</span>
        <span className="text-sm text-muted-foreground">/100</span>
      </div>
      <span className="mt-1 text-xs text-muted-foreground">Risk Score</span>
    </div>
  );
};

export default RiskGauge;
