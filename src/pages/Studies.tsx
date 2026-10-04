import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayIcon, PlusIcon, GitCompareIcon } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader, EmptyState } from '../components/ui/PageHeader';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { ExceptionsList } from '../components/dashboard/ExceptionsList';
import { NewStudyModal } from '../components/studies/NewStudyModal';
import { useWorkspace } from '../contexts/WorkspaceContext';
import type { Study } from '../types';

const tabs = ['all', 'running', 'review', 'selected', 'blocked', 'queued'] as const;

export function Studies() {
  const { studies, advanceStudy } = useWorkspace();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]>('all');
  const [open, setOpen] = useState(false);

  const rows = useMemo(
    () => tab === 'all' ? studies : studies.filter((study) => study.status === tab),
    [studies, tab]
  );

  const counts = tabs.reduce<Record<string, number>>((acc, key) => {
    acc[key] = key === 'all' ? studies.length : studies.filter((s) => s.status === key).length;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        eyebrow="Optimization workspace"
        title="Optimization studies"
        description="Each study pins its objective, constraints, search space and reviewer so trial results stay interpretable."
        actions={
        <Button icon={PlusIcon} onClick={() => setOpen(true)}>
            New study
          </Button>
        } />
      

      <div className="flex flex-wrap gap-1.5">
        {tabs.map((item) =>
        <button
          key={item}
          type="button"
          onClick={() => setTab(item)}
          aria-pressed={tab === item}
          className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition-colors duration-150 ease-smooth ${
          tab === item ?
          'border-brand bg-brand-soft text-brand' :
          'border-line bg-surface text-muted hover:text-ink'}`
          }>
          
            {item} <span className="ml-1 text-[10px] opacity-70">{counts[item]}</span>
          </button>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          {rows.length === 0 ?
          <Card>
              <EmptyState
              icon={GitCompareIcon}
              title="No studies in this state"
              description="Switch tabs to review studies at another stage of the optimization workflow." />
            
            </Card> :

          rows.map((study: Study) => {
            const progress = Math.round(study.trialsComplete / study.trials * 100);
            return (
              <Card key={study.id} as="article" className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-ink">{study.name}</span>
                        <StatusBadge value={study.status} />
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {study.id} · {study.model} · reviewer {study.reviewer}
                      </p>
                    </div>
                    <Badge tone="brand">{study.objective}</Badge>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <p className="flex items-center justify-between text-[11px] text-muted">
                        <span>Trial progress</span>
                        <span className="font-mono text-ink">
                          {study.trialsComplete}/{study.trials}
                        </span>
                      </p>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-raised">
                        <div
                        className={`h-full rounded-full transition-[width] duration-300 ease-smooth ${
                        study.status === 'blocked' ? 'bg-warn' : 'bg-brand'}`
                        }
                        style={{ width: `${progress}%` }} />
                      
                      </div>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {study.constraints.map((constraint) =>
                      <li key={constraint}>
                            <Badge tone="neutral" className="font-mono">
                              {constraint}
                            </Badge>
                          </li>
                      )}
                      </ul>
                    </div>
                    <div className="flex flex-col justify-between gap-3">
                      <p className="text-[11px] text-muted">
                        <span className="block text-lg font-semibold text-ink">
                          {study.candidates}
                        </span>
                        candidate configurations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                        size="sm"
                        variant="secondary"
                        icon={GitCompareIcon}
                        onClick={() => navigate('/candidates')}>
                        
                          Candidates
                        </Button>
                        {(study.status === 'running' ||
                      study.status === 'queued' ||
                      study.status === 'blocked') &&
                      <Button size="sm" icon={PlayIcon} onClick={() => advanceStudy(study.id)}>
                            {study.status === 'blocked' ? 'Resume' : 'Advance'}
                          </Button>
                      }
                      </div>
                    </div>
                  </div>
                </Card>);

          })
          }
        </div>

        <div className="space-y-4 xl:col-span-4">
          <Card>
            <CardHeader
              title="Validation exceptions"
              subtitle="Blocking issues raised during study execution" />
            
            <CardBody>
              <ExceptionsList />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Search space defaults" subtitle="Applied to every new study" />
            <CardBody className="space-y-2.5 text-xs text-muted">
              <p className="flex justify-between gap-3">
                <span>Precision options</span>
                <span className="font-mono text-ink">BF16 · FP16 · FP8 · INT8 · INT4</span>
              </p>
              <p className="flex justify-between gap-3">
                <span>Compilation</span>
                <span className="text-ink">Graph fusion, paged attention</span>
              </p>
              <p className="flex justify-between gap-3">
                <span>Batch range</span>
                <span className="font-mono text-ink">1 – 1024</span>
              </p>
              <p className="flex justify-between gap-3">
                <span>Repeat runs</span>
                <span className="font-mono text-ink">3 minimum</span>
              </p>
              <p className="mt-2 rounded-lg border border-line bg-raised px-3 py-2 text-[11px]">
                A study cannot mark a configuration as selected until a named reviewer records the
                rationale.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <NewStudyModal open={open} onClose={() => setOpen(false)} />
    </>);

}