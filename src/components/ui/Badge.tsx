import React from 'react';
import { twMerge } from 'tailwind-merge';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'info' | 'danger';

const tones: Record<Tone, string> = {
  neutral: 'bg-raised text-muted border-line',
  brand: 'bg-brand-soft text-brand border-brand/30',
  success: 'bg-ok/10 text-ok border-ok/25',
  warning: 'bg-warn/10 text-warn border-warn/25',
  info: 'bg-info/10 text-info border-info/25',
  danger: 'bg-bad/10 text-bad border-bad/25'
};

export function Badge({
  tone = 'neutral',
  children,
  className,
  dot = false





}: {tone?: Tone;children: React.ReactNode;className?: string;dot?: boolean;}) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-5 whitespace-nowrap',
        tones[tone],
        className
      )}>
      
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>);

}

export const statusTone: Record<string, Tone> = {
  approved: 'success',
  selected: 'success',
  supported: 'success',
  resolved: 'success',
  'in-review': 'info',
  review: 'info',
  evaluating: 'info',
  acknowledged: 'info',
  running: 'brand',
  queued: 'neutral',
  draft: 'neutral',
  proposed: 'neutral',
  deprecated: 'neutral',
  blocked: 'danger',
  open: 'warning',
  pass: 'success',
  warn: 'warning',
  fail: 'danger',
  high: 'danger',
  medium: 'warning',
  low: 'neutral'
};

export function StatusBadge({ value, label }: {value: string;label?: string;}) {
  return (
    <Badge tone={statusTone[value] ?? 'neutral'} dot>
      {label ?? value.replace('-', ' ')}
    </Badge>);

}