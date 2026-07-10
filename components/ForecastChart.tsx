'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { ForecastPoint } from '@/lib/simulate';

export default function ForecastChart({ data }: { data: ForecastPoint[] }) {
  return (
    <div className="rounded-lg bg-panel border border-border p-4">
      <h3 className="text-xs uppercase tracking-wider text-mist mb-1">45-MIN CROWD FORECAST</h3>
      <p className="text-[10px] text-mist mb-4">predicted venue occupancy</p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A227" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#25314A" />
          <XAxis dataKey="label" tick={{ fill: '#93A1BD', fontSize: 11 }} />
          <YAxis tick={{ fill: '#93A1BD', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111A2E', border: '1px solid #25314A', borderRadius: 8 }}
            formatter={(value: number, name: string) =>
              name === 'predictedOccupancyPct' ? [`${value}%`, 'Occupancy'] : [`${value} min`, 'Avg wait']
            }
          />
          <Area
            type="monotone"
            dataKey="predictedOccupancyPct"
            stroke="#C9A227"
            fill="url(#occGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
