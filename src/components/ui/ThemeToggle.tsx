import React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle({ compact = false }: {compact?: boolean;}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors duration-150 ease-smooth hover:text-ink">
        
        {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      </button>);

  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark theme"
      className="relative flex h-9 w-[72px] items-center rounded-full border border-line bg-raised px-1">
      
      <span
        className="absolute h-7 w-7 rounded-full bg-surface shadow-card transition-transform duration-200 ease-smooth"
        style={{ transform: isDark ? 'translateX(36px)' : 'translateX(0px)' }}
        aria-hidden />
      
      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <SunIcon className={`h-4 w-4 ${isDark ? 'text-muted' : 'text-brand'}`} aria-hidden />
        <MoonIcon className={`h-4 w-4 ${isDark ? 'text-brand' : 'text-muted'}`} aria-hidden />
      </span>
    </button>);

}