import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Card({
  className,
  children,
  as: Tag = 'section'




}: {className?: string;children: React.ReactNode;as?: 'section' | 'div' | 'article';}) {
  return (
    <Tag
      className={twMerge(
        'min-w-0 rounded-xl border border-line bg-surface shadow-card',
        className
      )}>
      
      {children}
    </Tag>);

}

export function CardHeader({
  title,
  subtitle,
  actions,
  className





}: {title: React.ReactNode;subtitle?: React.ReactNode;actions?: React.ReactNode;className?: string;}) {
  return (
    <div
      className={twMerge(
        'flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5',
        className
      )}>
      
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">{actions}</div>}
    </div>);

}

export function CardBody({
  className,
  children



}: {className?: string;children: React.ReactNode;}) {
  return <div className={twMerge('px-4 py-4 sm:px-5', className)}>{children}</div>;
}