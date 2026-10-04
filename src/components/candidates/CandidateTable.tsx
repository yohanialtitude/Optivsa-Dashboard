import React from 'react';
import { CheckIcon, EyeIcon, GitCompareIcon } from 'lucide-react';
import { Badge, StatusBadge } from '../ui/Badge';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import type { CandidateConfig } from '../../types';

export function CandidateTable({
  rows,
  onOpen,
  compact = false




}: {rows: CandidateConfig[];onOpen: (candidate: CandidateConfig) => void;compact?: boolean;}) {
  const { compareIds, toggleCompare } = useWorkspace();

  return (
    <>
      <div className="space-y-3 p-4 sm:hidden">
        {rows.map((row) =>
        <article key={row.id} className="rounded-lg border border-line bg-raised p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-xs text-ink">{row.id}</span>
                  <Badge tone="neutral" className="font-mono">{row.precision}</Badge>
                  {row.selected && <Badge tone="brand">Selected</Badge>}
                </div>
                <p className="mt-1 text-[11px] text-muted">{row.compiler}</p>
              </div>
              <StatusBadge value={row.constraint} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <p className="text-[11px] text-muted">Model / study</p>
                <p className="truncate text-ink">{row.model}</p>
                <p className="truncate text-[11px] text-muted">{row.study}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Runtime</p>
                <p className="truncate text-ink">{row.runtime}</p>
                <p className="truncate text-[11px] text-muted">{row.hardware}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Quality</p>
                <p className="text-ink">{row.quality} <span className="text-muted">({row.qualityDelta > 0 ? '+' : ''}{row.qualityDelta} pt)</span></p>
              </div>
              <div>
                <p className="text-[11px] text-muted">p95 latency</p>
                <p className="text-ink">{row.p95} ms</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1 border-t border-line pt-2">
              <button
                type="button"
                onClick={() => toggleCompare(row.id)}
                aria-label={`${compareIds.includes(row.id) ? 'Remove' : 'Add'} ${row.id} ${compareIds.includes(row.id) ? 'from' : 'to'} comparison`}
                className={`rounded-md p-1.5 transition-colors duration-150 ease-smooth hover:bg-brand-soft ${compareIds.includes(row.id) ? 'text-brand' : 'text-muted hover:text-brand'}`}>
                <GitCompareIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpen(row)}
                aria-label={`View evidence for ${row.id}`}
                className="rounded-md p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-brand-soft hover:text-brand">
                <EyeIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpen(row)}
                aria-label={`Review and select ${row.id}`}
                disabled={row.constraint === 'fail'}
                className="rounded-md p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-brand-soft hover:text-brand disabled:pointer-events-none disabled:opacity-40">
                <CheckIcon className="h-4 w-4" />
              </button>
            </div>
          </article>
        )}
      </div>

      <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-[820px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
            <th scope="col" className="px-4 py-2.5 font-medium">
              Configuration
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Model / study
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Runtime
            </th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">
              Quality
            </th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">
              p95
            </th>
            {!compact &&
            <>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Memory
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  Cost / 1M
                </th>
              </>
            }
            <th scope="col" className="px-4 py-2.5 font-medium">
              Constraints
            </th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
          <tr
            key={row.id}
            className="border-b border-line last:border-0 transition-colors duration-150 ease-smooth hover:bg-raised">
            
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-ink">{row.id}</span>
                  <Badge tone="neutral" className="font-mono">
                    {row.precision}
                  </Badge>
                  {row.selected && <Badge tone="brand">Selected</Badge>}
                </div>
                <p className="mt-0.5 text-[11px] text-muted">{row.compiler}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-xs text-ink">{row.model}</p>
                <p className="text-[11px] text-muted">{row.study}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-xs text-ink">{row.runtime}</p>
                <p className="text-[11px] text-muted">{row.hardware}</p>
              </td>
              <td className="px-4 py-3 text-right">
                <p className="text-xs font-medium text-ink">{row.quality}</p>
                <p
                className={`text-[11px] ${
                row.qualityDelta < -1 ? 'text-bad' : 'text-muted'}`
                }>
                
                  {row.qualityDelta > 0 ? '+' : ''}
                  {row.qualityDelta} pt
                </p>
              </td>
              <td className="px-4 py-3 text-right text-xs text-ink">{row.p95} ms</td>
              {!compact &&
            <>
                  <td className="px-4 py-3 text-right text-xs text-ink">{row.memory} GB</td>
                  <td className="px-4 py-3 text-right text-xs text-ink">${row.costPerM}</td>
                </>
            }
              <td className="px-4 py-3">
                <StatusBadge value={row.constraint} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                  type="button"
                  onClick={() => toggleCompare(row.id)}
                  aria-label={`${compareIds.includes(row.id) ? 'Remove' : 'Add'} ${row.id} ${
                  compareIds.includes(row.id) ? 'from' : 'to'} comparison`
                  }
                  className={`rounded-md p-1.5 transition-colors duration-150 ease-smooth hover:bg-brand-soft ${
                  compareIds.includes(row.id) ? 'text-brand' : 'text-muted hover:text-brand'}`
                  }>
                  
                    <GitCompareIcon className="h-4 w-4" />
                  </button>
                  <button
                  type="button"
                  onClick={() => onOpen(row)}
                  aria-label={`View evidence for ${row.id}`}
                  className="rounded-md p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-brand-soft hover:text-brand">
                  
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                  type="button"
                  onClick={() => onOpen(row)}
                  aria-label={`Review and select ${row.id}`}
                  disabled={row.constraint === 'fail'}
                  className="rounded-md p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-brand-soft hover:text-brand disabled:pointer-events-none disabled:opacity-40">
                  
                    <CheckIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </>);

}