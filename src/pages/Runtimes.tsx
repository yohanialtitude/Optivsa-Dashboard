import React, { useState } from 'react';
import { toast } from 'sonner';
import { CpuIcon, InfoIcon } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { runtimeProfiles } from '../data/decisions';

const hardware = [
{ name: 'H100 80GB', memory: '80 GB HBM3', note: 'Large LLM serving envelopes' },
{ name: 'A100 80GB', memory: '80 GB HBM2e', note: 'Reranking and retrieval workloads' },
{ name: 'A100 40GB', memory: '40 GB HBM2', note: 'Streaming speech models' },
{ name: 'L40S', memory: '48 GB GDDR6', note: 'Vision segmentation' },
{ name: 'A10G', memory: '24 GB GDDR6', note: 'Tabular and feature pipelines' },
{ name: 'CPU · Sapphire Rapids', memory: 'System memory', note: 'Forecasting and batch scoring' }];


export function Runtimes() {
  const [filter, setFilter] = useState<'all' | 'proposed' | 'supported' | 'evaluating'>('all');
  const rows = filter === 'all' ? runtimeProfiles : runtimeProfiles.filter((r) => r.status === filter);

  return (
    <>
      <PageHeader
        eyebrow="Runtime & hardware compatibility"
        title="Runtime profiles"
        description="Runtime and hardware choices change model behaviour. Every profile below is a deployment option with its own evidence requirements." />
      

      <Card>
        <CardBody className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <InfoIcon className="h-4 w-4" />
          </span>
          <p className="text-xs leading-relaxed text-muted">
            NVIDIA RAPIDS, TensorRT, NeMo and Triton Inference Server are listed as{' '}
            <span className="font-medium text-ink">proposed integration options</span> that support
            the architecture narrative. They do not indicate completed engineering work, validated
            benchmarks or official affiliation.
          </p>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-1.5">
        {(['all', 'proposed', 'evaluating', 'supported'] as const).map((item) =>
        <button
          key={item}
          type="button"
          onClick={() => setFilter(item)}
          aria-pressed={filter === item}
          className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-colors duration-150 ease-smooth ${
          filter === item ?
          'border-brand bg-brand-soft text-brand' :
          'border-line bg-surface text-muted hover:text-ink'}`
          }>
          
            {item}
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((profile) =>
        <Card key={profile.id} as="article" className="flex h-full flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-ink">{profile.name}</h3>
                <p className="mt-0.5 text-[11px] text-muted">{profile.vendor}</p>
              </div>
              <StatusBadge value={profile.status} />
            </div>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {profile.precisions.map((precision) =>
            <li key={precision}>
                  <Badge tone="neutral" className="font-mono">
                    {precision}
                  </Badge>
                </li>
            )}
            </ul>
            <p className="mt-3 text-[11px] text-muted">{profile.hardware}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{profile.note}</p>
            <div className="mt-auto pt-4">
              <Button
              size="sm"
              variant="secondary"
              fullWidth
              onClick={() =>
              toast.info(`${profile.name} compatibility check queued`, {
                description: 'Results will be recorded as environment-specific evidence.'
              })
              }>
              
                Run compatibility check
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader
          title="Hardware profiles"
          subtitle="Memory headroom is frequently the binding constraint" />
        
        <CardBody className="py-1">
          <ul className="divide-y divide-line">
            {hardware.map((item) =>
            <li key={item.name} className="flex items-center gap-3 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-raised text-muted">
                  <CpuIcon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-ink">{item.name}</span>
                  <span className="block text-[11px] text-muted">{item.note}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted">{item.memory}</span>
              </li>
            )}
          </ul>
        </CardBody>
      </Card>
    </>);

}