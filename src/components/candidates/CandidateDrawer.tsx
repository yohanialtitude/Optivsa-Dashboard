import React, { useState } from 'react';
import { CheckIcon, GitCompareIcon, XIcon, ClockIcon } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge, StatusBadge } from '../ui/Badge';
import { Field, Textarea } from '../ui/Field';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useAuth } from '../../contexts/AuthContext';
import type { CandidateConfig } from '../../types';

const constraintCopy: Record<CandidateConfig['constraint'], string> = {
  pass: 'All declared constraints satisfied under the recorded test conditions.',
  warn: 'One constraint is close to its limit. Re-measure before selection.',
  fail: 'At least one declared constraint is breached. Selection is blocked.'
};

export function CandidateDrawer({
  candidate,
  onClose



}: {candidate: CandidateConfig | null;onClose: () => void;}) {
  const { selectCandidate, rejectCandidate, deferCandidate, toggleCompare, compareIds } =
  useWorkspace();
  const { user } = useAuth();
  const [rationale, setRationale] = useState('');

  const owner = user?.name ?? 'Optivsa User';

  const act = (action: 'select' | 'reject' | 'defer') => {
    if (!candidate) return;
    const text =
    rationale.trim() ||
    'Recorded from the candidate evidence panel without additional reviewer notes.';
    if (action === 'select') selectCandidate(candidate.id, text, owner);
    if (action === 'reject') rejectCandidate(candidate.id, text, owner);
    if (action === 'defer') deferCandidate(candidate.id, text, owner);
    setRationale('');
    onClose();
  };

  const metrics = candidate ?
  [
  { label: 'Quality score', value: `${candidate.quality}`, sub: `${candidate.qualityDelta} pt vs baseline` },
  { label: 'p95 latency', value: `${candidate.p95} ms`, sub: `batch ${candidate.batch}` },
  { label: 'Throughput', value: candidate.throughput.toLocaleString(), sub: 'req / min' },
  { label: 'Peak memory', value: `${candidate.memory} GB`, sub: candidate.hardware },
  { label: 'Cost', value: `$${candidate.costPerM}`, sub: 'per 1M tokens' },
  { label: 'Confidence', value: candidate.confidence, sub: 'repeat-run variance' }] :

  [];

  return (
    <Drawer
      open={Boolean(candidate)}
      onClose={onClose}
      title={candidate ? `${candidate.id} · ${candidate.precision}` : ''}
      subtitle={candidate ? `${candidate.model} · ${candidate.study}` : undefined}
      footer={
      candidate &&
      <>
            <Button variant="ghost" icon={ClockIcon} onClick={() => act('defer')}>
              Defer
            </Button>
            <Button variant="danger" icon={XIcon} onClick={() => act('reject')}>
              Reject
            </Button>
            <Button
          icon={CheckIcon}
          disabled={candidate.constraint === 'fail'}
          onClick={() => act('select')}>
          
              Record selection
            </Button>
          </>

      }>
      
      {candidate &&
      <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={candidate.constraint} label={`Constraints ${candidate.constraint}`} />
            <Badge tone={candidate.confidence === 'high' ? 'success' : candidate.confidence === 'medium' ? 'warning' : 'neutral'}>
              {candidate.confidence} confidence
            </Badge>
            {candidate.selected && <Badge tone="brand">Currently selected</Badge>}
          </div>

          <p className="text-xs text-muted">{constraintCopy[candidate.constraint]}</p>

          <dl className="grid grid-cols-2 gap-3">
            {metrics.map((metric) =>
          <div key={metric.label} className="rounded-lg border border-line bg-raised px-3 py-2.5">
                <dt className="text-[11px] text-muted">{metric.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold capitalize text-ink">{metric.value}</dd>
                <dd className="text-[11px] text-muted">{metric.sub}</dd>
              </div>
          )}
          </dl>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Environment & reproducibility
            </h3>
            <ul className="mt-2 space-y-1.5 text-xs text-ink">
              <li className="flex justify-between gap-3">
                <span className="text-muted">Runtime</span>
                <span>{candidate.runtime}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted">Compilation</span>
                <span>{candidate.compiler}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted">Hardware</span>
                <span>{candidate.hardware}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted">Batch size</span>
                <span>{candidate.batch}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted">Repeat runs</span>
                <span>{candidate.confidence === 'low' ? '1' : candidate.confidence === 'medium' ? '3' : '5'}</span>
              </li>
            </ul>
          </section>

          <Field label="Reviewer rationale" htmlFor="rationale" hint="Stored with the decision record.">
            <Textarea
            id="rationale"
            rows={3}
            value={rationale}
            onChange={(event) => setRationale(event.target.value)}
            placeholder="Why this configuration is or is not suitable for deployment…" />
          
          </Field>

          <Button
          variant="secondary"
          icon={GitCompareIcon}
          fullWidth
          onClick={() => toggleCompare(candidate.id)}>
          
            {compareIds.includes(candidate.id) ? 'Remove from comparison' : 'Add to comparison'}
          </Button>
        </div>
      }
    </Drawer>);

}