import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityIcon, CheckCircle2Icon, LayersIcon, AlertTriangleIcon } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';

export function StatusTiles() {
  const { studies, candidates, exceptions } = useWorkspace();
  const navigate = useNavigate();

  const tiles = [
  {
    label: 'Running studies',
    value: studies.filter((study) => study.status === 'running').length,
    icon: ActivityIcon,
    tone: 'text-brand',
    to: '/studies'
  },
  {
    label: 'Awaiting decision',
    value: studies.filter((study) => study.status === 'review').length,
    icon: LayersIcon,
    tone: 'text-info',
    to: '/candidates'
  },
  {
    label: 'Selected configs',
    value: candidates.filter((candidate) => candidate.selected).length,
    icon: CheckCircle2Icon,
    tone: 'text-ok',
    to: '/decisions'
  },
  {
    label: 'Open exceptions',
    value: exceptions.filter((exception) => exception.state !== 'resolved').length,
    icon: AlertTriangleIcon,
    tone: 'text-warn',
    to: '/benchmarks'
  }];


  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((tile) =>
      <button
        key={tile.label}
        type="button"
        onClick={() => navigate(tile.to)}
        className="rounded-xl border border-line bg-surface p-4 text-left shadow-card transition-[border-color,transform] duration-150 ease-smooth hover:border-brand/40 active:scale-[0.99]">
        
          <span className={`flex items-center justify-between ${tile.tone}`}>
            <span className="text-2xl font-semibold text-ink">{tile.value}</span>
            <tile.icon className="h-4 w-4" aria-hidden />
          </span>
          <span className="mt-1.5 block text-[11px] leading-tight text-muted">{tile.label}</span>
        </button>
      )}
    </div>);

}