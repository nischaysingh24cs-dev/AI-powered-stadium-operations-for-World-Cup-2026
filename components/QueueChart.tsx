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

const COLOR: Record<string, string> = {
  clear: '#16A34A',
  busy: '#F5A524',
  critical: '#E5484D',
};

export default function QueueChart({ gates }: { gates: Gate[] }) {
  const data = gates.map((g) => ({
    name: `Gate ${g.id}`,
    wait: g.waitMinutes,
    status: g.status,
  }));

  return (
    <div className="rounded-lg bg-panel border border-border p-4">
      <h3 className="text-xs uppercase tracking-wider text-mist mb-3">WAIT TIME BY GATE</h3>
      <p className="text-[10px] text-mist mb-4">minutes, next 15 min forecast</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#25314A" />
          <XAxis dataKey="name" tick={{ fill: '#93A1BD', fontSize: 11 }} />
          <YAxis tick={{ fill: '#93A1BD', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111A2E', border: '1px solid #25314A', borderRadius: 8 }}
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload?.name ?? label
            }
          />
          <Bar dataKey="wait" radius={[4, 4, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={COLOR[entry.status] || '#93A1BD'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
