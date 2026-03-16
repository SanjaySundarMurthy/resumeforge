/* ── Auto-save status hook ──────────────────────────────── */
'use client';

import { useEffect, useRef, useState } from 'react';

type AutoSaveStatus = 'saved' | 'saving' | 'unsaved';

/**
 * Tracks auto-save state based on data/style dependencies.
 * Zustand persist middleware handles the actual localStorage write;
 * this hook only manages the UI indicator.
 */
export function useAutoSave(deps: unknown[]) {
  const [status, setStatus] = useState<AutoSaveStatus>('saved');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setStatus('unsaved');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setStatus('saving');
      setTimeout(() => setStatus('saved'), 400);
    }, 1500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return status;
}
