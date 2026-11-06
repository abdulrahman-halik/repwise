'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { STORAGE_THEME_KEY } from '@/lib/theme-script';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeClass(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [, startTransition] = useTransition();

  // Initialize theme on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_THEME_KEY) as ThemeMode | null;
      const initialMode: ThemeMode =
        stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark';
      
      const resolved = initialMode === 'system' ? getSystemTheme() : initialMode;

      setThemeState(initialMode);
      setResolvedTheme(resolved);
      applyThemeClass(resolved);
    } catch {
      // Fallback in case localStorage access fails: dark-first
      setResolvedTheme('dark');
      applyThemeClass('dark');
    }
  }, []);

  // Listen to OS system color-scheme changes if in 'system' mode
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const nextResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(nextResolved);
        applyThemeClass(nextResolved);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    startTransition(() => {
      setThemeState(mode);
      try {
        localStorage.setItem(STORAGE_THEME_KEY, mode);
      } catch {
        // localStorage not available
      }

      const resolved = mode === 'system' ? getSystemTheme() : mode;
      setResolvedTheme(resolved);
      applyThemeClass(resolved);
    });
  };

  const toggleTheme = () => {
    // If currently dark (or resolved as dark), switch to light, else switch to dark
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return safe fallback for testing or SSR without throwing
    return {
      theme: 'system' as ThemeMode,
      resolvedTheme: 'dark' as ResolvedTheme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}

