import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BoxesIcon,
  DatabaseIcon,
  CpuIcon,
  TargetIcon,
  ShieldCheckIcon,
  PlugIcon } from
'lucide-react';

const inputs = [
{
  icon: BoxesIcon,
  label: 'Models & version records',
  value: '142 records · 7 families',
  to: '/registry'
},
{
  icon: DatabaseIcon,
  label: 'Evaluation datasets & tasks',
  value: '38 pinned snapshots',
  to: '/registry'
},
{
  icon: CpuIcon,
  label: 'Runtime & hardware profiles',
  value: '6 profiles · 4 proposed',
  to: '/runtimes'
},
{
  icon: TargetIcon,
  label: 'Business & technical objectives',
  value: '4 objective templates',
  to: '/studies'
},
{
  icon: ShieldCheckIcon,
  label: 'Constraints & approval policies',
  value: 'Human approval required',
  to: '/settings'
},
{
  icon: PlugIcon,
  label: 'Existing experiment systems',
  value: '3 connected trackers',
  to: '/settings'
}];


export function InputLayerWidget() {
  const navigate = useNavigate();

  return (
    <ul className="divide-y divide-line">
      {inputs.map((input) =>
      <li key={input.label}>
          <button
          type="button"
          onClick={() => navigate(input.to)}
          className="flex w-full items-center gap-3 py-3 text-left transition-colors duration-150 ease-smooth hover:bg-raised">
          
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-raised text-muted">
              <input.icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-ink">{input.label}</span>
              <span className="block truncate text-[11px] text-muted">{input.value}</span>
            </span>
          </button>
        </li>
      )}
    </ul>);

}