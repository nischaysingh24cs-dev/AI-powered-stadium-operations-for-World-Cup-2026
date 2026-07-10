export type GateStatus = 'clear' | 'busy' | 'critical';

export interface Gate {
  id: string;
  name: string;
  zone: string;
  waitMinutes: number;
  capacityPct: number;
  status: GateStatus;
}

export type Severity = 'info' | 'warning' | 'critical';

export interface OpsAlert {
  id: string;
  time: string;
  severity: Severity;
  location: string;
  message: string;
}

const GATE_DEFS = [
  { id: 'A', name: 'Gate A — North', zone: 'North Concourse' },
  { id: 'B', name: 'Gate B — East', zone: 'East Concourse' },
  { id: 'C', name: 'Gate C — South', zone: 'South Concourse' },
  { id: 'D', name: 'Gate D — West', zone: 'West Concourse' },
  { id: 'E', name: 'Gate E — VIP', zone: 'Premium Level' },
  { id: 'F', name: 'Gate F — Family', zone: 'North Concourse' },
];

function statusFor(waitMinutes: number): GateStatus {
  if (waitMinutes >= 18) return 'critical';
  if (waitMinutes >= 9) return 'busy';
  return 'clear';
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates a plausible, slightly randomized snapshot of gate conditions.
 * `tick` lets callers advance the simulation over time (e.g. every 8s) so
 * the dashboard feels live without needing a real sensor feed.
 */
export function generateGates(tick = 0): Gate[] {
  return GATE_DEFS.map((g, i) => {
    const base = 4 + i * 2.5;
    const noise = seededRandom(tick * 13.7 + i * 91.3) * 22;
    const wait = Math.max(1, Math.round(base + noise - 6));
    return {
      ...g,
      waitMinutes: wait,
      capacityPct: Math.min(100, Math.round((wait / 25) * 100 + seededRandom(tick + i) * 10)),
      status: statusFor(wait),
    };
  });
}

const ALERT_POOL: Omit<OpsAlert, 'id' | 'time'>[] = [
  { severity: 'warning', location: 'Gate A — North', message: 'Queue building faster than forecast, +40% arrival rate in last 10 min.' },
  { severity: 'critical', location: 'Section 214', message: 'Vision system flagged dense crowd clustering near concession stand.' },
  { severity: 'info', location: 'West Transit Hub', message: 'Shuttle frequency increased to match post-match exit demand.' },
  { severity: 'warning', location: 'Gate C — South', message: 'Bag-check lane 3 running slow, consider reallocating staff.' },
  { severity: 'info', location: 'Medical Point 2', message: 'All medical stations reporting normal capacity.' },
  { severity: 'critical', location: 'Gate B — East', message: 'Unattended item reported, security dispatched for verification.' },
  { severity: 'info', location: 'Fan Zone Plaza', message: 'Weather update: light rain expected in 45 minutes.' },
];

export function generateAlerts(tick = 0, count = 5): OpsAlert[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const pick = ALERT_POOL[Math.floor(seededRandom(tick * 3 + i * 17) * ALERT_POOL.length)];
    const minutesAgo = Math.floor(seededRandom(tick + i * 5) * 25);
    const t = new Date(now.getTime() - minutesAgo * 60000);
    return {
      id: `${tick}-${i}`,
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...pick,
    };
  }).sort((a, b) => (a.severity === 'critical' ? -1 : 1));
}

export interface StadiumStats {
  totalInVenue: number;
  capacityPct: number;
  avgWaitMinutes: number;
  activeIncidents: number;
}

export function generateStats(gates: Gate[], alerts: OpsAlert[]): StadiumStats {
  const avgWait = Math.round(
    gates.reduce((sum, g) => sum + g.waitMinutes, 0) / gates.length
  );
  return {
    totalInVenue: 58210 + Math.round(seededRandom(avgWait) * 4000),
    capacityPct: Math.min(100, Math.round((avgWait / 20) * 60 + 35)),
    avgWaitMinutes: avgWait,
    activeIncidents: alerts.filter((a) => a.severity !== 'info').length,
  };
}

export interface ForecastPoint {
  label: string;
  minutesFromNow: number;
  predictedOccupancyPct: number;
  predictedAvgWait: number;
}

/**
 * Predictive crowd forecast — simulates what a real CV + arrival-rate model
 * would output: a 45-minute look-ahead curve the ops copilot can narrate.
 */
export function generateForecast(tick = 0, stats?: StadiumStats): ForecastPoint[] {
  const baseOccupancy = stats?.capacityPct ?? 60;
  const baseWait = stats?.avgWaitMinutes ?? 8;
  const points: ForecastPoint[] = [];
  for (let i = 0; i <= 9; i++) {
    const minutesFromNow = i * 5;
    const drift = Math.sin((tick + i) * 0.6) * 6;
    const rampToKickoff = i * 2.2; // demand climbs as kickoff approaches
    points.push({
      label: minutesFromNow === 0 ? 'Now' : `+${minutesFromNow}m`,
      minutesFromNow,
      predictedOccupancyPct: Math.max(
        0,
        Math.min(100, Math.round(baseOccupancy + rampToKickoff + drift))
      ),
      predictedAvgWait: Math.max(
        1,
        Math.round(baseWait + rampToKickoff * 0.5 + seededRandom(tick + i) * 4)
      ),
    });
  }
  return points;
}

export interface IncidentScenario {
  id: string;
  label: string;
  camera: string;
  description: string;
}

export const INCIDENT_SCENARIOS: IncidentScenario[] = [
  {
    id: 'crush-risk',
    label: 'Dense crowd clustering',
    camera: 'CAM-214-B · Section 214 Concourse',
    description:
      'Vision model detects a stationary crowd cluster of ~40+ people forming near the concession stand, blocking roughly half the concourse width. Density has increased steadily over the last 6 minutes and flow through the area has dropped to near zero.',
  },
  {
    id: 'unattended-bag',
    label: 'Unattended item',
    camera: 'CAM-B-02 · Gate B Entry Plaza',
    description:
      'A backpack has been left unattended near the Gate B bag-check line for over 8 minutes. No individual has approached it. General foot traffic continues to pass close by.',
  },
  {
    id: 'medical',
    label: 'Possible medical event',
    camera: 'CAM-W-11 · West Concourse, Row 30',
    description:
      'A fan is seen sitting on the ground against a railing, with two other fans crouched near them gesturing toward stadium staff. They have not moved for approximately 3 minutes.',
  },
  {
    id: 'altercation',
    label: 'Verbal altercation',
    camera: 'CAM-S-07 · South Stand, Section 118',
    description:
      'Two groups of fans are standing very close to one another with raised arms and animated gestures. A small ring of onlookers has formed. No physical contact detected yet.',
  },
  {
    id: 'normal',
    label: 'Routine flow (control case)',
    camera: 'CAM-N-04 · North Concourse',
    description:
      'Steady, evenly distributed foot traffic moving in both directions. No clustering, no stationary objects, noise levels consistent with normal matchday ambience.',
  },
];
