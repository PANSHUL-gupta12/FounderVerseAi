interface DecisionInput {
  idea: string;
  currentState: string;
  revenue: string;
  teamSize: string;
  stage: string;
  decision: string;
}

interface Outcome {
  id: number;
  title: string;
  description: string;
  successProbability: number;
  impact: "positive" | "negative" | "neutral";
  timeframe: string;
  risks: string[];
  benefits: string[];
  revenueChange: number; // percentage
  costChange: number; // percentage
}

export const generateDecisionOutcomes = (input: DecisionInput): Outcome[] => {
  const seed = input.decision.length + input.idea.length + input.currentState.length;
  const teamSize = parseInt(input.teamSize) || 5;
  const revenue = parseInt(input.revenue) || 0;
  const isEarlyStage = input.stage === "idea" || input.stage === "mvp";

  const outcomeTemplates: Outcome[] = [
    {
      id: 1,
      title: "Best Case — Strong Execution",
      description: `If "${input.decision.slice(0, 80)}" is executed with full commitment and favorable market conditions, this is the optimistic trajectory for your ${input.stage}-stage startup.`,
      successProbability: Math.min(85, 45 + Math.round((seed % 20) + teamSize * 2)),
      impact: "positive",
      timeframe: isEarlyStage ? "3-6 months" : "1-3 months",
      risks: [
        "Requires sustained team focus — distractions could derail progress",
        "Market timing may shift before full rollout",
      ],
      benefits: [
        `Could accelerate growth by ${20 + (seed % 30)}% within the timeframe`,
        "Strengthens competitive moat if executed first-to-market",
        teamSize > 3 ? "Team size supports parallel workstreams" : "Lean team enables fast pivots",
      ],
      revenueChange: 15 + (seed % 35),
      costChange: 10 + (seed % 15),
    },
    {
      id: 2,
      title: "Moderate Case — Partial Traction",
      description: `The decision yields mixed results. Some aspects of "${input.decision.slice(0, 60)}" gain traction while others underperform, requiring iteration.`,
      successProbability: Math.min(70, 30 + Math.round((seed % 15) + teamSize)),
      impact: "neutral",
      timeframe: isEarlyStage ? "4-8 months" : "2-5 months",
      risks: [
        "Resource allocation may need rebalancing mid-execution",
        "Target audience adoption slower than projected",
        "Competitor response could neutralize first-mover advantage",
      ],
      benefits: [
        "Provides valuable market data for future decisions",
        "Builds operational muscle and team alignment",
        `Incremental revenue growth of ${5 + (seed % 15)}% is still meaningful`,
      ],
      revenueChange: 5 + (seed % 15),
      costChange: 15 + (seed % 10),
    },
    {
      id: 3,
      title: "Worst Case — Setback Scenario",
      description: `If market conditions are unfavorable or execution falters, "${input.decision.slice(0, 60)}" could lead to setbacks that require a course correction.`,
      successProbability: Math.max(8, 15 - Math.round(seed % 10)),
      impact: "negative",
      timeframe: isEarlyStage ? "2-4 months to realize" : "1-3 months to realize",
      risks: [
        `Cash burn increases by ~${20 + (seed % 25)}% without proportional returns`,
        "Team morale and focus could suffer from visible failure",
        revenue > 0 ? "Existing customers may churn during the transition" : "Delays path to first revenue",
      ],
      benefits: [
        "Fail-fast learning accelerates future decision quality",
        "Clarifies what does NOT work — reduces future option space",
        "Forces strategic re-evaluation that may uncover better paths",
      ],
      revenueChange: -(10 + (seed % 20)),
      costChange: 20 + (seed % 20),
    },
    {
      id: 4,
      title: "Pivot Opportunity — Unexpected Direction",
      description: `While pursuing "${input.decision.slice(0, 50)}...", an adjacent opportunity emerges that could redirect the startup's trajectory in a more promising direction.`,
      successProbability: Math.min(60, 25 + Math.round((seed % 18) + teamSize * 1.5)),
      impact: "positive",
      timeframe: isEarlyStage ? "6-12 months" : "3-6 months",
      risks: [
        "Pivoting mid-execution can confuse stakeholders and team",
        "Sunk cost from original decision path",
        "New direction requires re-validation of product-market fit",
      ],
      benefits: [
        "Access to a potentially larger or less competitive market",
        "Leverages learnings from the original decision",
        `Could unlock ${30 + (seed % 40)}% higher growth ceiling`,
      ],
      revenueChange: 8 + (seed % 25),
      costChange: 5 + (seed % 12),
    },
  ];

  return outcomeTemplates;
};
