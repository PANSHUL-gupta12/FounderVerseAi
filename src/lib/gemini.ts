import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    console.warn("Please set VITE_GEMINI_API_KEY in your .env file.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "dummy-key" });
};

export async function simulateStartup(formData: any) {
  const ai = getAI();
  const prompt = `You are an AI Boardroom of expert advisors. Analyze the following startup idea and provide a detailed assessment.
Startup Details:
Idea: ${formData.idea}
Budget: $${formData.budget}
Marketing Budget: $${formData.marketingBudget}
Target Audience: ${formData.audience}
Pricing Model: ${formData.pricing}
Timeline: ${formData.timeline}
Risk Appetite: ${formData.riskAppetite}% (0=Conservative, 100=Aggressive)

Provide a realistic, data-driven analysis including metrics, financial projections for 12 months, marketing strategy, boardroom opinions, and a final verdict. Be creative but realistic with the metrics.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metrics: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.INTEGER, description: "0-100" },
              successProbability: { type: Type.INTEGER, description: "0-100" },
              breakEvenMonths: { type: Type.INTEGER },
              growthDifficulty: { type: Type.INTEGER, description: "1-10" },
            },
            required: ["riskScore", "successProbability", "breakEvenMonths", "growthDifficulty"],
          },
          financials: {
            type: Type.OBJECT,
            properties: {
              threeMonthRevenue: { type: Type.INTEGER },
              burnRate: { type: Type.INTEGER },
              twelveMonthROI: { type: Type.INTEGER },
              revenueData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    month: { type: Type.STRING, description: "e.g., Month 1, Month 2..." },
                    revenue: { type: Type.INTEGER },
                    cost: { type: Type.INTEGER },
                  },
                  required: ["month", "revenue", "cost"],
                },
              },
            },
            required: ["threeMonthRevenue", "burnRate", "twelveMonthROI", "revenueData"],
          },
          boardroom: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING, description: "e.g., CEO, CMO, CTO" },
                name: { type: Type.STRING },
                opinion: { type: Type.STRING },
                avatar: { type: Type.STRING, description: "URL to a random avatar image or a short description" },
              },
              required: ["role", "name", "opinion", "avatar"],
            },
          },
          marketing: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                strategy: { type: Type.STRING },
                hooks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 content hooks or ideas" },
                schedule: { type: Type.STRING, description: "Posting schedule, e.g., 3x a week" },
              },
              required: ["platform", "strategy", "hooks", "schedule"],
            },
          },
          verdict: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["summary", "nextSteps", "risks", "roadmap"],
          },
        },
        required: ["metrics", "financials", "boardroom", "marketing", "verdict"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate simulation.");
  }
  return JSON.parse(response.text);
}

export async function simulateDecision(params: { idea: string, currentState: string, revenue: string, teamSize: string, stage: string, decision: string }) {
  const ai = getAI();
  const prompt = `You are an AI Boardroom evaluating a critical startup decision. 
Startup Idea: ${params.idea}
Current State: ${params.currentState}
Monthly Revenue: $${params.revenue}
Team Size: ${params.teamSize}
Stage: ${params.stage}

Proposed Decision: ${params.decision}

Generate 3 realistic outcomes (Best Case, Most Likely, Worst Case) of this decision over the next 6-12 months. The 'impact' field must be 'positive', 'neutral', or 'negative'. Provide 'revenueChange' and 'costChange' as integer percentages (e.g., 20, -10). Provide 'benefits' and 'risks' as arrays of strings. Also include a 'dangerLevel' representing the risk factor (Low, Medium, High, Critical).`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER, description: "1, 2, 3" },
            title: { type: Type.STRING, description: "e.g., Best Case: Rapid Adoption" },
            impact: { type: Type.STRING, description: "positive, neutral, negative" },
            successProbability: { type: Type.INTEGER, description: "0-100" },
            timeframe: { type: Type.STRING, description: "e.g., 6 months" },
            description: { type: Type.STRING },
            revenueChange: { type: Type.INTEGER, description: "e.g., 20 or -15" },
            costChange: { type: Type.INTEGER, description: "e.g., 10 or -5" },
            benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            dangerLevel: { type: Type.STRING, description: "Low, Medium, High, Critical" },
          },
          required: ["id", "title", "impact", "successProbability", "timeframe", "description", "revenueChange", "costChange", "benefits", "risks", "dangerLevel"],
        },
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate decision outcomes.");
  }
  return JSON.parse(response.text);
}
