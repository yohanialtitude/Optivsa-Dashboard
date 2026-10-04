import React from "react";
import { ArrowDownRightIcon, ArrowUpRightIcon, BoxIcon } from "lucide-react";
import { Card } from "../ui/Card";
export interface Kpi {
  label: string;
  value: string;
  unit?: string;
  delta: number;
  deltaLabel: string;
  positiveIsGood: boolean;
  icon: BoxIcon;
  spark: number[];
}
function Sparkline({
  points,
  tone



}: {points: number[];tone: string;}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  return <svg viewBox="0 0 100 32" className="h-8 w-20" preserveAspectRatio="none" aria-hidden>
      <polyline points={points.map((point, index) => {
      const x = index / (points.length - 1) * 100;
      const y = 30 - (point - min) / range * 26;
      return `${x},${y}`;
    }).join(' ')} fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>;
}
export function KpiCard({
  kpi,
  featured = false



}: {kpi: Kpi;featured?: boolean;}) {
  const good = kpi.positiveIsGood ? kpi.delta >= 0 : kpi.delta <= 0;
  const Arrow = kpi.delta >= 0 ? ArrowUpRightIcon : ArrowDownRightIcon;
  return <Card as="article" className={`flex h-full flex-col justify-between p-4 sm:p-5 ${featured ? 'border-brand/40 ring-1 ring-brand/15' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-baseline gap-1">
            <span className={`font-semibold tracking-tight text-ink ${featured ? 'text-3xl sm:text-[2rem]' : 'text-2xl'}`}>
              {kpi.value}
            </span>
            {kpi.unit && <span className="text-xs text-muted">{kpi.unit}</span>}
          </p>
          <p className="mt-1 truncate text-sm text-muted">{kpi.label}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <kpi.icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${good ? 'text-ok' : 'text-bad'}`}>
          <Arrow className="h-3.5 w-3.5" />
          {Math.abs(kpi.delta)}%
          <span className="font-normal text-muted">{kpi.deltaLabel}</span>
        </span>
        <Sparkline points={kpi.spark} tone={good ? '#16a34a' : '#f63049'} />
      </div>
    </Card>;
}