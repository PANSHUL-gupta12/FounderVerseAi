const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function simulateStartup(formData: any) {
  if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY in environment");

  const prompt = `You are an AI Boardroom of expert advisors. Analyze the following startup idea and provide a detailed assessment.
Startup Details:
Idea: ${formData.idea}
Budget: $${formData.budget}
Marketing Budget: ${formData.marketingBudget}
Target Audience: ${formData.audience}
Pricing Model: ${formData.pricing}
Timeline: ${formData.timeline}
Risk Appetite: ${formData.riskAppetite}% (0=Conservative, 100=Aggressive)

Provide a realistic, data-driven analysis including metrics, financial projections for 12 months, marketing strategy, boardroom opinions, and a final verdict. Be creative but realistic with the metrics.`;

  const schema = {
    type: "OBJECT",
    properties: {
      metrics: {
        type: "OBJECT",
        properties: {
          riskScore: { type: "INTEGER", description: "0-100" },
          successProbability: { type: "INTEGER", description: "0-100" },
          breakEvenMonths: { type: "INTEGER" },
          growthDifficulty: { type: "INTEGER", description: "1-10" },
        },
        required: ["riskScore", "successProbability", "breakEvenMonths", "growthDifficulty"],
      },
      financials: {
        type: "OBJECT",
        properties: {
          threeMonthRevenue: { type: "INTEGER" },
          burnRate: { type: "INTEGER" },
          twelveMonthROI: { type: "INTEGER" },
          revenueData: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                month: { type: "STRING", description: "e.g., Month 1, Month 2..." },
                revenue: { type: "INTEGER" },
                cost: { type: "INTEGER" },
              },
              required: ["month", "revenue", "cost"],
            },
          },
        },
        required: ["threeMonthRevenue", "burnRate", "twelveMonthROI", "revenueData"],
      },
      boardroom: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            role: { type: "STRING", description: "e.g., CEO, CMO, CTO" },
            name: { type: "STRING" },
            opinion: { type: "STRING" },
            avatar: { type: "STRING", description: "URL to a random avatar image or a short description" },
          },
          required: ["role", "name", "opinion", "avatar"],
        },
      },
      marketing: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            platform: { type: "STRING" },
            strategy: { type: "STRING" },
            hooks: { type: "ARRAY", items: { type: "STRING" }, description: "3 content hooks or ideas" },
            schedule: { type: "STRING", description: "Posting schedule, e.g., 3x a week" },
          },
          required: ["platform", "strategy", "hooks", "schedule"],
        },
      },
      verdict: {
        type: "OBJECT",
        properties: {
          summary: { type: "STRING" },
          nextSteps: { type: "ARRAY", items: { type: "STRING" } },
          risks: { type: "ARRAY", items: { type: "STRING" } },
          roadmap: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["summary", "nextSteps", "risks", "roadmap"],
      },
    },
    required: ["metrics", "financials", "boardroom", "marketing", "verdict"],
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to generate simulation.");
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textResponse) {
    throw new Error("Invalid response from Gemini API");
  }
  
  return JSON.parse(textResponse);
}

export async function simulateDecision(params: { idea: string, currentState: string, revenue: string, teamSize: string, stage: string, decision: string }) {
  if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY in environment");

  const prompt = `You are an AI Boardroom evaluating a critical startup decision. 
Startup Idea: ${params.idea}
Current State: ${params.currentState}
Monthly Revenue: $${params.revenue}
Team Size: ${params.teamSize}
Stage: ${params.stage}

Proposed Decision: ${params.decision}

Generate 3 realistic outcomes (Best Case, Most Likely, Worst Case) of this decision over the next 6-12 months. The 'impact' field must be 'positive', 'neutral', or 'negative'. Provide 'revenueChange' and 'costChange' as integer percentages (e.g., 20, -10). Provide 'benefits' and 'risks' as arrays of strings. Also include a 'dangerLevel' representing the risk factor (Low, Medium, High, Critical).`;

  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        id: { type: "INTEGER", description: "1, 2, 3" },
        title: { type: "STRING", description: "e.g., Best Case: Rapid Adoption" },
        impact: { type: "STRING", description: "positive, neutral, negative" },
        successProbability: { type: "INTEGER", description: "0-100" },
        timeframe: { type: "STRING", description: "e.g., 6 months" },
        description: { type: "STRING" },
        revenueChange: { type: "INTEGER", description: "e.g., 20 or -15" },
        costChange: { type: "INTEGER", description: "e.g., 10 or -5" },
        benefits: { type: "ARRAY", items: { type: "STRING" } },
        risks: { type: "ARRAY", items: { type: "STRING" } },
        dangerLevel: { type: "STRING", description: "Low, Medium, High, Critical" },
      },
      required: ["id", "title", "impact", "successProbability", "timeframe", "description", "revenueChange", "costChange", "benefits", "risks", "dangerLevel"],
    },
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to generate decision outcomes.");
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textResponse) {
    throw new Error("Invalid response from Gemini API");
  }
  
  return JSON.parse(textResponse);
}
