import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { trialThroughput } from '../../data/charts';
import { useChartPalette } from '../../contexts/ThemeContext';

export function TrialVolumeChart({
  height = 260,
  months = 8



}: {height?: number;months?: number;}) {
  const palette = useChartPalette();
  const data = trialThroughput.slice(Math.max(0, trialThroughput.length - months));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
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
            width={44} />
          
          <Tooltip
            cursor={{ fill: palette.grid, opacity: 0.5 }}
            contentStyle={{
              backgroundColor: palette.tooltipBg,
              border: `1px solid ${palette.tooltipBorder}`,
              borderRadius: 10,
              fontSize: 12,
              color: palette.tooltipText
            }}
            labelStyle={{ color: palette.tooltipText, fontWeight: 600 }} />
          
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: palette.axis, paddingTop: 6 }} />
          
          <Bar
            dataKey="completed"
            name="Valid trials"
            fill={palette.brand}
            radius={[3, 3, 0, 0]}
            maxBarSize={14} />
          
          <Bar
            dataKey="invalidated"
            name="Invalidated"
            fill={palette.info}
            radius={[3, 3, 0, 0]}
            maxBarSize={14} />
          
        </BarChart>
      </ResponsiveContainer>
    </div>);

}