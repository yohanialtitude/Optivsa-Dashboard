import React from 'react';
import { twMerge } from 'tailwind-merge';

const controlBase =
'w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted/70 transition-colors duration-150 ease-smooth focus:border-brand focus:outline-none disabled:opacity-60';

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className







}: {label: string;htmlFor?: string;hint?: string;error?: string;children: React.ReactNode;className?: string;}) {
  return (
    <div className={twMerge('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-ink">
        {label}
      </label>
      {children}
      {error ?
      <p className="text-[11px] text-bad">{error}</p> :

      hint && <p className="text-[11px] text-muted">{hint}</p>
      }
    </div>);

}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={twMerge(controlBase, 'h-10', className)} {...rest} />;
  }
);

export function Select({
  className,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={twMerge(controlBase, 'h-10 pr-8', className)} {...rest}>
      {children}
    </select>);

}

export function Textarea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={twMerge(controlBase, 'py-2', className)} {...rest} />;
}

export function Checkbox({
  label,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {label: string;}) {
  return (
    <label className={twMerge('flex cursor-pointer items-start gap-2 text-xs text-ink', className)}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-line text-brand accent-brand focus:ring-brand"
        {...rest} />
      
      <span>{label}</span>
    </label>);

}