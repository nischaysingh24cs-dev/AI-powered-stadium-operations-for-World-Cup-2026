# 🏟️ Stadium Copilot — GenAI Smart Stadium & Tournament Operations

### Built for the FIFA World Cup 2026 "Smart Stadiums & Tournament Operations" challenge

Stadium Copilot is a working GenAI platform with three connected experiences:

- **Fan Concierge** (/concierge) — multilingual AI chat assistant (40+ languages)
- **Operations Command Copilot** (/ops) — live dashboard with AI-generated operations briefings
- **Safety & Anomaly Triage Copilot** (/vision) — vision-language triage with human-in-the-loop dispatch

## Run locally

1. npm install
2. cp .env.example .env.local
3. Edit .env.local and add your Gemini API key from https://aistudio.google.com/apikey
4. npm run dev
5. Open http://localhost:3000

## Deploy on Vercel

1. Import repo on vercel.com
2. Add environment variable: GEMINI_API_KEY (from https://aistudio.google.com/apikey)
3. Deploy

## Project Structure

- app/api/concierge/route.ts — Fan Concierge API
- app/api/ops-summary/route.ts — Ops Briefing API
- app/api/triage/route.ts — Safety Triage API
- app/concierge/page.tsx — Fan Concierge chat UI
- app/vision/page.tsx — Safety and Vision triage UI
- app/ops/page.tsx — Operations Command dashboard
- app/layout.tsx — Root layout
- app/page.tsx — Home page
- app/globals.css — Tailwind and custom styles
- components/AlertFeed.tsx — Live alert feed
- components/DepartureBoard.tsx — Gate status board
- components/ForecastChart.tsx — 45-min crowd forecast chart
- components/Nav.tsx — Navigation bar
- components/QueueChart.tsx — Wait time bar chart
- components/StatCard.tsx — Stat display card
- lib/ai.ts — Gemini AI client setup
- lib/simulate.ts — Gate/alert/forecast simulation
- package.json
- next.config.js
- tailwind.config.js
- postcss.config.js
- tsconfig.json
- .env.example

## Tech Stack

- Framework: Next.js 14 (App Router)
- AI / LLM: Google Gemini API
- Charts: Recharts
- Styling: Tailwind CSS
- Language: TypeScript
- Deployment: Vercel

## Environment Variables

- GEMINI_API_KEY (required) — Your Google Gemini API key from https://aistudio.google.com/apikey

## License

MIT
