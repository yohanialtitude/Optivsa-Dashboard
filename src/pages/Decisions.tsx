import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis } from
'recharts';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { PageHeader, EmptyState } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Field';
import { sensitivityBands, tradeOffPoints } from '../data/charts';
import { useChartPalette } from '../contexts/ThemeContext';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { toast } from 'sonner';
import { ClipboardListIcon } from 'lucide-react';

const decisionTone: Record<string, 'success' | 'danger' | 'warning' | 'neutral'> = {
  Selected: 'success',
  Rejected: 'danger',
  Deferred: 'warning',
  'Rolled back': 'neutral'
};

export function Decisions() {
  const palette = useChartPalette();
  const { decisions, candidates } = useWorkspace();
  const [filter, setFilter] = useState('all');

  const rows = useMemo(
    () => filter === 'all' ? decisions : decisions.filter((item) => item.decision === filter),
    [decisions, filter]
  );

  const recommended = candidates.
  filter((candidate) => candidate.constraint === 'pass').
  sort((a, b) => a.p95 - b.p95)[0];

  return (
    <>
      <PageHeader
        eyebrow="Decision intelligence engine"
        title="Trade-offs, recommendations & decisions"
        description="Recommendations are evidence-linked and carry uncertainty. A named reviewer records every selection."
        actions={
        <Button
          variant="secondary"
          icon={ClipboardListIcon}
          onClick={() =>
          toast.success('Decision log exported', {
            description: 'Rationale, owner and reviewer included for each entry.'
          })
          }>
          
            Export decision log
          </Button>
        } />
      

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader
            title="Quality versus latency trade-off"
            subtitle="Bubble size reflects cost per 1M tokens" />
          
          <CardBody>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 12, left: -16, bottom: 4 }}>
                  <CartesianGrid stroke={palette.grid} />
                  <XAxis
                    type="number"
                    dataKey="p95"
                    name="p95 latency"
                    unit=" ms"
                    tick={{ fill: palette.axis, fontSize: 11 }}
                    axisLine={{ stroke: palette.grid }}
                    tickLine={false} />
                  
                  <YAxis
                    type="number"
                    dataKey="quality"
                    name="Quality"
                    domain={[83, 94]}
                    tick={{ fill: palette.axis, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={48} />
                  
                  <ZAxis type="number" dataKey="cost" range={[80, 420]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: palette.tooltipBg,
                      border: `1px solid ${palette.tooltipBorder}`,
                      borderRadius: 10,
                      fontSize: 12,
                      color: palette.tooltipText
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                    labelFormatter={() => ''} />
                  
                  <Scatter
                    data={tradeOffPoints}
                    name="Candidates"
                    fill={palette.brand}
                    fillOpacity={0.55}
                    stroke={palette.brand} />
                  
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] text-muted">
              No point is globally optimal. Each position is valid only for its recorded environment
              and dataset snapshot.
            </p>
          </CardBody>
        </Card>

        <div className="space-y-4 xl:col-span-5">
          <Card>
            <CardHeader title="Current recommendation" subtitle="Presented as evidence for review" />
            <CardBody className="space-y-3">
              {recommended ?
              <>
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm text-ink">{recommended.id}</span>
                    <Badge tone="brand">{recommended.precision}</Badge>
                    <Badge tone="neutral">{recommended.hardware}</Badge>
                  </p>
                  <ul className="space-y-1.5 text-xs text-muted">
                    <li>
                      Satisfies all declared constraints with a {recommended.qualityDelta} pt quality
                      delta.
                    </li>
                    <li>
                      p95 {recommended.p95} ms at batch {recommended.batch} on{' '}
                      {recommended.runtime}.
                    </li>
                    <li>
                      Confidence reported as {recommended.confidence} from repeat-run variance.
                    </li>
                  </ul>
                  <p className="rounded-lg border border-line bg-brand-soft px-3 py-2.5 text-[11px] text-ink">
                    This is a recommendation, not a guaranteed optimum. Selection requires reviewer
                    approval.
                  </p>
                </> :

              <p className="text-xs text-muted">No candidate currently satisfies all constraints.</p>
              }
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Sensitivity & scenarios" subtitle="How results move with each factor" />
            <CardBody>
              <ul className="space-y-3">
                {sensitivityBands.map((band) => {
                  const span = Math.max(Math.abs(band.low), Math.abs(band.high));
                  return (
                    <li key={band.factor}>
                      <p className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-ink">{band.factor}</span>
                        <span className="font-mono text-muted">
                          {band.low}% / +{band.high}%
                        </span>
                      </p>
                      <div className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-raised">
                        <span className="flex w-1/2 justify-end">
                          <span
                            className="h-full rounded-l-full bg-info"
                            style={{ width: `${Math.abs(band.low) / span * 100}%` }} />
                          
                        </span>
                        <span className="flex w-1/2">
                          <span
                            className="h-full rounded-r-full bg-brand"
                            style={{ width: `${Math.abs(band.high) / span * 100}%` }} />
                          
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted">{band.note}</p>
                    </li>);

                })}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Decision history & ownership"
          subtitle={`${rows.length} recorded decisions`}
          actions={
          <Select
            aria-label="Filter decisions"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-9 w-full text-xs sm:w-auto">
            
              <option value="all">All decisions</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="Deferred">Deferred</option>
              <option value="Rolled back">Rolled back</option>
            </Select>
          } />
        
        {rows.length === 0 ?
        <EmptyState
          icon={ClipboardListIcon}
          title="No decisions in this state"
          description="Change the filter to view recorded selections, rejections and deferrals." /> :


        <>
        <div className="space-y-3 p-4 sm:hidden">
          {rows.map((record) =>
          <article key={record.id} className="rounded-lg border border-line bg-raised p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-ink">{record.id}</p>
                  <p className="truncate text-[11px] text-muted">{record.study}</p>
                </div>
                <Badge tone={decisionTone[record.decision] ?? 'neutral'} dot>
                  {record.decision}
                </Badge>
              </div>
              <dl className="mt-3 space-y-2 text-xs">
                <div>
                  <dt className="text-[11px] text-muted">Configuration</dt>
                  <dd className="break-words text-ink">{record.configuration}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted">Rationale</dt>
                  <dd className="break-words text-muted">{record.rationale}</dd>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-[11px] text-muted">Owner / reviewer</dt>
                    <dd className="truncate text-ink">{record.owner}</dd>
                    <dd className="truncate text-[11px] text-muted">{record.reviewedBy}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted">Date</dt>
                    <dd className="font-mono text-[11px] text-muted">{record.date}</dd>
                  </div>
                </div>
              </dl>
            </article>
          )}
        </div>

        <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                  <th scope="col" className="px-4 py-2.5 font-medium">Record</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Configuration</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Decision</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Rationale</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Owner / reviewer</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((record) =>
              <tr
                key={record.id}
                className="border-b border-line last:border-0 align-top transition-colors duration-150 ease-smooth hover:bg-raised">
                
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-ink">{record.id}</p>
                      <p className="text-[11px] text-muted">{record.study}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink">{record.configuration}</td>
                    <td className="px-4 py-3">
                      <Badge tone={decisionTone[record.decision] ?? 'neutral'} dot>
                        {record.decision}
                      </Badge>
                    </td>
                    <td className="max-w-sm px-4 py-3 text-xs text-muted">{record.rationale}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-ink">{record.owner}</p>
                      <p className="text-[11px] text-muted">reviewed by {record.reviewedBy}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-muted">
                      {record.date}
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </>
        }
      </Card>
    </>);

}