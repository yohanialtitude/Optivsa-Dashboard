import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'optivsa.theme';

export function ThemeProvider({
  children,
  defaultTheme = 'light'



}: {children: React.ReactNode;defaultTheme?: Theme;}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {

      /* storage unavailable */}
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {

      /* storage unavailable */}
  }, [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((prev) => prev === 'light' ? 'dark' : 'light'),
    []
  );

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

export function useChartPalette() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return {
    grid: dark ? '#1f2633' : '#eef1f6',
    axis: dark ? '#8d9aae' : '#667085',
    tooltipBg: dark ? '#171c26' : '#ffffff',
    tooltipBorder: dark ? '#242b38' : '#e5e8ef',
    tooltipText: dark ? '#e9edf5' : '#101828',
    brand: '#f63049',
    info: '#2563eb',
    amber: '#f59e0b',
    teal: '#14b8a6'
  };
}