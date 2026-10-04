import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { latencyTrend } from '../../data/charts';
import { useChartPalette } from '../../contexts/ThemeContext';

export function LatencyTrendChart({
  height = 260,
  months = 8



}: {height?: number;months?: number;}) {
  const palette = useChartPalette();
  const data = latencyTrend.slice(Math.max(0, latencyTrend.length - months));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={palette.grid} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: palette.axis, fontSize: 11 }}
            axisLine={{ stroke: palette.grid }}
            tickLine={false} />
          
          <YAxis
            tick={{ fill: palette.axis, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={44}
            unit=" ms" />
          
          <Tooltip
            contentStyle={{
              backgroundColor: palette.tooltipBg,
              border: `1px solid ${palette.tooltipBorder}`,
              borderRadius: 10,
              fontSize: 12,
              color: palette.tooltipText
            }}
            labelStyle={{ color: palette.tooltipText, fontWeight: 600 }}
            formatter={(value: number, name: string) => [`${value} ms`, name]} />
          
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: palette.axis, paddingTop: 6 }} />
          
          <defs>
            <linearGradient id="p95Fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.brand} stopOpacity={0.18} />
              <stop offset="100%" stopColor={palette.brand} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="p95"
            name="p95 latency"
            stroke={palette.brand}
            strokeWidth={2}
            fill="url(#p95Fill)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }} />
          
          <Area
            type="monotone"
            dataKey="p50"
            name="p50 latency"
            stroke={palette.info}
            strokeWidth={2}
            fill="transparent"
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }} />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>);

}