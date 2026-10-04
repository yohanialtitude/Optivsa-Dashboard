import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { XIcon, DownloadIcon, GitCompareIcon } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader, EmptyState } from '../components/ui/PageHeader';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Select } from '../components/ui/Field';
import { CandidateTable } from '../components/candidates/CandidateTable';
import { CandidateDrawer } from '../components/candidates/CandidateDrawer';
import { useWorkspace } from '../contexts/WorkspaceContext';
import type { CandidateConfig } from '../types';

type SortKey = 'p95' | 'quality' | 'costPerM' | 'memory';

const metricRows: {
  label: string;
  key: keyof CandidateConfig;
  format: (candidate: CandidateConfig) => string;
  better: 'high' | 'low';
}[] = [
{ label: 'Quality score', key: 'quality', format: (c) => `${c.quality}`, better: 'high' },
{
  label: 'Quality delta',
  key: 'qualityDelta',
  format: (c) => `${c.qualityDelta > 0 ? '+' : ''}${c.qualityDelta} pt`,
  better: 'high'
},
{ label: 'p95 latency', key: 'p95', format: (c) => `${c.p95} ms`, better: 'low' },
{
  label: 'Throughput',
  key: 'throughput',
  format: (c) => `${c.throughput.toLocaleString()} /min`,
  better: 'high'
},
{ label: 'Peak memory', key: 'memory', format: (c) => `${c.memory} GB`, better: 'low' },
{ label: 'Cost / 1M tokens', key: 'costPerM', format: (c) => `$${c.costPerM}`, better: 'low' }];


export function Candidates() {
  const { candidates, compareIds, toggleCompare, clearCompare } = useWorkspace();
  const [study, setStudy] = useState('all');
  const [sort, setSort] = useState<SortKey>('p95');
  const [active, setActive] = useState<CandidateConfig | null>(null);

  const studyOptions = Array.from(new Set(candidates.map((candidate) => candidate.study)));

  const rows = useMemo(() => {
    const filtered =
    study === 'all' ? candidates : candidates.filter((candidate) => candidate.study === study);
    return [...filtered].sort((a, b) =>
    sort === 'quality' ? b.quality - a.quality : (a[sort] as number) - (b[sort] as number)
    );
  }, [candidates, study, sort]);

  const compared = candidates.filter((candidate) => compareIds.includes(candidate.id));

  const bestValue = (key: keyof CandidateConfig, better: 'high' | 'low') => {
    const values = compared.map((candidate) => candidate[key] as number);
    return better === 'high' ? Math.max(...values) : Math.min(...values);
  };

  return (
    <>
      <PageHeader
        eyebrow="Decision intelligence"
        title="Candidate comparison"
        description="Compare up to four configurations on quality, latency, throughput, memory and cost against the declared constraints."
        actions={
        <>
            <Select
            aria-label="Filter by study"
            value={study}
            onChange={(event) => setStudy(event.target.value)}
            className="h-9 w-full text-xs sm:w-auto">
            
              <option value="all">All studies</option>
              {studyOptions.map((option) =>
            <option key={option} value={option}>
                  {option}
                </option>
            )}
            </Select>
            <Select
            aria-label="Sort candidates"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="h-9 w-full text-xs sm:w-auto">
            
              <option value="p95">Lowest p95 latency</option>
              <option value="quality">Highest quality</option>
              <option value="costPerM">Lowest cost</option>
              <option value="memory">Lowest memory</option>
            </Select>
          </>
        } />
      

      <Card>
        <CardHeader
          title={`Comparison · ${compared.length} of 4 slots`}
          subtitle="Best value per metric is highlighted. Highlighting is evidence, not a recommendation."
          actions={
          <>
              <Button
              size="sm"
              variant="secondary"
              icon={DownloadIcon}
              disabled={compared.length === 0}
              onClick={() =>
              toast.success('Comparison exported', {
                description: `${compared.length} configurations with environment conditions.`
              })
              }>
              
                Export
              </Button>
              <Button
              size="sm"
              variant="ghost"
              disabled={compared.length === 0}
              onClick={clearCompare}>
              
                Clear
              </Button>
            </>
          } />
        
        {compared.length === 0 ?
        <EmptyState
          icon={GitCompareIcon}
          title="No configurations in the comparison"
          description="Use the compare action on any candidate row below to place it side by side with others." /> :


        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-44 px-4 py-3 text-left text-[11px] uppercase tracking-wide text-muted">
                    Metric
                  </th>
                  {compared.map((candidate) =>
                <th key={candidate.id} scope="col" className="px-4 py-3 text-left">
                      <span className="flex items-start justify-between gap-2">
                        <span className="min-w-0">
                          <span className="block font-mono text-xs text-ink">{candidate.id}</span>
                          <span className="block text-[11px] text-muted">
                            {candidate.precision} · {candidate.hardware}
                          </span>
                        </span>
                        <button
                      type="button"
                      onClick={() => toggleCompare(candidate.id)}
                      aria-label={`Remove ${candidate.id} from comparison`}
                      className="rounded-md p-1 text-muted transition-colors duration-150 ease-smooth hover:text-bad">
                      
                          <XIcon className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    </th>
                )}
                </tr>
              </thead>
              <tbody>
                {metricRows.map((row) => {
                const best = bestValue(row.key, row.better);
                return (
                  <tr key={row.label} className="border-b border-line last:border-0">
                      <th scope="row" className="px-4 py-2.5 text-left text-xs font-normal text-muted">
                        {row.label}
                      </th>
                      {compared.map((candidate) => {
                      const isBest = candidate[row.key] as number === best;
                      return (
                        <td
                          key={candidate.id}
                          className={`px-4 py-2.5 text-xs ${
                          isBest ? 'font-semibold text-brand' : 'text-ink'}`
                          }>
                          
                            {row.format(candidate)}
                          </td>);

                    })}
                    </tr>);

              })}
                <tr className="border-b border-line last:border-0">
                  <th scope="row" className="px-4 py-2.5 text-left text-xs font-normal text-muted">
                    Constraints
                  </th>
                  {compared.map((candidate) =>
                <td key={candidate.id} className="px-4 py-2.5">
                      <StatusBadge value={candidate.constraint} />
                    </td>
                )}
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-2.5 text-left text-xs font-normal text-muted">
                    Decision
                  </th>
                  {compared.map((candidate) =>
                <td key={candidate.id} className="px-4 py-2.5">
                      <Button size="sm" variant="secondary" onClick={() => setActive(candidate)}>
                        Review
                      </Button>
                    </td>
                )}
                </tr>
              </tbody>
            </table>
          </div>
        }
      </Card>

      <Card>
        <CardHeader
          title="All candidate configurations"
          subtitle={`${rows.length} configurations · sorted by ${
          sort === 'p95' ?
          'p95 latency' :
          sort === 'quality' ?
          'quality' :
          sort === 'costPerM' ?
          'cost' :
          'memory'}`
          } />
        
        <CandidateTable rows={rows} onOpen={setActive} />
      </Card>

      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
            <Badge tone="success" dot>
              pass
            </Badge>
            <span>all declared constraints satisfied</span>
            <Badge tone="warning" dot>
              warn
            </Badge>
            <span>within tolerance of a limit</span>
            <Badge tone="danger" dot>
              fail
            </Badge>
            <span>constraint breached — selection blocked</span>
          </div>
        </CardBody>
      </Card>

      <CandidateDrawer candidate={active} onClose={() => setActive(null)} />
    </>);

}