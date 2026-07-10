# 🏟️ Stadium Copilot — GenAI Smart Stadium & Tournament Operations
### Built for the FIFA World Cup 2026 "Smart Stadiums & Tournament Operations" challenge

Stadium Copilot is a working GenAI platform with three connected experiences built on
one shared intelligence layer:

- **Fan Concierge** (`/concierge`) — a multilingual AI chat assistant (40+ languages)
  that helps fans with wayfinding, policies, transit, and accessibility, powered live
  by the Claude API.
- **Operations Command Copilot** (`/ops`) — a real-time-feeling staff dashboard with
  live gate wait times, a 45-minute crowd forecast, an alert feed, and an **AI-generated
  operations briefing** button that turns a raw operational snapshot into a
  plain-language summary + recommended actions for a shift supervisor.
- **Safety & Anomaly Triage Copilot** (`/vision`) — simulates the last mile of a
  vision-language-model pipeline: takes a natural-language "what the camera sees"
  description and returns a structured severity/risk/recommended-action triage, with
  a human-in-the-loop confirmation step before any "dispatch."

This repo is fully functional: clone it, add one API key, and all three experiences
work end to end. Live sensor/CCTV/ticketing feeds are simulated (`lib/simulate.ts`)
so the demo runs anywhere without real stadium infrastructure — but every AI response
is a **real call to the Anthropic API**, not a canned string.

---

## 1. Run it locally

```bash
git clone <your-repo-url>
cd smart-stadium-copilot
npm install
cp .env.example .env.local
# edit .env.local and paste your key from https://console.anthropic.com/settings/keys
npm run dev
```

Open **http://localhost:3000**.

---

## 2. Push to your own GitHub repo

```bash
cd smart-stadium-copilot
git init
git add .
git commit -m "Stadium Copilot: GenAI smart stadium operations platform"
git branch -M main
git remote add origin https://github.com/<your-username>/smart-stadium-copilot.git
git push -u origin main
```

(Create the empty repo on GitHub first via "New repository" — don't initialize it
with a README so the push above doesn't conflict.)

---

## 3. Deploy it live (Vercel — free, ~2 minutes)

1. Go to **https://vercel.com/new** and sign in with GitHub.
2. Click **Import** next to your `smart-stadium-copilot` repo.
3. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key from https://console.anthropic.com/settings/keys
4. Click **Deploy**. Vercel auto-detects Next.js — no config needed.
5. You'll get a live URL like `https://smart-stadium-copilot.vercel.app`.

**That's your two submission links:**
- GitHub repo: `https://github.com/<your-username>/smart-stadium-copilot`
- Deployed app: `https://smart-stadium-copilot.vercel.app`

> No Vercel account? Netlify and Render both also support Next.js with the same
> "import from GitHub + set env var" flow.

---

## 3b. If you don't have an Anthropic API key yet

Create one free at **https://console.anthropic.com/settings/keys**. The app still
loads and looks complete without a key — the chat and briefing panels will show a
clear inline message telling the evaluator a key is needed, rather than crashing.

---

## 4. What to say in your submission write-up

**Problem:** World Cup 2026 stadiums (60k–90k fans, 48+ countries, 104 matches) create
real-time operational and language complexity that static systems can't handle.

**Solution:** One GenAI orchestration layer, two interfaces:
- Fans get a grounded, multilingual concierge instead of static signage/FAQs.
- Staff get an AI copilot that fuses siloed data (queues, alerts, capacity) into a
  short, actionable briefing in seconds instead of manual cross-checking.

**Why it's GenAI, not just a dashboard:** the value isn't the chart — any BI tool
draws a bar chart. The value is the **reasoning layer** that reads live, messy,
multi-source data and produces language a human can act on immediately, in their own
language, under time pressure. See `app/api/chat/route.ts` and
`app/api/ops-summary/route.ts` for the actual prompts driving this.

**Production path:** swap `lib/simulate.ts` for real feeds (CCTV/computer vision,
IoT occupancy sensors, ticketing system, transit APIs) — the AI layer and UI don't
need to change, since they're already built against a clean data contract
(`Gate`, `OpsAlert`, `StadiumStats` types in `lib/simulate.ts`).

---

## Tech stack

- **Next.js 14** (App Router, TypeScript) — one codebase, trivially deployable
- **Anthropic API** (`@anthropic-ai/sdk`) — powers both the concierge and the ops briefing
- **Tailwind CSS** — stadium-at-night visual system (floodlight/turf/scoreboard theme)
- **Recharts** — live queue visualization

## Project structure

```
app/
  page.tsx                     → landing / overview
  concierge/page.tsx            → fan-facing multilingual chat UI
  ops/page.tsx                   → staff-facing command center dashboard
  vision/page.tsx                → safety & anomaly triage copilot UI
  api/chat/route.ts              → Claude-powered concierge endpoint
  api/ops-summary/route.ts       → Claude-powered briefing generator
  api/vision-triage/route.ts     → Claude-powered structured triage endpoint
components/                      → DepartureBoard, QueueChart, ForecastChart, AlertFeed, StatCard, Nav
lib/
  simulate.ts                    → mock live gate/alert/forecast/scenario generator (swap for real feeds)
  anthropic.ts                    → shared Anthropic client
```

## Roadmap beyond this MVP

1. Replace simulated data with real CV/IoT/ticketing feeds.
2. Add a vision-language model pass on CCTV frames for anomaly description (safety
   module), with human-in-the-loop confirmation before any dispatch action.
3. Add push notifications / SMS / WhatsApp channel for the concierge.
4. Add role-based access + audit logging for the ops command center.

---

Built for the **Smart Stadiums & Tournament Operations** challenge — FIFA World Cup 2026.
