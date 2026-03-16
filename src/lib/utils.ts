/* ── ResumeForge — Utility Functions ─────────────────────── */

import { type ClassValue, clsx } from 'clsx';

/**
 * Merge Tailwind classes with clsx (works like shadcn's cn)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a date string (YYYY-MM) to a human-readable format
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const idx = parseInt(month, 10) - 1;
  return `${months[idx] || month} ${year}`;
}

/**
 * Format a date range
 */
export function formatDateRange(start: string, end: string, current: boolean): string {
  const s = formatDate(start);
  const e = current ? 'Present' : formatDate(end);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  return `${s} — ${e}`;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Count words in a string
 */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

/**
 * Get the font CSS class for a font family
 */
export function getFontClass(font: string): string {
  const map: Record<string, string> = {
    'Inter': 'font-sans',
    'Merriweather': 'font-serif',
    'Georgia': 'font-serif',
    'Cal Sans': 'font-display',
    'JetBrains Mono': 'font-mono',
    'Times New Roman': 'font-serif',
  };

  return map[font] || 'font-sans';
}

/**
 * Get font size CSS for resume template
 */
export function getFontSize(size: 'small' | 'medium' | 'large'): {
  name: string;
  body: string;
  h1: string;
  h2: string;
  h3: string;
  small: string;
} {
  const sizes = {
    small: { name: 'text-xl', body: 'text-[10px]', h1: 'text-lg', h2: 'text-sm', h3: 'text-xs', small: 'text-[9px]' },
    medium: { name: 'text-2xl', body: 'text-[11px]', h1: 'text-xl', h2: 'text-[15px]', h3: 'text-sm', small: 'text-[10px]' },
    large: { name: 'text-3xl', body: 'text-xs', h1: 'text-2xl', h2: 'text-base', h3: 'text-sm', small: 'text-[11px]' },
  };
  return sizes[size];
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download text as a file
 */
export function downloadText(text: string, filename: string, type = 'application/json') {
  const blob = new Blob([text], { type });
  downloadBlob(blob, filename);
}

/**
 * Ensure a URL has a protocol prefix
 */
export function ensureUrl(url: string): string {
  if (!url) return '';
  if (url.includes('@') && !url.startsWith('mailto:')) return `mailto:${url}`;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

/**
 * Check if a contact string is linkable (URL or email)
 */
export function isLinkable(text: string): boolean {
  if (!text) return false;
  return text.includes('@') || text.includes('linkedin') || text.includes('github') || text.startsWith('http') || /\.[a-z]{2,}(\/|$)/i.test(text);
}
