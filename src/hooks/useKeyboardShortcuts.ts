/* ── Keyboard shortcuts hook ───────────────────────────── */
'use client';

import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onSave?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onToggleShortcuts?: () => void;
  onEscape?: () => void;
  onTabSwitch?: (index: number) => void;
}

/**
 * Registers global keyboard shortcuts for the builder page.
 * All handlers are optional — only registered shortcuts fire.
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
      }
      if (ctrl && e.key === 'e') {
        e.preventDefault();
        handlers.onExport?.();
      }
      if (ctrl && e.key === 'i') {
        e.preventDefault();
        handlers.onImport?.();
      }
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo?.();
      }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handlers.onRedo?.();
      }
      if (e.key === 'Escape') {
        handlers.onEscape?.();
      }
      if (ctrl && e.key === '/') {
        e.preventDefault();
        handlers.onToggleShortcuts?.();
      }
      if (
        e.key >= '1' && e.key <= '4' && !ctrl && !e.metaKey &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        handlers.onTabSwitch?.(parseInt(e.key) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
