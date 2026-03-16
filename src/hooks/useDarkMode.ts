/* ── Dark Mode Hook ── */
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  // Init from localStorage + system preference
  useEffect(() => {
    const stored = localStorage.getItem('resumeforge-dark-mode');
    if (stored !== null) {
      setIsDark(stored === 'true');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Sync class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('resumeforge-dark-mode', String(next));
      return next;
    });
  }, []);

  return { isDark, toggle };
}
