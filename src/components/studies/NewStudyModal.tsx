import React, { useState } from 'react';
import { toast } from 'sonner';
import { CheckIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, Input, Select, Checkbox, Textarea } from '../ui/Field';
import { models } from '../../data/models';

const steps = ['Inputs', 'Objectives', 'Review'];

interface FormState {
  name: string;
  model: string;
  dataset: string;
  runtime: string;
  hardware: string;
  objective: string;
  maxLatency: string;
  maxQualityDrop: string;
  maxCost: string;
  precisions: string[];
  reviewer: string;
  notes: string;
  requireReview: boolean;
}

const initialState: FormState = {
  name: '',
  model: models[0].name + ' ' + models[0].version,
  dataset: models[0].dataset,
  runtime: 'TensorRT (proposed)',
  hardware: 'A100 80GB',
  objective: 'Latency-first',
  maxLatency: '45',
  maxQualityDrop: '1.0',
  maxCost: '38',
  precisions: ['FP16', 'INT8'],
  reviewer: 'Priya Raman',
  notes: '',
  requireReview: true
};

export function NewStudyModal({ open, onClose }: {open: boolean;onClose: () => void;}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof FormState,>(key: K, value: FormState[K]) =>
  setForm((prev) => ({ ...prev, [key]: value }));

  const close = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setForm(initialState);
      setError('');
    }, 200);
  };

  const next = () => {
    if (step === 0 && !form.name.trim()) {
      setError('Give the study a name so reviewers can identify it.');
      return;
    }
    setError('');
    setStep((value) => Math.min(value + 1, steps.length - 1));
  };

  const submit = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitting(false);
    toast.success('Optimization study queued', {
      description: `${form.name} · ${form.objective} · awaiting input and environment validation.`
    });
    close();
  };

  const togglePrecision = (value: string) =>
  update(
    'precisions',
    form.precisions.includes(value) ?
    form.precisions.filter((item) => item !== value) :
    [...form.precisions, value]
  );

  return (
    <Modal
      open={open}
      onClose={close}
      title="New optimization study"
      description="Register the inputs, declare objectives and constraints, then queue validation."
      size="lg"
      footer={
      <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          {step > 0 &&
        <Button variant="secondary" onClick={() => setStep((value) => value - 1)}>
              Back
            </Button>
        }
          {step < steps.length - 1 ?
        <Button onClick={next}>Continue</Button> :

        <Button onClick={submit} loading={submitting} icon={CheckIcon}>
              Queue study
            </Button>
        }
        </>
      }>
      
      <ol className="mb-5 flex items-center gap-2" aria-label="Study setup progress">
        {steps.map((label, index) =>
        <li key={label} className="flex flex-1 items-center gap-2">
            <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
            index <= step ?
            'border-brand bg-brand text-white' :
            'border-line bg-surface text-muted'}`
            }>
            
              {index + 1}
            </span>
            <span
            className={`text-xs ${index === step ? 'font-medium text-ink' : 'text-muted'}`}>
            
              {label}
            </span>
            {index < steps.length - 1 && <span className="h-px flex-1 bg-line" aria-hidden />}
          </li>
        )}
      </ol>

      {step === 0 &&
      <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Study name" htmlFor="study-name" className="sm:col-span-2" error={error}>
            <Input
            id="study-name"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="e.g. Rerank latency envelope Q4" />
          
          </Field>
          <Field label="Registered model" htmlFor="study-model">
            <Select
            id="study-model"
            value={form.model}
            onChange={(event) => {
              const selected = models.find(
                (model) => `${model.name} ${model.version}` === event.target.value
              );
              update('model', event.target.value);
              if (selected) update('dataset', selected.dataset);
            }}>
            
              {models.
            filter((model) => model.status !== 'deprecated').
            map((model) =>
            <option key={model.id} value={`${model.name} ${model.version}`}>
                    {model.name} {model.version}
                  </option>
            )}
            </Select>
          </Field>
          <Field label="Evaluation dataset" htmlFor="study-dataset" hint="Snapshot is pinned at launch.">
            <Input
            id="study-dataset"
            value={form.dataset}
            onChange={(event) => update('dataset', event.target.value)} />
          
          </Field>
          <Field label="Runtime profile" htmlFor="study-runtime">
            <Select
            id="study-runtime"
            value={form.runtime}
            onChange={(event) => update('runtime', event.target.value)}>
            
              <option>TensorRT (proposed)</option>
              <option>Triton (proposed)</option>
              <option>NeMo (proposed)</option>
              <option>RAPIDS (proposed)</option>
              <option>ONNX Runtime</option>
              <option>OpenVINO</option>
            </Select>
          </Field>
          <Field label="Hardware profile" htmlFor="study-hardware">
            <Select
            id="study-hardware"
            value={form.hardware}
            onChange={(event) => update('hardware', event.target.value)}>
            
              <option>H100 80GB</option>
              <option>A100 80GB</option>
              <option>A100 40GB</option>
              <option>L40S</option>
              <option>A10G</option>
              <option>T4</option>
              <option>CPU (Sapphire Rapids)</option>
            </Select>
          </Field>
        </div>
      }

      {step === 1 &&
      <div className="space-y-4">
          <Field label="Primary objective" htmlFor="study-objective">
            <Select
            id="study-objective"
            value={form.objective}
            onChange={(event) => update('objective', event.target.value)}>
            
              <option>Latency-first</option>
              <option>Quality-first</option>
              <option>Cost-first</option>
              <option>Balanced</option>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Max p95 latency (ms)" htmlFor="c-latency">
              <Input
              id="c-latency"
              type="number"
              value={form.maxLatency}
              onChange={(event) => update('maxLatency', event.target.value)} />
            
            </Field>
            <Field label="Max quality drop (pt)" htmlFor="c-quality">
              <Input
              id="c-quality"
              type="number"
              step="0.1"
              value={form.maxQualityDrop}
              onChange={(event) => update('maxQualityDrop', event.target.value)} />
            
            </Field>
            <Field label="Max cost / 1M tok ($)" htmlFor="c-cost">
              <Input
              id="c-cost"
              type="number"
              value={form.maxCost}
              onChange={(event) => update('maxCost', event.target.value)} />
            
            </Field>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-ink">Precision search space</p>
            <div className="flex flex-wrap gap-2">
              {['BF16', 'FP16', 'FP8', 'INT8', 'INT4'].map((precision) => {
              const active = form.precisions.includes(precision);
              return (
                <button
                  key={precision}
                  type="button"
                  onClick={() => togglePrecision(precision)}
                  aria-pressed={active}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors duration-150 ease-smooth ${
                  active ?
                  'border-brand bg-brand-soft text-brand' :
                  'border-line text-muted hover:text-ink'}`
                  }>
                  
                    {precision}
                  </button>);

            })}
            </div>
          </div>
          <Field label="Reviewer / owner" htmlFor="study-reviewer">
            <Select
            id="study-reviewer"
            value={form.reviewer}
            onChange={(event) => update('reviewer', event.target.value)}>
            
              <option>Priya Raman</option>
              <option>Marcus Feld</option>
              <option>Hana Ito</option>
              <option>Daniel Okoro</option>
              <option>Lena Brandt</option>
            </Select>
          </Field>
          <Checkbox
          label="Require human approval before any configuration can be marked as selected"
          checked={form.requireReview}
          onChange={(event) => update('requireReview', event.target.checked)} />
        
        </div>
      }

      {step === 2 &&
      <div className="space-y-4">
          <dl className="grid gap-x-6 gap-y-3 rounded-xl border border-line bg-raised p-4 sm:grid-cols-2">
            {[
          ['Study', form.name || '—'],
          ['Model', form.model],
          ['Dataset', form.dataset],
          ['Runtime', form.runtime],
          ['Hardware', form.hardware],
          ['Objective', form.objective],
          [
          'Constraints',
          `p95 ≤ ${form.maxLatency} ms · quality ≤ ${form.maxQualityDrop} pt · cost ≤ $${form.maxCost}`],

          ['Precisions', form.precisions.join(', ') || 'None selected'],
          ['Reviewer', form.reviewer],
          ['Approval policy', form.requireReview ? 'Human approval required' : 'Auto-select allowed']].
          map(([label, value]) =>
          <div key={label}>
                <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
                <dd className="mt-0.5 text-sm text-ink">{value}</dd>
              </div>
          )}
          </dl>
          <Field label="Reviewer notes" htmlFor="study-notes" hint="Recorded with the decision history.">
            <Textarea
            id="study-notes"
            rows={3}
            value={form.notes}
            onChange={(event) => update('notes', event.target.value)}
            placeholder="Context, prior results to compare against, known environment differences…" />
          
          </Field>
          <p className="rounded-lg border border-line bg-brand-soft px-3 py-2.5 text-[11px] text-ink">
            The study will run input and environment validation before any trial executes. Results
            are environment-specific and are presented as evidence, not as a guaranteed global
            optimum.
          </p>
        </div>
      }
    </Modal>);

}