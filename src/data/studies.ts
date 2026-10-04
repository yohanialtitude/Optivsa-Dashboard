import type { Study, ValidationException } from '../types';

export const studies: Study[] = [
{
  id: 'STD-3391',
  name: 'Rerank latency envelope Q3',
  model: 'optivsa-rerank v3.2.0',
  objective: 'Latency-first',
  constraints: ['p95 ≤ 45 ms', 'Quality drop ≤ 1.0 pt', 'A100 only'],
  trials: 128,
  trialsComplete: 128,
  candidates: 9,
  status: 'review',
  reviewer: 'Priya Raman',
  updated: '2026-09-16'
},
{
  id: 'STD-3384',
  name: 'Atlas 8B serving cost study',
  model: 'atlas-instruct v1.8.4',
  objective: 'Cost-first',
  constraints: ['Cost ≤ $38 / 1M tok', 'p95 ≤ 900 ms', 'Memory ≤ 62 GB'],
  trials: 96,
  trialsComplete: 71,
  candidates: 6,
  status: 'running',
  reviewer: 'Marcus Feld',
  updated: '2026-09-17'
},
{
  id: 'STD-3377',
  name: 'Defect seg quality guardrail',
  model: 'vision-defect-seg v2.0.1',
  objective: 'Quality-first',
  constraints: ['mIoU ≥ 91.0', 'p95 ≤ 120 ms'],
  trials: 64,
  trialsComplete: 64,
  candidates: 5,
  status: 'selected',
  reviewer: 'Hana Ito',
  updated: '2026-09-12'
},
{
  id: 'STD-3369',
  name: 'Fraud scoring throughput sweep',
  model: 'fraud-tabular-gbdt v6.4.0',
  objective: 'Balanced',
  constraints: ['Throughput ≥ 40k rps', 'AUC drop ≤ 0.3 pt'],
  trials: 48,
  trialsComplete: 48,
  candidates: 7,
  status: 'review',
  reviewer: 'Daniel Okoro',
  updated: '2026-09-15'
},
{
  id: 'STD-3360',
  name: 'Streaming ASR memory study',
  model: 'speech-asr-stream v4.1.2',
  objective: 'Balanced',
  constraints: ['WER drop ≤ 0.5 pt', 'Memory ≤ 18 GB'],
  trials: 72,
  trialsComplete: 22,
  candidates: 3,
  status: 'blocked',
  reviewer: 'Lena Brandt',
  updated: '2026-09-17'
},
{
  id: 'STD-3352',
  name: 'Embedding INT8 recall check',
  model: 'embed-multilingual v2.9.0',
  objective: 'Cost-first',
  constraints: ['Recall@10 ≥ 0.86', 'T4 compatible'],
  trials: 40,
  trialsComplete: 0,
  candidates: 0,
  status: 'queued',
  reviewer: 'Unassigned',
  updated: '2026-09-17'
}];


export const validationExceptions: ValidationException[] = [
{
  id: 'EXC-214',
  study: 'STD-3360',
  severity: 'high',
  message: 'Evaluation dataset drifted since last benchmark',
  detail:
  'callcenter-eval-05 was re-sampled on 2026-09-14. Trials 1–22 were measured against the previous snapshot, so their results are not comparable and must be re-run before review.',
  raised: '2026-09-17 08:12',
  state: 'open'
},
{
  id: 'EXC-211',
  study: 'STD-3384',
  severity: 'medium',
  message: 'Memory constraint exceeded on 2 candidates',
  detail:
  'Candidates CFG-8841 and CFG-8846 measured 64.8 GB and 66.1 GB peak memory against a 62 GB constraint. Results are retained as evidence but marked non-compliant.',
  raised: '2026-09-16 19:44',
  state: 'acknowledged'
},
{
  id: 'EXC-208',
  study: 'STD-3391',
  severity: 'low',
  message: 'Single-run measurement, no repeat variance',
  detail:
  'Candidate CFG-8802 has one benchmark run. Confidence is reported as low until a minimum of three runs are recorded under identical environment conditions.',
  raised: '2026-09-15 11:03',
  state: 'open'
},
{
  id: 'EXC-201',
  study: 'STD-3377',
  severity: 'low',
  message: 'Runtime version differs from production baseline',
  detail:
  'Trials executed on ONNX Runtime 1.19.2 while production serves 1.18.0. Environment difference is recorded in reproducibility notes.',
  raised: '2026-09-11 15:20',
  state: 'resolved'
}];