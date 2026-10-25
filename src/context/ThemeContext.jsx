import React, { useState, useEffect, useCallback } from 'react';
import { ThemeContext } from './themeContextInstance';

const THEME_STORAGE_KEY = 'cohort_theme';

/**
 * ThemeProvider component
 * Provides centralized, persistent, accessible light/dark theme state.
 * Synchronizes with documentElement.classList ('dark') and localStorage ('cohort_theme').
 * Falls back to system prefers-color-scheme when no user preference is stored.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback in case of storage sandboxing
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  const applyTheme = useCallback((targetTheme) => {
    const isDarkTarget = targetTheme === 'dark';
    if (isDarkTarget) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, targetTheme);
    } catch {
      // Ignore localStorage write errors
    }
    setThemeState(targetTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, applyTheme]);

  // Synchronize OS preferences if no explicit user override is stored
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      try {
        const userSaved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!userSaved) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      } catch {
        // ignore
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [applyTheme]);

  // Ensure DOM matches theme state on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
