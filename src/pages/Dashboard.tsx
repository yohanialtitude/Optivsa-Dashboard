import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DownloadIcon,
  FlaskConicalIcon,
  GaugeIcon,
  BoxesIcon,
  AlertTriangleIcon,
  ArrowRightIcon } from
'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Field';
import { PageHeader } from '../components/ui/PageHeader';
import { KpiCard, type Kpi } from '../components/dashboard/KpiCard';
import { ObjectiveMixChart } from '../components/dashboard/ObjectiveMixChart';
import { TrialVolumeChart } from '../components/dashboard/TrialVolumeChart';
import { LatencyTrendChart } from '../components/dashboard/LatencyTrendChart';
import { StatusTiles } from '../components/dashboard/StatusTiles';
import { InputLayerWidget } from '../components/dashboard/InputLayerWidget';
import { ExceptionsList } from '../components/dashboard/ExceptionsList';
import { ProcessWidget } from '../components/dashboard/ProcessWidget';
import { CandidateTable } from '../components/candidates/CandidateTable';
import { CandidateDrawer } from '../components/candidates/CandidateDrawer';
import { useWorkspace } from '../contexts/WorkspaceContext';
import type { CandidateConfig } from '../types';

const kpis: Kpi[] = [
{
  label: 'Active optimization studies',
  value: '18',
  delta: 12.4,
  deltaLabel: 'vs last month',
  positiveIsGood: true,
  icon: FlaskConicalIcon,
  spark: [9, 11, 10, 13, 14, 16, 15, 18]
},
{
  label: 'Registered model versions',
  value: '142',
  delta: 6.1,
  deltaLabel: 'vs last month',
  positiveIsGood: true,
  icon: BoxesIcon,
  spark: [108, 114, 119, 124, 128, 133, 138, 142]
},
{
  label: 'Median p95 latency',
  value: '38',
  unit: 'ms',
  delta: -17.4,
  deltaLabel: 'vs last month',
  positiveIsGood: false,
  icon: GaugeIcon,
  spark: [96, 91, 84, 72, 64, 58, 46, 38]
},
{
  label: 'Open validation exceptions',
  value: '3',
  delta: -25,
  deltaLabel: 'vs last month',
  positiveIsGood: false,
  icon: AlertTriangleIcon,
  spark: [7, 8, 6, 6, 5, 5, 4, 3]
}];


const filters = [
{ key: 'all', label: 'All candidates' },
{ key: 'pass', label: 'Within constraints' },
{ key: 'breach', label: 'Breaching' },
{ key: 'selected', label: 'Selected' }] as
const;

export function Dashboard() {
  const { candidates } = useWorkspace();
  const navigate = useNavigate();
  const [range, setRange] = useState('8');
  const [filter, setFilter] = useState<(typeof filters)[number]['key']>('all');
  const [active, setActive] = useState<CandidateConfig | null>(null);

  const rows = useMemo(() => {
    if (filter === 'pass') return candidates.filter((row) => row.constraint === 'pass');
    if (filter === 'breach') return candidates.filter((row) => row.constraint !== 'pass');
    if (filter === 'selected') return candidates.filter((row) => row.selected);
    return candidates;
  }, [candidates, filter]);

  return (
    <>
      <PageHeader
        eyebrow="Model operations"
        title="Decision dashboard"
        description="Objectives, constraints, test environment and metric evidence stay visible from experiment setup through to an accountable selection."
        actions={
        <>
            <Select
            aria-label="Evidence window"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="h-9 w-full text-xs sm:w-auto">
            
              <option value="4">Last 4 months</option>
              <option value="6">Last 6 months</option>
              <option value="8">Last 8 months</option>
            </Select>
            <Button
            variant="secondary"
            size="md"
            icon={DownloadIcon}
            className="w-full sm:w-auto"
            onClick={() =>
            toast.success('Evidence export prepared', {
              description: 'Metrics, environment conditions and decision history included.'
            })
            }>
            
              Export evidence
            </Button>
          </>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) =>
        <KpiCard key={kpi.label} kpi={kpi} featured={index === 0} />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Study objective mix" subtitle="18 active studies by primary objective" />
          <CardBody>
            <ObjectiveMixChart />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Trial evidence volume"
            subtitle="Valid versus invalidated benchmark trials"
            actions={
            <Button size="sm" variant="ghost" onClick={() => navigate('/benchmarks')}>
                Details
              </Button>
            } />
          
          <CardBody>
            <TrialVolumeChart months={Number(range)} height={232} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Latency trend"
            subtitle="Best in-constraint candidate per month"
            actions={
            <Button size="sm" variant="ghost" onClick={() => navigate('/benchmarks')}>
                Details
              </Button>
            } />
          
          <CardBody>
            <LatencyTrendChart months={Number(range)} height={232} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader
            title="Candidate configurations"
            subtitle="Evidence-linked candidates awaiting review or already selected"
            actions={
            <Button
              size="sm"
              variant="secondary"
              iconRight={ArrowRightIcon}
              onClick={() => navigate('/candidates')}>
              
                Compare
              </Button>
            } />
          
          <div className="flex flex-wrap gap-1.5 border-b border-line px-4 py-3 sm:px-5">
            {filters.map((item) =>
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              aria-pressed={filter === item.key}
              className={`rounded-lg border px-2.5 py-1 text-xs transition-colors duration-150 ease-smooth ${
              filter === item.key ?
              'border-brand bg-brand-soft text-brand' :
              'border-line text-muted hover:text-ink'}`
              }>
              
                {item.label}
              </button>
            )}
          </div>
          {rows.length === 0 ?
          <p className="px-5 py-10 text-center text-xs text-muted">
              No configurations match this filter.
            </p> :

          <CandidateTable rows={rows.slice(0, 7)} onOpen={setActive} />
          }
        </Card>

        <div className="space-y-4 xl:col-span-4">
          <StatusTiles />
          <Card>
            <CardHeader
              title="Validation exceptions"
              subtitle="Results held back from comparison"
              actions={
              <Button size="sm" variant="ghost" onClick={() => navigate('/benchmarks')}>
                  All
                </Button>
              } />
            
            <CardBody>
              <ExceptionsList limit={3} />
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-5">
          <CardHeader
            title="Optimization input layer"
            subtitle="Registered inputs feeding every study" />
          
          <CardBody className="py-1">
            <InputLayerWidget />
          </CardBody>
        </Card>
        <Card className="xl:col-span-7">
          <CardHeader
            title="AI optimization process"
            subtitle="Validated inputs → trials → trade-off intelligence → expert decision" />
          
          <CardBody className="py-1">
            <ProcessWidget />
          </CardBody>
        </Card>
      </div>

      <CandidateDrawer candidate={active} onClose={() => setActive(null)} />
    </>);

}