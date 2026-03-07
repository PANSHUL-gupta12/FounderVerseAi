export const generateMockResults = (form: {
  idea: string;
  budget: string;
  marketingBudget: string;
  audience: string;
  pricing: string;
  timeline: string;
}, riskAppetite: number) => {
  const budget = parseInt(form.budget) || 50000;
  const mktBudget = parseInt(form.marketingBudget) || 10000;
  const isAggressive = riskAppetite > 60;
  const baseRevenue = budget * 0.15;

  const revenueData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    revenue: Math.round(baseRevenue * (0.3 + i * 0.12) * (isAggressive ? 1.3 : 1)),
    cost: Math.round((budget / 12) + (mktBudget / 12) * (1 - i * 0.03)),
  }));

  return {
    metrics: {
      riskScore: Math.min(95, Math.max(10, riskAppetite + Math.round(Math.random() * 20 - 10))),
      successProbability: Math.min(90, Math.max(20, 100 - riskAppetite + Math.round(Math.random() * 15))),
      breakEvenMonths: isAggressive ? Math.round(6 + Math.random() * 4) : Math.round(9 + Math.random() * 6),
      growthDifficulty: Math.round(3 + Math.random() * 5),
    },
    financials: {
      threeMonthRevenue: Math.round(baseRevenue * 1.5),
      burnRate: Math.round(budget / 10),
      twelveMonthROI: Math.round((isAggressive ? 35 : 18) + Math.random() * 30),
      revenueData,
    },
    boardroom: [
      {
        role: "Chief Executive Officer",
        name: "AI CEO",
        opinion: `The concept of "${form.idea.slice(0, 60)}..." shows market potential with the right execution.`,
        detail: `Given the $${budget.toLocaleString()} budget and ${form.pricing} model, this idea targets ${form.audience} effectively. The ${form.timeline} timeline is ${isAggressive ? "ambitious but achievable" : "realistic"}. I recommend validating demand before full commitment.`,
      },
      {
        role: "Chief Technology Officer",
        name: "AI CTO",
        opinion: "Technical feasibility is moderate — an MVP can be built within the timeline.",
        detail: `A lean tech stack can keep initial costs low. With the ${form.timeline} timeline, prioritize core features only. Budget $${Math.round(budget * 0.4).toLocaleString()} for development and iterate based on user feedback.`,
      },
      {
        role: "Chief Marketing Officer",
        name: "AI CMO",
        opinion: `$${mktBudget.toLocaleString()} marketing budget requires a focused channel strategy.`,
        detail: `For ${form.audience}, I recommend a content-first approach. Allocate 40% to paid social, 30% to content marketing, and 30% to community building. The ${form.pricing} model works well for initial user acquisition.`,
      },
      {
        role: "Chief Financial Officer",
        name: "AI CFO",
        opinion: `Financial projections indicate break-even within ${isAggressive ? "8-10" : "12-15"} months.`,
        detail: `Monthly burn rate of ~$${Math.round(budget / 10).toLocaleString()} is manageable. The ${form.pricing} pricing model has a typical LTV/CAC ratio of 3:1 in this segment. Monitor cash runway carefully after month 6.`,
      },
    ],
    marketing: [
      {
        platform: "Instagram",
        strategy: `Visual storytelling targeting ${form.audience}. Focus on behind-the-scenes content and user testimonials.`,
        hooks: [
          "Day-in-the-life content showing the problem you solve",
          "Before/after transformation stories",
          "Quick tip reels related to your niche",
        ],
        schedule: "5x per week",
      },
      {
        platform: "Twitter/X",
        strategy: "Thought leadership and community engagement. Build in public to attract early adopters.",
        hooks: [
          "Share weekly progress updates and metrics",
          "Engage in relevant industry conversations",
          "Create threads breaking down your market insights",
        ],
        schedule: "Daily",
      },
      {
        platform: "YouTube",
        strategy: "Long-form educational content establishing authority in your space.",
        hooks: [
          "How-to tutorials related to the problem you solve",
          "Industry analysis and trend breakdowns",
          "Customer success story interviews",
        ],
        schedule: "2x per week",
      },
      {
        platform: "LinkedIn",
        strategy: "B2B networking and professional credibility building.",
        hooks: [
          "Founder journey posts with real numbers",
          "Industry insight articles",
          "Team and culture highlights",
        ],
        schedule: "3x per week",
      },
    ],
    verdict: {
      summary: "Build an MVP and validate demand before scaling — the fundamentals are promising but market validation is critical.",
      nextSteps: [
        "Build a landing page and collect 500+ email signups",
        "Launch a minimal viable product within 8 weeks",
        "Run paid ads with $500 to test conversion rates",
        "Conduct 20 customer interviews for feedback",
      ],
      risks: [
        "Market saturation in adjacent segments",
        "Customer acquisition cost may exceed initial projections",
        "Timeline pressure could compromise product quality",
      ],
      roadmap: [
        "Week 1: Market research and competitor analysis",
        "Week 2: Define MVP feature set and begin development",
        "Week 3: Set up marketing channels and content pipeline",
        "Week 4: Soft launch to beta users and gather feedback",
      ],
    },
  };
};
