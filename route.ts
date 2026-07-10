'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  generateGates,
  generateAlerts,
  generateStats,
  generateForecast,
  type Gate,
  type OpsAlert,
} from '@/lib/simulate';
import StatCard from '@/components/StatCard';
import DepartureBoard from '@/components/DepartureBoard';
import QueueChart from '@/components/QueueChart';
import AlertFeed from '@/components/AlertFeed';
import ForecastChart from '@/components/ForecastChart';

const TICK_INTERVAL_MS = 8000;

export default function OpsPage() {
  const [tick, setTick] = useState(0);
  const [gates, setGates] = useState<Gate[]>(() => generateGates(0));
  const [alerts, setAlerts] = useState<OpsAlert[]>(() => generateAlerts(0));
  const [briefing, setBriefing] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setGates(generateGates(tick));
    setAlerts(generateAlerts(tick));
  }, [tick]);

  const stats = generateStats(gates, alerts);

  const generateBriefing = useCallback(async () => {
    setBriefingLoading(true);
    setBriefingError(null);
    try {
      const res = await fetch('/api/ops-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gates, alerts, stats }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setBriefing(data.briefing);
    } catch (err: any) {
      setBriefingError(
        err.message?.includes('ANTHROPIC_API_KEY')
          ? 'No API key configured yet. Add ANTHROPIC_API_KEY to enable AI briefings.'
          : 'Could not generate a briefing right now. Please try again.'
      );
    } finally {
      setBriefingLoading(false);
    }
  }, [gates, alerts, stats]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="scoreboard-text text-xs uppercase tracking-[0.3em] text-gold">
            Staff-Facing Channel
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            Operations Command Copilot
          </h1>
          <p className="mt-2 text-sm text-mist">
            Live venue snapshot, refreshing automatically. Data below is simulated for this demo.
          </p>
        </div>
        <button
          onClick={generateBriefing}
          disabled={briefingLoading}
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-pitchnight transition hover:brightness-110 disabled:opacity-50"
        >
          {briefingLoading ? 'Generating briefing…' : 'Generate AI Briefing'}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Fans in venue" value={stats.totalInVenue.toLocaleString()} />
        <StatCard label="Venue capacity" value={stats.capacityPct} suffix="%" accent="text-gold" />
        <StatCard label="Avg gate wait" value={stats.avgWaitMinutes} suffix="min" />
        <StatCard
          label="Active alerts"
          value={stats.activeIncidents}
          accent={stats.activeIncidents > 0 ? 'text-amber' : 'text-turf'}
        />
      </div>

      {(briefing || briefingError) && (
        <div className="mb-6 rounded-2xl border border-gold/40 bg-gold/5 p-5">
          <h3 className="font-display text-sm tracking-[0.2em] text-gold">
            AI OPERATIONS BRIEFING
          </h3>
          {briefingError ? (
            <p className="mt-2 text-sm text-amber">{briefingError}</p>
          ) : (
            <p className="mt-2 whitespace-pre-line text-sm text-floodlight">{briefing}</p>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <DepartureBoard gates={gates} />
        <AlertFeed alerts={alerts} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <QueueChart gates={gates} />
        <ForecastChart data={generateForecast(tick, stats)} />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-panel/40 p-5 text-sm text-mist">
        Looking for the safety module?{' '}
        <a href="/vision" className="text-gold underline underline-offset-2">
          Try the Safety &amp; Anomaly Triage Copilot →
        </a>
      </div>
    </main>
  );
}
