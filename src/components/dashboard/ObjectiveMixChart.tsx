import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { objectiveMix } from '../../data/charts';

export function ObjectiveMixChart() {
  const [active, setActive] = useState(0);
  const total = objectiveMix.reduce((sum, item) => sum + item.value, 0);
  const current = objectiveMix[active];

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative h-52 w-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={objectiveMix}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
              onClick={(_, index) => setActive(index)}>
              
              {objectiveMix.map((entry, index) =>
              <Cell
                key={entry.name}
                fill={entry.color}
                opacity={index === active ? 1 : 0.42}
                className="cursor-pointer outline-none" />

              )}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-semibold text-ink">
            {Math.round(current.value / total * 100)}%
          </span>
          <span className="mt-0.5 max-w-[5.5rem] text-[11px] leading-tight text-muted">
            {current.name}
          </span>
        </div>
      </div>
      <ul className="w-full space-y-1.5">
        {objectiveMix.map((entry, index) =>
        <li key={entry.name}>
            <button
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={index === active}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ease-smooth ${
            index === active ? 'bg-raised' : 'hover:bg-raised'}`
            }>
            
              <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.color }}
              aria-hidden />
            
              <span className="min-w-0 flex-1 truncate text-xs text-ink">{entry.name}</span>
              <span className="shrink-0 text-xs font-medium text-muted">{entry.value}</span>
            </button>
          </li>
        )}
      </ul>
    </div>);

}