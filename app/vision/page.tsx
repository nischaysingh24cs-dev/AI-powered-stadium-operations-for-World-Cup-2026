'use client';

import { useState } from 'react';
import { INCIDENT_SCENARIOS, type IncidentScenario } from '@/lib/simulate';

interface TriageResult {
  severity: string;
  riskScore: number;
  category: string;
  recommendedAction: string;
  dispatchRecommended: boolean;
}

export default function VisionPage() {
  const [selected, setSelected] = useState<IncidentScenario | null>(null);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const runTriage = async (scenario: IncidentScenario) => {
    setSelected(scenario);
    setTriageResult(null);
    setError(null);
    setConfirmed(false);
    setLoading(true);

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: scenario.description, camera: scenario.camera }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setTriageResult(data);
    } catch (err: any) {
      setError(
        err.message?.includes('ANTHROPIC_API_KEY')
          ? 'No API key configured. Add ANTHROPIC_API_KEY to enable AI triage.'
          : 'Could not run triage. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = () => {
    setConfirmed(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div>
        <p className="text-xs text-mist uppercase tracking-wider mb-1">Safety &amp; Anomaly Channel</p>
        <h1 className="text-2xl font-display font-bold text-floodlight">Safety &amp; Anomaly Triage Copilot</h1>
        <p className="text-sm text-mist mt-1">
          Simulates the last mile of a vision-language-model pipeline. Select a scenario to run AI triage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {INCIDENT_SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => runTriage(s)}
            className={`text-left rounded-lg border p-4 transition-colors ${
              selected?.id === s.id
                ? 'border-gold bg-gold/10'
                : 'border-border bg-panel hover:border-gold/50'
            }`}
          >
            <h3 className="font-display font-bold text-floodlight text-sm mb-1">{s.label}</h3>
            <p className="text-xs text-mist">{s.camera}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="rounded-lg bg-panel border border-border p-4 space-y-3">
          <h3 className="font-display font-bold text-floodlight">{selected.label}</h3>
          <p className="text-xs text-mist font-mono">{selected.camera}</p>
          <p className="text-sm text-floodlight leading-relaxed">{selected.description}</p>
        </div>
      )}

      {loading && (
        <div className="rounded-lg bg-panel border border-gold/30 p-4 text-center">
          <p className="text-gold text-sm animate-pulse">Running AI triage…</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-panel border border-critical/30 p-4">
          <p className="text-critical text-sm">{error}</p>
        </div>
      )}

      {triageResult && (
        <div className="rounded-lg bg-panel border border-border p-4 space-y-3">
          <h3 className="font-display font-bold text-floodlight">AI Triage Result</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-panel2 rounded p-3">
              <p className="text-xs text-mist uppercase">Severity</p>
              <p className={`font-bold text-lg ${
                triageResult.severity === 'critical' ? 'text-critical' :
                triageResult.severity === 'high' ? 'text-amber' : 'text-turf'
              }`}>{triageResult.severity}</p>
            </div>
            <div className="bg-panel2 rounded p-3">
              <p className="text-xs text-mist uppercase">Risk Score</p>
              <p className="font-bold text-lg text-floodlight">{triageResult.riskScore}/10</p>
            </div>
            <div className="bg-panel2 rounded p-3">
              <p className="text-xs text-mist uppercase">Category</p>
              <p className="font-bold text-sm text-floodlight">{triageResult.category}</p>
            </div>
            <div className="bg-panel2 rounded p-3">
              <p className="text-xs text-mist uppercase">Dispatch</p>
              <p className={`font-bold text-sm ${triageResult.dispatchRecommended ? 'text-critical' : 'text-turf'}`}>
                {triageResult.dispatchRecommended ? 'Recommended' : 'Not needed'}
              </p>
            </div>
          </div>
          <div className="bg-panel2 rounded p-3">
            <p className="text-xs text-mist uppercase mb-1">Recommended Action</p>
            <p className="text-floodlight text-sm">{triageResult.recommendedAction}</p>
          </div>

          {triageResult.dispatchRecommended && !confirmed && (
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleDispatch}
                className="px-4 py-2 rounded-lg bg-critical text-floodlight font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Confirm Dispatch
              </button>
              <span className="text-xs text-mist">Human-in-the-loop confirmation required before dispatch</span>
            </div>
          )}
          {confirmed && (
            <div className="rounded-lg bg-turf/10 border border-turf/30 p-3">
              <p className="text-turf text-sm font-bold">✅ Dispatch confirmed. Security team notified.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
