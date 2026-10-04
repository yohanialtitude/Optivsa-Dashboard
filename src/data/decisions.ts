import type { DecisionRecord, RuntimeProfile } from '../types';

export const decisions: DecisionRecord[] = [
{
  id: 'DEC-1187',
  study: 'STD-3377',
  configuration: 'CFG-8774 · FP16 · L40S',
  decision: 'Selected',
  rationale:
  'Only candidate meeting the mIoU ≥ 91.0 guardrail with three repeat runs under identical environment conditions.',
  owner: 'Hana Ito',
  reviewedBy: 'Marcus Feld',
  date: '2026-09-12'
},
{
  id: 'DEC-1181',
  study: 'STD-3377',
  configuration: 'CFG-8768 · INT8 · L40S',
  decision: 'Rejected',
  rationale: 'Quality drop of 1.9 pt breaches the declared constraint despite a 29% latency gain.',
  owner: 'Hana Ito',
  reviewedBy: 'Marcus Feld',
  date: '2026-09-12'
},
{
  id: 'DEC-1176',
  study: 'STD-3391',
  configuration: 'CFG-8808 · FP8 · A100',
  decision: 'Deferred',
  rationale:
  'Evidence is within constraints, but reviewer requested a cost comparison against the INT8 candidate before selection.',
  owner: 'Priya Raman',
  reviewedBy: 'Pending',
  date: '2026-09-16'
},
{
  id: 'DEC-1168',
  study: 'STD-3369',
  configuration: 'CFG-8715 · INT8 · A10G',
  decision: 'Rolled back',
  rationale:
  'Throughput target met in staging but AUC variance exceeded the 0.3 pt band on the production traffic sample.',
  owner: 'Daniel Okoro',
  reviewedBy: 'Priya Raman',
  date: '2026-09-09'
},
{
  id: 'DEC-1154',
  study: 'STD-3369',
  configuration: 'CFG-8721 · FP16 · A10G',
  decision: 'Selected',
  rationale: 'Balanced profile with the smallest quality delta and reproducible throughput across five runs.',
  owner: 'Daniel Okoro',
  reviewedBy: 'Hana Ito',
  date: '2026-09-15'
}];


export const runtimeProfiles: RuntimeProfile[] = [
{
  id: 'RT-01',
  name: 'NVIDIA TensorRT',
  vendor: 'NVIDIA',
  status: 'proposed',
  precisions: ['FP16', 'FP8', 'INT8', 'INT4'],
  hardware: 'A100, H100, L40S',
  note: 'Proposed integration option. No validated benchmark or vendor affiliation is implied.'
},
{
  id: 'RT-02',
  name: 'NVIDIA Triton Inference Server',
  vendor: 'NVIDIA',
  status: 'proposed',
  precisions: ['BF16', 'FP8', 'INT8'],
  hardware: 'A100, H100',
  note: 'Serving-layer option for multi-model deployment. Framed as a proposed architecture choice.'
},
{
  id: 'RT-03',
  name: 'NVIDIA RAPIDS',
  vendor: 'NVIDIA',
  status: 'proposed',
  precisions: ['FP32', 'FP16', 'INT8'],
  hardware: 'A10G, L4',
  note: 'Considered for tabular and feature pipelines. Results remain environment-specific.'
},
{
  id: 'RT-04',
  name: 'NVIDIA NeMo',
  vendor: 'NVIDIA',
  status: 'proposed',
  precisions: ['BF16', 'FP16', 'INT8'],
  hardware: 'A100, H100',
  note: 'Speech and LLM workflow option. Listed to support the architecture narrative only.'
},
{
  id: 'RT-05',
  name: 'ONNX Runtime',
  vendor: 'Open source',
  status: 'supported',
  precisions: ['FP32', 'FP16', 'INT8'],
  hardware: 'L40S, T4, CPU',
  note: 'Currently used for vision and forecasting experiment lineage.'
},
{
  id: 'RT-06',
  name: 'OpenVINO',
  vendor: 'Intel',
  status: 'evaluating',
  precisions: ['FP32', 'BF16', 'INT8'],
  hardware: 'Sapphire Rapids CPU',
  note: 'Under evaluation for CPU-only deployment envelopes.'
}];