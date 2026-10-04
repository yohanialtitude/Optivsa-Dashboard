export interface KpiPoint {
  label: string;
  value: number;
}

export const objectiveMix: {name: string;value: number;color: string;}[] = [
{ name: 'Latency-first', value: 38, color: '#f63049' },
{ name: 'Cost-first', value: 26, color: '#f59e0b' },
{ name: 'Quality-first', value: 22, color: '#2563eb' },
{ name: 'Balanced', value: 14, color: '#14b8a6' }];


export const trialThroughput: {month: string;completed: number;invalidated: number;}[] = [
{ month: 'Feb', completed: 148, invalidated: 22 },
{ month: 'Mar', completed: 186, invalidated: 18 },
{ month: 'Apr', completed: 164, invalidated: 31 },
{ month: 'May', completed: 212, invalidated: 24 },
{ month: 'Jun', completed: 241, invalidated: 19 },
{ month: 'Jul', completed: 198, invalidated: 27 },
{ month: 'Aug', completed: 268, invalidated: 16 },
{ month: 'Sep', completed: 304, invalidated: 12 }];


export const latencyTrend: {month: string;p50: number;p95: number;}[] = [
{ month: 'Feb', p50: 42, p95: 96 },
{ month: 'Mar', p50: 40, p95: 91 },
{ month: 'Apr', p50: 38, p95: 84 },
{ month: 'May', p50: 34, p95: 72 },
{ month: 'Jun', p50: 31, p95: 64 },
{ month: 'Jul', p50: 29, p95: 58 },
{ month: 'Aug', p50: 24, p95: 46 },
{ month: 'Sep', p50: 21, p95: 38 }];


export const tradeOffPoints: {
  id: string;
  p95: number;
  quality: number;
  cost: number;
  label: string;
}[] = [
{ id: 'CFG-8812', p95: 31, quality: 88.4, cost: 18.2, label: 'INT8 · A100' },
{ id: 'CFG-8808', p95: 38, quality: 88.9, cost: 21.6, label: 'FP8 · A100' },
{ id: 'CFG-8802', p95: 24, quality: 85.1, cost: 12.8, label: 'INT4 · A100' },
{ id: 'CFG-8774', p95: 96, quality: 91.8, cost: 40.2, label: 'FP16 · L40S' },
{ id: 'CFG-8768', p95: 68, quality: 90.1, cost: 26.4, label: 'INT8 · L40S' },
{ id: 'CFG-8690', p95: 210, quality: 89.2, cost: 31.8, label: 'FP16 · A100 40G' }];


export const runtimeBench: {
  runtime: string;
  p95: number;
  throughput: number;
  memory: number;
}[] = [
{ runtime: 'TensorRT', p95: 31, throughput: 5120, memory: 12.4 },
{ runtime: 'Triton', p95: 742, throughput: 1880, memory: 66.1 },
{ runtime: 'ONNX RT', p95: 96, throughput: 410, memory: 22.6 },
{ runtime: 'RAPIDS FIL', p95: 9, throughput: 48200, memory: 6.1 },
{ runtime: 'NeMo', p95: 210, throughput: 320, memory: 17.2 }];


export const sensitivityBands: {
  factor: string;
  low: number;
  high: number;
  note: string;
}[] = [
{
  factor: 'Batch size 8 → 32',
  low: -4,
  high: 18,
  note: 'Throughput gain with p95 regression above batch 24'
},
{
  factor: 'INT8 calibration set',
  low: -1.8,
  high: 0.4,
  note: 'Quality varies with calibration sample selection'
},
{
  factor: 'Host CPU contention',
  low: -2,
  high: 11,
  note: 'Measured under 40–80% host utilisation'
},
{
  factor: 'Sequence length 512 → 2048',
  low: -22,
  high: 6,
  note: 'Memory headroom becomes the binding constraint'
}];