import React from 'react';
import { CheckIcon } from 'lucide-react';
import { Logo } from '../layout/Logo';

const evidencePoints = [
'Register approved models, datasets and runtime configurations',
'Define optimization objectives and operational constraints',
'Compare experiment and benchmark evidence side by side',
'Record review, selection and deployment decisions'];


export function AuthShell({ children }: {children: React.ReactNode;}) {
  return (
    <div className="force-light flex min-h-screen w-full bg-white text-[#101828]">
      <aside className="relative hidden flex-1 flex-col justify-start gap-7 overflow-hidden border-r border-[#f3d8dc] bg-[#fff5f6] px-12 py-10 lg:flex">
        <Logo large />

        <div className="max-w-md">
          <p className="text-xs font-medium text-[#f63049]">AI Model Optimization &amp; Decision Engine</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#101828]">
            Choose the model configuration with evidence.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#667085]">
            Optivsa organizes experiments, benchmark evidence and operational constraints so teams
            can select a suitable deployment configuration and show why.
          </p>
        </div>

        <ul className="max-w-md space-y-2.5">
          {evidencePoints.map((point) =>
          <li key={point} className="flex items-start gap-3 text-sm text-[#344054]">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f63049]/10 text-[#f63049]">
                <CheckIcon className="h-3 w-3" />
              </span>
              {point}
            </li>
          )}
        </ul>

        <div className="max-w-md rounded-xl border border-[#f3d8dc] bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.04)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#98a2b3]">
            Workflow
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#475467]">
            Models &amp; objectives → validation → optimization trials → trade-off intelligence →
            expert decision
          </p>
        </div>
      </aside>

      <div className="flex w-full flex-col justify-center border-l border-[#eef0f4] bg-white px-5 py-10 shadow-[-12px_0_32px_rgba(16,24,40,0.03)] sm:px-10 lg:w-[52%] lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {children}
          <p className="mt-8 text-[11px] leading-relaxed text-[#667085]">
            Optivsa presents optimization results as decision-making evidence. Performance, quality,
            cost and resource results are environment-specific and require validation.
          </p>
        </div>
      </div>
    </div>);

}