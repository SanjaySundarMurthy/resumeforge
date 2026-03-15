/* ── ResumeForge — Design Panel ───────────────────────────── */

'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { COLOR_PRESETS, FONT_OPTIONS } from '@/types/resume';
import type { TemplateId, FontFamily } from '@/types/resume';
import { Check, Eye, EyeOff } from 'lucide-react';
import { SECTION_LABELS } from '@/types/resume';
import type { SectionKey } from '@/types/resume';

/* ── Template Cards ──────────────────────────────────────── */

const templateMeta: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'professional', name: 'Professional', desc: 'Classic & clean' },
  { id: 'modern', name: 'Modern', desc: 'Contemporary feel' },
  { id: 'minimal', name: 'Minimal', desc: 'Elegant simplicity' },
  { id: 'executive', name: 'Executive', desc: 'Senior leadership' },
  { id: 'creative', name: 'Creative', desc: 'Bold & expressive' },
  { id: 'technical', name: 'Technical', desc: 'Engineering focus' },
  { id: 'elegant', name: 'Elegant', desc: 'Sophisticated serif' },
  { id: 'bold', name: 'Bold', desc: 'High-impact design' },
];

export default function DesignPanel() {
  const { style, setTemplate, setColor, setFont, toggleSection, updateStyle } = useResumeStore();

  return (
    <div className="space-y-6 p-1">
      {/* Template Selection */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Template</h3>
        <div className="grid grid-cols-2 gap-2">
          {templateMeta.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                style.template === t.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-900">{t.name}</span>
                {style.template === t.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </div>
              <span className="text-[10px] text-gray-500">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Presets */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Color Theme</h3>
        <div className="grid grid-cols-5 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setColor(preset.primary, preset.secondary, preset.accent)}
              className={`group relative flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                style.primaryColor === preset.primary
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
              title={preset.name}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: preset.primary }}
              />
              <span className="text-[9px] text-gray-500 truncate w-full text-center">{preset.name}</span>
              {style.primaryColor === preset.primary && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        {/* Custom color */}
        <div className="mt-2 flex items-center gap-2">
          <label className="text-[10px] text-gray-500">Custom:</label>
          <input
            type="color"
            value={style.primaryColor}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-200"
          />
          <span className="text-[10px] text-gray-400 font-mono">{style.primaryColor}</span>
        </div>
      </div>

      {/* Font Selection */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Font Family</h3>
        <div className="space-y-1.5">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFont(f.value as FontFamily)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                style.fontFamily === f.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div>
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: f.value }}>{f.label}</span>
                <span className="text-[10px] text-gray-400 ml-2">{f.category}</span>
              </div>
              {style.fontFamily === f.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Font Size</h3>
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateStyle({ fontSize: size })}
              className={`flex-1 py-2 rounded-lg border text-xs font-medium capitalize transition-all ${
                style.fontSize === size
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Section Visibility */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Show / Hide Sections</h3>
        <div className="space-y-1">
          {style.sectionOrder.map((section) => {
            const isHidden = style.hiddenSections.includes(section);
            return (
              <button
                key={section}
                onClick={() => toggleSection(section)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-xs ${
                  isHidden ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{SECTION_LABELS[section]}</span>
                {isHidden ? (
                  <EyeOff className="w-3.5 h-3.5 text-gray-300" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
