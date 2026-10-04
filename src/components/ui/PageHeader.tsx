import React from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions





}: {eyebrow?: string;title: string;description?: string;actions?: React.ReactNode;}) {
  return (
    <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-medium text-brand">{eyebrow}</p>}
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-3xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">{actions}</div>}
    </header>);

}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon





}: {title: string;description: string;action?: React.ReactNode;icon?: React.ComponentType<{className?: string;}>;}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      {Icon &&
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-raised text-muted">
          <Icon className="h-5 w-5" />
        </span>
      }
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted">{description}</p>
      </div>
      {action}
    </div>);

}