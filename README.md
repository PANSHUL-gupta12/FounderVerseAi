# 🚀 FounderVerse AI

**🌍 Deployed Project Link:** [https://founder-verse-ai.vercel.app/](https://founder-verse-ai.vercel.app/)

Validate your startup idea before spending a single dollar. 

**FounderVerse AI** acts as your virtual boardroom, using Google's Gemini AI to analyze your idea, project financials, formulate marketing strategies, and simulate critical business decisions.

## ✨ Core Features & How It Works

FounderVerse AI takes a raw startup idea and puts it through a rigorous AI simulation to test its viability before you invest real capital.

### 🧠 The AI Boardroom
Stop making decisions in a vacuum. When you submit your startup idea, FounderVerse AI spins up a virtual "Board of Directors" powered by Gemini. You'll get immediate, contrasting perspectives from different expert personas:
*   **The Skeptical Investor**: Pokes holes in your revenue model and highlights your biggest vulnerabilities.
*   **The Optimistic Visionary**: Identifies your largest growth multipliers and long-term potential.
*   **The Pragmatic Operator**: Focuses strictly on execution, unit economics, and what you need to do tomorrow.

### ⚡ Decision Simulator
Every startup faces critical crossroads (e.g., "Should we pivot to B2B?", "Do we raise a Seed round or bootstrap?"). The Decision Simulator allows you to input your current state (revenue, team size, stage) and your proposed decision. The AI engine runs probability models to predict the **Top 3 Most Likely Outcomes**, explicitly warning you with a calculated **Danger Level** (Low to Critical) for each scenario so you can mitigate risks before they happen.

### 📊 Strategy Developer & Financial Engine
Instead of guessing your budget allocation, the AI Strategy Developer generates:
*   **12-Month Financial Projections**: An interactive chart forecasting your burn rate, 3-month revenue, and break-even point based on your selected pricing model.
*   **Go-To-Market (GTM) Strategy**: A tailored marketing breakdown suggesting exactly which platforms to target based on your specific audience and budget.
*   **Final Verdict**: A harsh but fair concluding assessment providing a 30-day roadmap and your top 3 critical risks.

### 💾 Local Device Storage
Never lose a great idea. All of your simulated startups, financial models, and decision histories are securely saved directly to your browser's local storage. This ensures complete privacy and lets you revisit or iterate on your strategies at any time without needing an account.

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **AI:** Google Gemini REST API (`gemini-2.5-flash`)
- **Data Persistence:** Browser `localStorage`

---

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-username/founderverse-ai.git
   cd founderverse-ai
   npm install
   ```

2. **Setup Environment Variables**  
   Create a `.env` file in the root directory and add your API key. (For local development with Vite, prefix it with `VITE_`. For production deployment with Serverless Functions, use `GEMINI_API_KEY`):
   ```env
   VITE_GEMINI_API_KEY="your_gemini_api_key_here"
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

3. **Run the App**
   ```bash
   npm run dev
   ```

---

## 🌍 Deployment
This project is ready to be deployed on platforms like **Vercel**. 

1. Link your GitHub repository.
2. Ensure the build command is `npm run build`.
3. Add your environment variable (`GEMINI_API_KEY`) in the deployment dashboard's environment settings. (Do NOT use the `VITE_` prefix for the deployment variable, so it remains hidden on the secure backend).
4. Deploy!

*(Note: The AI simulation runs via a secure Serverless Function (`api/simulate.ts`), which completely hides your API key from the frontend and protects your quota from abuse!)*
