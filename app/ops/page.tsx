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
  const [gates, setGates] = useState(() => generateGates(0));
  const [alerts, setAlerts] = useState(() => generateAlerts(0));
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
  const forecast = generateForecast(tick, stats);

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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-mist uppercase tracking-wider mb-1">Staff-Facing Channel</p>
          <h1 className="text-2xl font-display font-bold text-floodlight">Operations Command Copilot</h1>
          <p className="text-sm text-mist mt-1">
            Live venue snapshot, refreshing automatically. Data below is simulated for this demo.
          </p>
        </div>
        <button
          onClick={generateBriefing}
          disabled={briefingLoading}
          className="px-4 py-2 rounded-lg bg-gold text-pitchnight font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {briefingLoading ? 'Generating briefing…' : 'Generate AI Briefing'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="In Venue" value={stats.totalInVenue.toLocaleString()} accent="text-floodlight" />
        <StatCard label="Capacity" value={stats.capacityPct} suffix="%" accent={stats.capacityPct > 80 ? 'text-amber' : 'text-turf'} />
        <StatCard label="Avg Wait" value={stats.avgWaitMinutes} suffix="min" accent={stats.avgWaitMinutes > 12 ? 'text-critical' : 'text-floodlight'} />
        <StatCard label="Active Incidents" value={stats.activeIncidents} accent={stats.activeIncidents > 0 ? 'text-amber' : 'text-turf'} />
      </div>

      {(briefing || briefingError) && (
        <div className="rounded-lg bg-panel2 border border-gold/30 p-4">
          <h3 className="text-xs uppercase tracking-wider text-gold mb-2">AI OPERATIONS BRIEFING</h3>
          {briefingError ? (
            <p className="text-critical text-sm">{briefingError}</p>
          ) : (
            <p className="text-floodlight text-sm whitespace-pre-line">{briefing}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QueueChart gates={gates} />
        <ForecastChart data={forecast} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DepartureBoard gates={gates} />
        <AlertFeed alerts={alerts} />
      </div>

      <p className="text-xs text-mist text-center pt-4">
        Looking for the safety module?{' '}
        <a href="/vision" className="text-gold hover:underline">
          Try the Safety &amp; Anomaly Triage Copilot →
        </a>
      </p>
    </div>
  );
}
