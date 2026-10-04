import React, { useState } from 'react';
import { Badge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import type { ValidationException } from '../../types';

export function ExceptionsList({ limit }: {limit?: number;}) {
  const { exceptions, setExceptionState } = useWorkspace();
  const [active, setActive] = useState<ValidationException | null>(null);
  const rows = limit ? exceptions.slice(0, limit) : exceptions;

  return (
    <>
      <ul className="divide-y divide-line">
        {rows.map((exception) =>
        <li key={exception.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted">{exception.id}</span>
                  <StatusBadge value={exception.severity} label={`${exception.severity} severity`} />
                  <Badge tone={exception.state === 'resolved' ? 'success' : 'neutral'}>
                    {exception.state}
                  </Badge>
                </p>
                <p className="mt-1 text-xs text-ink">{exception.message}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {exception.study} · raised {exception.raised}
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setActive(exception)}>
                Review
              </Button>
            </div>
          </li>
        )}
      </ul>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `${active.id} · ${active.message}` : ''}
        description={active ? `${active.study} · raised ${active.raised}` : undefined}
        footer={
        active &&
        <>
              <Button variant="ghost" onClick={() => setActive(null)}>
                Close
              </Button>
              <Button
            variant="secondary"
            disabled={active.state !== 'open'}
            onClick={() => {
              setExceptionState(active.id, 'acknowledged');
              setActive(null);
            }}>
            
                Acknowledge
              </Button>
              <Button
            disabled={active.state === 'resolved'}
            onClick={() => {
              setExceptionState(active.id, 'resolved');
              setActive(null);
            }}>
            
                Mark resolved
              </Button>
            </>

        }>
        
        {active &&
        <div className="space-y-3">
            <p className="text-sm leading-relaxed text-ink">{active.detail}</p>
            <p className="rounded-lg border border-line bg-raised px-3 py-2.5 text-[11px] text-muted">
              Affected results stay visible as evidence but are excluded from comparison until the
              exception is resolved and the trials are re-measured under matching conditions.
            </p>
          </div>
        }
      </Modal>
    </>);

}