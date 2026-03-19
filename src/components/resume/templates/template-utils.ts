/* ── Shared template formatting utilities ── */
import type { HeaderStyle, SkillDisplayMode, DateAlignment } from '@/types/resume';

export function formatHeaderText(text: string, headerStyle: HeaderStyle): string {
  switch (headerStyle) {
    case 'uppercase-underline':
    case 'uppercase': return text.toUpperCase();
    case 'capitalize-underline':
    case 'capitalize': return text;
    case 'bold-only': return text;
    default: return text.toUpperCase();
  }
}

export function showHeaderUnderline(headerStyle: HeaderStyle): boolean {
  return headerStyle === 'uppercase-underline' || headerStyle === 'capitalize-underline';
}
