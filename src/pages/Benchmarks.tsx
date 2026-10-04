import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { toast } from 'sonner';
import { DownloadIcon } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { LatencyTrendChart } from '../components/dashboard/LatencyTrendChart';
import { TrialVolumeChart } from '../components/dashboard/TrialVolumeChart';
import { ExceptionsList } from '../components/dashboard/ExceptionsList';
import { runtimeBench } from '../data/charts';
import { useChartPalette } from '../contexts/ThemeContext';
import { useWorkspace } from '../contexts/WorkspaceContext';

const metrics = [
{ key: 'p95', label: 'p95 latency', unit: 'ms' },
{ key: 'throughput', label: 'Throughput', unit: '/min' },
{ key: 'memory', label: 'Peak memory', unit: 'GB' }] as
const;

const conditions = [
['Warm-up iterations', '50 per trial'],
['Measured iterations', '500 per trial'],
['Repeat runs', '3 minimum, 5 for high confidence'],
['Host utilisation', '40–80% during measurement'],
['Driver / CUDA', '550.54 · CUDA 12.4'],
['Sequence length', '512 tokens unless stated']];


export function Benchmarks() {
  const palette = useChartPalette();
  const { candidates } = useWorkspace();
  const [metric, setMetric] = useState<(typeof metrics)[number]['key']>('p95');
  const activeMetric = metrics.find((item) => item.key === metric)!;

  const highConfidence = candidates.filter((candidate) => candidate.confidence === 'high').length;

  return (
    <>
      <PageHeader
        eyebrow="Benchmark evidence"
        title="Benchmark & evidence view"
        description="Latency, throughput, quality and resource results with the environment and test conditions they were measured under."
        actions={
        <Button
          variant="secondary"
          icon={DownloadIcon}
          onClick={() =>
          toast.success('Benchmark bundle exported', {
            description: 'Includes raw runs, environment metadata and reproducibility notes.'
          })
          }>
          
            Export bundle
          </Button>
        } />
      

      <div className="grid gap-4 sm:grid-cols-3">
        {[
        { label: 'Reproducible results', value: `${highConfidence}`, sub: '3+ repeat runs recorded' },
        { label: 'Environments covered', value: '6', sub: 'Runtime × hardware profiles' },
        { label: 'Results held back', value: '3', sub: 'Open validation exceptions' }].
        map((item) =>
        <Card key={item.label} className="p-4 sm:p-5">
            <p className="text-2xl font-semibold text-ink">{item.value}</p>
            <p className="mt-1 text-sm text-muted">{item.label}</p>
            <p className="mt-0.5 text-[11px] text-muted">{item.sub}</p>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader
          title="Runtime comparison"
          subtitle="Best in-constraint candidate per runtime profile. Values are environment-specific."
          actions={
          <div className="flex gap-1.5">
              {metrics.map((item) =>
            <button
              key={item.key}
              type="button"
              onClick={() => setMetric(item.key)}
              aria-pressed={metric === item.key}
              className={`rounded-lg border px-2.5 py-1 text-xs transition-colors duration-150 ease-smooth ${
              metric === item.key ?
              'border-brand bg-brand-soft text-brand' :
              'border-line text-muted hover:text-ink'}`
              }>
              
                  {item.label}
                </button>
            )}
            </div>
          } />
        
        <CardBody>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={runtimeBench}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                
                <CartesianGrid stroke={palette.grid} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: palette.axis, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false} />
                
                <YAxis
                  type="category"
                  dataKey="runtime"
                  tick={{ fill: palette.axis, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={84} />
                
                <Tooltip
                  cursor={{ fill: palette.grid, opacity: 0.5 }}
                  contentStyle={{
                    backgroundColor: palette.tooltipBg,
                    border: `1px solid ${palette.tooltipBorder}`,
                    borderRadius: 10,
                    fontSize: 12,
                    color: palette.tooltipText
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} ${activeMetric.unit}`, activeMetric.label]} />
                
                <Bar
                  dataKey={metric}
                  name={activeMetric.label}
                  fill={palette.brand}
                  radius={[0, 4, 4, 0]}
                  maxBarSize={20} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Latency evidence over time" subtitle="p50 and p95 for in-constraint candidates" />
          <CardBody>
            <LatencyTrendChart height={250} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Trial validity" subtitle="Invalidated trials are excluded from comparison" />
          <CardBody>
            <TrialVolumeChart height={250} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-5">
          <CardHeader title="Environment & test conditions" subtitle="Applied to every recorded run" />
          <CardBody>
            <dl className="divide-y divide-line">
              {conditions.map(([label, value]) =>
              <div key={label} className="flex items-start justify-between gap-3 py-2.5 first:pt-0">
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="text-xs text-ink">{value}</dd>
                </div>
              )}
            </dl>
            <p className="mt-3 rounded-lg border border-line bg-raised px-3 py-2.5 text-[11px] text-muted">
              Results are valid for the recorded environment only. Data or runtime changes invalidate
              prior measurements and require a re-run.
            </p>
          </CardBody>
        </Card>
        <Card className="xl:col-span-7">
          <CardHeader
            title="Reproducibility exceptions"
            subtitle="Every exception blocks affected results from comparison"
            actions={<Badge tone="warning">Review required</Badge>} />
          
          <CardBody>
            <ExceptionsList />
          </CardBody>
        </Card>
      </div>
    </>);

}