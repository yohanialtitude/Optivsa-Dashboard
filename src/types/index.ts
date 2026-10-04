export type ApprovalStatus = 'approved' | 'in-review' | 'draft' | 'deprecated';
export type StudyStatus = 'running' | 'review' | 'selected' | 'blocked' | 'queued';
export type ConstraintState = 'pass' | 'warn' | 'fail';

export interface ModelRecord {
  id: string;
  name: string;
  version: string;
  family: string;
  params: string;
  dataset: string;
  task: string;
  runtime: string;
  hardware: string;
  owner: string;
  status: ApprovalStatus;
  updated: string;
  lineage: string[];
}

export interface Study {
  id: string;
  name: string;
  model: string;
  objective: 'Latency-first' | 'Quality-first' | 'Cost-first' | 'Balanced';
  constraints: string[];
  trials: number;
  trialsComplete: number;
  candidates: number;
  status: StudyStatus;
  reviewer: string;
  updated: string;
}

export interface CandidateConfig {
  id: string;
  study: string;
  model: string;
  precision: 'FP16' | 'BF16' | 'INT8' | 'FP8' | 'INT4';
  compiler: string;
  runtime: string;
  hardware: string;
  batch: number;
  quality: number;
  qualityDelta: number;
  p95: number;
  throughput: number;
  memory: number;
  costPerM: number;
  constraint: ConstraintState;
  confidence: 'high' | 'medium' | 'low';
  selected: boolean;
}

export interface DecisionRecord {
  id: string;
  study: string;
  configuration: string;
  decision: 'Selected' | 'Rejected' | 'Deferred' | 'Rolled back';
  rationale: string;
  owner: string;
  reviewedBy: string;
  date: string;
}

export interface ValidationException {
  id: string;
  study: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  detail: string;
  raised: string;
  state: 'open' | 'acknowledged' | 'resolved';
}

export interface RuntimeProfile {
  id: string;
  name: string;
  vendor: string;
  status: 'proposed' | 'evaluating' | 'supported';
  precisions: string[];
  hardware: string;
  note: string;
}