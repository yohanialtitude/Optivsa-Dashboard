import React, { useState } from 'react';
import { ChevronRightIcon } from 'lucide-react';

interface Stage {
  name: string;
  state: 'complete' | 'active' | 'pending';
  detail: string;
  meta: string;
}

const stages: Stage[] = [
{
  name: 'Input & environment validation',
  state: 'complete',
  detail:
  'Model version, dataset snapshot, runtime build and hardware profile are checked for completeness and comparability before any trial runs.',
  meta: '6 inputs verified · 1 dataset drift flagged'
},
{
  name: 'Candidate configuration generation',
  state: 'complete',
  detail:
  'Precision, compilation and batching options are expanded into a bounded search space derived from the declared constraints.',
  meta: '128 trials generated from 5 precision options'
},
{
  name: 'Benchmark & trial execution',
  state: 'active',
  detail:
  'Each candidate is measured under recorded environment conditions with repeat runs to expose variance.',
  meta: '71 of 96 trials complete on the active study'
},
{
  name: 'Multi-objective comparison',
  state: 'active',
  detail:
  'Quality, latency, throughput, memory and cost are compared against the declared objective and constraint set.',
  meta: '9 candidates within constraints · 3 breaching'
},
{
  name: 'Recommendation & uncertainty',
  state: 'pending',
  detail:
  'Recommendations are presented with the evidence they rely on, plus confidence and sensitivity context. No global optimum is claimed.',
  meta: 'Awaiting completion of the active trials'
},
{
  name: 'Expert review & selection',
  state: 'pending',
  detail:
  'A named reviewer records the selection, the rationale and the ownership before any deployment step.',
  meta: '2 studies waiting on reviewer decision'
}];


const stateStyles: Record<Stage['state'], string> = {
  complete: 'border-ok/40 bg-ok/10 text-ok',
  active: 'border-brand/40 bg-brand-soft text-brand',
  pending: 'border-line bg-raised text-muted'
};

export function ProcessWidget() {
  const [openIndex, setOpenIndex] = useState(2);

  return (
    <ol className="space-y-1">
      {stages.map((stage, index) => {
        const open = openIndex === index;
        return (
          <li key={stage.name} className="border-b border-line last:border-0">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : index)}
              aria-expanded={open}
              className="flex w-full items-center gap-3 py-3 text-left">
              
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${stateStyles[stage.state]}`}>
                
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-ink">{stage.name}</span>
                <span className="block truncate text-[11px] text-muted">{stage.meta}</span>
              </span>
              <ChevronRightIcon
                className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ease-smooth ${
                open ? 'rotate-90' : ''}`
                } />
              
            </button>
            {open && <p className="pb-3.5 pl-10 pr-2 text-xs leading-relaxed text-muted">{stage.detail}</p>}
          </li>);

      })}
    </ol>);

}