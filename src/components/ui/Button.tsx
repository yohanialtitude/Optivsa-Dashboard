import React from "react";
import { twMerge } from "tailwind-merge";
import { Loader2Icon, BoxIcon } from "lucide-react";
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: BoxIcon;
  iconRight?: BoxIcon;
  loading?: boolean;
  fullWidth?: boolean;
}
const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover border border-transparent',
  secondary: 'bg-surface text-ink border border-line hover:bg-raised',
  ghost: 'bg-transparent text-muted border border-transparent hover:bg-raised hover:text-ink',
  danger: 'bg-transparent text-bad border border-line hover:bg-brand-soft'
};
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2'
};
export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return <button type="button" disabled={disabled || loading} className={twMerge('inline-flex items-center justify-center rounded-lg font-medium transition-[background-color,color,border-color,transform] duration-150 ease-smooth active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], fullWidth && 'w-full', className)} {...rest}>
      {loading ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden /> : Icon && <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden />}
      {children}
      {IconRight && !loading && <IconRight className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden />}
    </button>;
}