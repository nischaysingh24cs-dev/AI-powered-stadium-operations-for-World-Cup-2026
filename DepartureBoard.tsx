'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import type { Gate } from '@/lib/simulate';

const COLOR: Record<Gate['status'], string> = {
  clear: '#16A34A',
  busy: '#F5A524',
  critical: '#E5484D',
};

export default function QueueChart({ gates }: { gates: Gate[] }) {
  return (
    <div className="rounded-2xl border border-border bg-panel/80 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm tracking-[0.2em] text-mist">
          WAIT TIME BY GATE
        </h3>
        <span className="text-xs text-mist">minutes, next 15 min forecast</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={gates} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#25314A" vertical={false} />
          <XAxis
            dataKey="id"
            tick={{ fill: '#93A1BD', fontSize: 12 }}
            axisLine={{ stroke: '#25314A' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#93A1BD', fontSize: 12 }}
            axisLine={{ stroke: '#25314A' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#111A2E',
              border: '1px solid #25314A',
              borderRadius: 8,
              color: '#F4F7FA',
              fontSize: 12,
            }}
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload?.name ?? label
            }
          />
          <Bar dataKey="waitMinutes" radius={[4, 4, 0, 0]}>
            {gates.map((g) => (
              <Cell key={g.id} fill={COLOR[g.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
