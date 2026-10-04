import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PlusIcon, SearchIcon, CheckIcon, ArchiveIcon, GitBranchIcon } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader, EmptyState } from '../components/ui/PageHeader';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Drawer } from '../components/ui/Drawer';
import { Field, Input, Select } from '../components/ui/Field';
import { useWorkspace } from '../contexts/WorkspaceContext';
import type { ModelRecord } from '../types';

const statusFilters = ['all', 'approved', 'in-review', 'draft', 'deprecated'] as const;

export function Registry() {
  const { models, setModelStatus } = useWorkspace();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statusFilters)[number]>('all');
  const [active, setActive] = useState<ModelRecord | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [newModel, setNewModel] = useState({ name: '', version: 'v1.0.0', dataset: '', task: '' });
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return models.filter((model) => {
      const matchesQuery =
      !q || `${model.id} ${model.name} ${model.task} ${model.owner}`.toLowerCase().includes(q);
      const matchesStatus = status === 'all' || model.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [models, query, status]);

  const register = async () => {
    if (!newModel.name.trim()) {
      toast.error('Model name is required');
      return;
    }
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaving(false);
    setRegisterOpen(false);
    toast.success('Model version submitted for review', {
      description: `${newModel.name} ${newModel.version} added to the registry as draft.`
    });
    setNewModel({ name: '', version: 'v1.0.0', dataset: '', task: '' });
  };

  return (
    <>
      <PageHeader
        eyebrow="Model & experiment registry"
        title="Registered models"
        description="Model versions, evaluation context, runtime profiles and experiment lineage with approval and lifecycle status."
        actions={
        <Button icon={PlusIcon} onClick={() => setRegisterOpen(true)}>
            Register model
          </Button>
        } />
      

      <Card>
        <CardHeader
          title={`${rows.length} of ${models.length} records`}
          subtitle="Every record is scoped to a pinned dataset snapshot"
          actions={
          <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search models"
                aria-label="Search models"
                className="h-9 w-full pl-8 text-xs sm:w-48" />
              
              </div>
              <Select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              aria-label="Filter by lifecycle status"
              className="h-9 w-full text-xs sm:w-auto">
              
                {statusFilters.map((item) =>
              <option key={item} value={item}>
                    {item === 'all' ? 'All statuses' : item.replace('-', ' ')}
                  </option>
              )}
              </Select>
            </div>
          } />
        

        {rows.length === 0 ?
        <EmptyState
          icon={SearchIcon}
          title="No model records match"
          description="Adjust the search term or lifecycle filter to see registered model versions."
          action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setQuery('');
              setStatus('all');
            }}>
            
                Clear filters
              </Button>
          } /> :


        <>
        <div className="space-y-3 p-4 sm:hidden">
          {rows.map((model) =>
          <article key={model.id} className="rounded-lg border border-line bg-raised p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {model.name} <span className="font-mono text-muted">{model.version}</span>
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted">
                    {model.id} · {model.family} · {model.params}
                  </p>
                </div>
                <StatusBadge value={model.status} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <dt className="text-[11px] text-muted">Task / dataset</dt>
                  <dd className="truncate text-ink">{model.task}</dd>
                  <dd className="truncate font-mono text-[11px] text-muted">{model.dataset}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted">Runtime</dt>
                  <dd className="truncate text-ink">{model.runtime}</dd>
                  <dd className="truncate text-[11px] text-muted">{model.hardware}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted">Owner</dt>
                  <dd className="truncate text-ink">{model.owner}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted">Updated</dt>
                  <dd className="font-mono text-[11px] text-muted">{model.updated}</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-line pt-2">
                <Button size="sm" variant="secondary" onClick={() => setActive(model)}>
                  Lineage
                </Button>
                {model.status === 'approved' ?
                <Button size="sm" variant="ghost" icon={ArchiveIcon} onClick={() => setModelStatus(model.id, 'deprecated')}>
                    Deprecate
                  </Button> :
                <Button size="sm" variant="ghost" icon={CheckIcon} onClick={() => setModelStatus(model.id, 'approved')}>
                    Approve
                  </Button>}
              </div>
            </article>
          )}
        </div>

        <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                  <th scope="col" className="px-4 py-2.5 font-medium">Model</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Task / dataset</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Runtime / hardware</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Owner</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Updated</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((model) =>
              <tr
                key={model.id}
                className="border-b border-line last:border-0 transition-colors duration-150 ease-smooth hover:bg-raised">
                
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-ink">
                        {model.name} <span className="font-mono text-muted">{model.version}</span>
                      </p>
                      <p className="text-[11px] text-muted">
                        {model.id} · {model.family} · {model.params}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-ink">{model.task}</p>
                      <p className="font-mono text-[11px] text-muted">{model.dataset}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-ink">{model.runtime}</p>
                      <p className="text-[11px] text-muted">{model.hardware}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink">{model.owner}</td>
                    <td className="px-4 py-3">
                      <StatusBadge value={model.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-muted">
                      {model.updated}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setActive(model)}>
                          Lineage
                        </Button>
                        {model.status === 'approved' ?
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={ArchiveIcon}
                      onClick={() => setModelStatus(model.id, 'deprecated')}>
                      
                            Deprecate
                          </Button> :

                    <Button
                      size="sm"
                      variant="ghost"
                      icon={CheckIcon}
                      onClick={() => setModelStatus(model.id, 'approved')}>
                      
                            Approve
                          </Button>
                    }
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </>
        }
      </Card>

      <Drawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `${active.name} ${active.version}` : ''}
        subtitle={active ? `${active.id} · ${active.family}` : undefined}
        footer={
        active &&
        <>
              <Button variant="ghost" onClick={() => setActive(null)}>
                Close
              </Button>
              <Button
            onClick={() => {
              toast.success('Lineage exported', {
                description: 'Experiment lineage and evaluation context included.'
              });
              setActive(null);
            }}>
            
                Export lineage
              </Button>
            </>

        }>
        
        {active &&
        <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={active.status} />
              <Badge tone="neutral">{active.params} parameters</Badge>
              <Badge tone="neutral">{active.hardware}</Badge>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              {[
            ['Task', active.task],
            ['Dataset snapshot', active.dataset],
            ['Runtime profile', active.runtime],
            ['Owner', active.owner],
            ['Last updated', active.updated],
            ['Family', active.family]].
            map(([label, value]) =>
            <div key={label} className="rounded-lg border border-line bg-raised px-3 py-2.5">
                  <dt className="text-[11px] text-muted">{label}</dt>
                  <dd className="mt-0.5 text-xs text-ink">{value}</dd>
                </div>
            )}
            </dl>
            <section>
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <GitBranchIcon className="h-3.5 w-3.5" /> Experiment lineage
              </h3>
              <ol className="mt-3 space-y-0">
                {active.lineage.map((step, index) =>
              <li key={step} className="flex gap-3">
                    <span className="flex flex-col items-center">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand" aria-hidden />
                      {index < active.lineage.length - 1 &&
                  <span className="my-0.5 w-px flex-1 bg-line" aria-hidden />
                  }
                    </span>
                    <span className="pb-4">
                      <span className="block font-mono text-xs text-ink">{step}</span>
                      <span className="block text-[11px] text-muted">
                        Recorded with environment and dataset references
                      </span>
                    </span>
                  </li>
              )}
              </ol>
            </section>
          </div>
        }
      </Drawer>

      <Modal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        title="Register model version"
        description="New records enter the registry as draft until an owner approves them."
        footer={
        <>
            <Button variant="ghost" onClick={() => setRegisterOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={register}>
              Submit for review
            </Button>
          </>
        }>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Model name" htmlFor="m-name" className="sm:col-span-2">
            <Input
              id="m-name"
              value={newModel.name}
              onChange={(event) => setNewModel({ ...newModel, name: event.target.value })}
              placeholder="e.g. optivsa-rerank" />
            
          </Field>
          <Field label="Version" htmlFor="m-version">
            <Input
              id="m-version"
              value={newModel.version}
              onChange={(event) => setNewModel({ ...newModel, version: event.target.value })} />
            
          </Field>
          <Field label="Task" htmlFor="m-task">
            <Input
              id="m-task"
              value={newModel.task}
              onChange={(event) => setNewModel({ ...newModel, task: event.target.value })}
              placeholder="e.g. Passage reranking" />
            
          </Field>
          <Field
            label="Evaluation dataset"
            htmlFor="m-dataset"
            className="sm:col-span-2"
            hint="A snapshot reference keeps later benchmarks comparable.">
            
            <Input
              id="m-dataset"
              value={newModel.dataset}
              onChange={(event) => setNewModel({ ...newModel, dataset: event.target.value })}
              placeholder="e.g. msmarco-eval-24Q4" />
            
          </Field>
        </div>
      </Modal>
    </>);

}