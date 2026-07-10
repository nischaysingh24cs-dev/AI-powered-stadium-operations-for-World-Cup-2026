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
    <div className="rounded-2xl border border-border bg-panel/80 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm tracking-[0.2em] text-mist">
          45-MIN CROWD FORECAST
        </h3>
        <span className="text-xs text-mist">predicted venue occupancy</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="occGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A227" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#C9A227" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#25314A" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#93A1BD', fontSize: 11 }}
            axisLine={{ stroke: '#25314A' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#93A1BD', fontSize: 11 }}
            axisLine={{ stroke: '#25314A' }}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: '#111A2E',
              border: '1px solid #25314A',
              borderRadius: 8,
              color: '#F4F7FA',
              fontSize: 12,
            }}
            formatter={(value: number, name: string) =>
              name === 'predictedOccupancyPct' ? [`${value}%`, 'Occupancy'] : [`${value} min`, 'Avg wait']
            }
          />
          <Area
            type="monotone"
            dataKey="predictedOccupancyPct"
            stroke="#C9A227"
            strokeWidth={2}
            fill="url(#occGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
