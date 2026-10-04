import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { candidates as seedCandidates } from '../data/candidates';
import { studies as seedStudies, validationExceptions as seedExceptions } from '../data/studies';
import { decisions as seedDecisions } from '../data/decisions';
import { models as seedModels } from '../data/models';
import type {
  CandidateConfig,
  DecisionRecord,
  ModelRecord,
  Study,
  ValidationException } from
'../types';

interface WorkspaceContextValue {
  models: ModelRecord[];
  studies: Study[];
  candidates: CandidateConfig[];
  decisions: DecisionRecord[];
  exceptions: ValidationException[];
  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  selectCandidate: (id: string, rationale: string, owner: string) => void;
  rejectCandidate: (id: string, rationale: string, owner: string) => void;
  deferCandidate: (id: string, rationale: string, owner: string) => void;
  setExceptionState: (id: string, state: ValidationException['state']) => void;
  setModelStatus: (id: string, status: ModelRecord['status']) => void;
  advanceStudy: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const today = '2026-09-17';

export function WorkspaceProvider({ children }: {children: React.ReactNode;}) {
  const [models, setModels] = useState<ModelRecord[]>(seedModels);
  const [studies, setStudies] = useState<Study[]>(seedStudies);
  const [candidates, setCandidates] = useState<CandidateConfig[]>(seedCandidates);
  const [decisions, setDecisions] = useState<DecisionRecord[]>(seedDecisions);
  const [exceptions, setExceptions] = useState<ValidationException[]>(seedExceptions);
  const [compareIds, setCompareIds] = useState<string[]>(['CFG-8812', 'CFG-8808']);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 4) {
        toast.warning('Comparison holds four configurations', {
          description: 'Remove one before adding another.'
        });
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const record = useCallback(
    (
    id: string,
    decision: DecisionRecord['decision'],
    rationale: string,
    owner: string) =>
    {
      setCandidates((prev) =>
      prev.map((candidate) => {
        if (candidate.id !== id) return candidate;
        return { ...candidate, selected: decision === 'Selected' };
      })
      );
      const candidate = candidates.find((item) => item.id === id);
      if (!candidate) return;
      const entry: DecisionRecord = {
        id: `DEC-${1188 + decisions.length}`,
        study: candidate.study,
        configuration: `${candidate.id} · ${candidate.precision} · ${candidate.hardware}`,
        decision,
        rationale,
        owner,
        reviewedBy: decision === 'Deferred' ? 'Pending' : owner,
        date: today
      };
      setDecisions((prev) => [entry, ...prev]);
      if (decision === 'Selected') {
        setStudies((prev) =>
        prev.map((study) =>
        study.id === candidate.study ? { ...study, status: 'selected', updated: today } : study
        )
        );
      }
    },
    [candidates, decisions.length]
  );

  const selectCandidate = useCallback(
    (id: string, rationale: string, owner: string) => {
      record(id, 'Selected', rationale, owner);
      toast.success(`${id} recorded as selected`, {
        description: 'Decision, rationale and owner are stored in the decision history.'
      });
    },
    [record]
  );

  const rejectCandidate = useCallback(
    (id: string, rationale: string, owner: string) => {
      record(id, 'Rejected', rationale, owner);
      toast.success(`${id} recorded as rejected`);
    },
    [record]
  );

  const deferCandidate = useCallback(
    (id: string, rationale: string, owner: string) => {
      record(id, 'Deferred', rationale, owner);
      toast.info(`${id} deferred for further evidence`);
    },
    [record]
  );

  const setExceptionState = useCallback((id: string, state: ValidationException['state']) => {
    setExceptions((prev) =>
    prev.map((exception) => exception.id === id ? { ...exception, state } : exception)
    );
    toast.success(`${id} marked ${state}`);
  }, []);

  const setModelStatus = useCallback((id: string, status: ModelRecord['status']) => {
    setModels((prev) =>
    prev.map((model) => model.id === id ? { ...model, status, updated: today } : model)
    );
    toast.success(`${id} lifecycle status set to ${status}`);
  }, []);

  const advanceStudy = useCallback((id: string) => {
    setStudies((prev) =>
    prev.map((study) => {
      if (study.id !== id) return study;
      const nextStatus: Study['status'] =
      study.status === 'queued' ?
      'running' :
      study.status === 'running' ?
      'review' :
      study.status === 'blocked' ?
      'running' :
      study.status;
      return { ...study, status: nextStatus, updated: today };
    })
    );
    toast.success(`${id} moved to the next stage`);
  }, []);

  const value = useMemo(
    () => ({
      models,
      studies,
      candidates,
      decisions,
      exceptions,
      compareIds,
      toggleCompare,
      clearCompare,
      selectCandidate,
      rejectCandidate,
      deferCandidate,
      setExceptionState,
      setModelStatus,
      advanceStudy
    }),
    [
    models,
    studies,
    candidates,
    decisions,
    exceptions,
    compareIds,
    toggleCompare,
    clearCompare,
    selectCandidate,
    rejectCandidate,
    deferCandidate,
    setExceptionState,
    setModelStatus,
    advanceStudy]

  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider');
  return ctx;
}