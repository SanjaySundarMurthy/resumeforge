/* ── ResumeForge — Design Panel v2 ──────────────────────────── */
'use client';

import { useResumeStore } from '@/store/useResumeStore';
import { COLOR_PRESETS, FONT_OPTIONS, SECTION_LABELS } from '@/types/resume';
import type { TemplateId, FontFamily, PageMode, SectionKey } from '@/types/resume';
import { Check, Eye, EyeOff, Columns, FileText, Layout } from 'lucide-react';
import TemplateMiniPreview from '@/components/resume/TemplateMiniPreview';

/* ── Template Meta ───────────────────────────────────────── */
const templateMeta: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'professional', name: 'Professional', desc: 'Classic ATS-safe' },
  { id: 'modern', name: 'Modern', desc: '30/70 sidebar split' },
  { id: 'minimal', name: 'Minimal', desc: 'Elegant & clean' },
  { id: 'executive', name: 'Executive', desc: 'Senior leadership' },
  { id: 'creative', name: 'Creative', desc: 'Timeline layout' },
  { id: 'technical', name: 'Technical', desc: 'Dev-focused dark header' },
  { id: 'elegant', name: 'Elegant', desc: 'Serif ornamental' },
  { id: 'bold', name: 'Bold', desc: 'High-impact chunky' },
];

/* ── Page mode config ────────────────────────────────────── */
const PAGE_MODES: { id: PageMode; label: string; icon: string; desc: string }[] = [
  { id: 'auto',   label: 'Auto',   icon: '⚡', desc: 'Flows naturally' },
  { id: 'single', label: '1 Page', icon: '📄', desc: 'Force to one page' },
  { id: 'double', label: '2 Pages', icon: '📋', desc: 'Two-page resume' },
  { id: 'triple', label: '3 Pages', icon: '📚', desc: 'Executive length' },
];

/* ─────────────────────────────────────────────────────────── */
export default function DesignPanel() {
  const {
    style, setTemplate, setColor, setFont, toggleSection, updateStyle,
  } = useResumeStore();

  const marginVal = (v: number | undefined, fallback: number) => v ?? fallback;

  return (
    <div className="space-y-7 p-1">

      {/* ── Template Selection ── */}
      <section>
        <h3 className="section-label mb-3">Template</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {templateMeta.map((t) => (
            <TemplateMiniPreview
              key={t.id}
              templateId={t.id}
              primaryColor={style.primaryColor}
              isActive={style.template === t.id}
              onClick={() => setTemplate(t.id)}
              name={t.name}
              desc={t.desc}
            />
          ))}
        </div>
      </section>

      {/* ── Page Mode ── */}
      <section>
        <h3 className="section-label mb-3 flex items-center gap-2">
          <Layout className="w-3.5 h-3.5" /> Page Layout
        </h3>
        <div className="grid grid-cols-4 gap-1.5">
          {PAGE_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => updateStyle({ pageMode: m.id })}
              title={m.desc}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-center transition-all ${
                style.pageMode === m.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-400/30 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-base leading-none">{m.icon}</span>
              <span className={`text-[9px] font-bold ${style.pageMode === m.id ? 'text-blue-700' : 'text-gray-600'}`}>{m.label}</span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">
          {PAGE_MODES.find(m => m.id === (style.pageMode ?? 'auto'))?.desc}
        </p>
      </section>

      {/* ── Color Presets ── */}
      <section>
        <h3 className="section-label mb-3">Color Theme</h3>
        <div className="grid grid-cols-5 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setColor(preset.primary, preset.secondary, preset.accent)}
              title={preset.name}
              className={`group relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                style.primaryColor === preset.primary
                  ? 'border-gray-400 bg-white shadow-md'
                  : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div
                className="w-7 h-7 rounded-full border-[3px] border-white shadow-md transition-transform group-hover:scale-110"
                style={{ backgroundColor: preset.primary }}
              />
              <span className="text-[8px] text-gray-500 truncate w-full text-center">{preset.name}</span>
              {style.primaryColor === preset.primary && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="text-[10px] text-gray-500 shrink-0">Custom color:</label>
          <input
            type="color"
            value={style.primaryColor}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-200"
          />
          <span className="text-[10px] text-gray-400 font-mono">{style.primaryColor}</span>
        </div>
      </section>

      {/* ── Font Family ── */}
      <section>
        <h3 className="section-label mb-3">Font Family</h3>
        <div className="space-y-1.5">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFont(f.value as FontFamily)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all ${
                style.fontFamily === f.value
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div>
                <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: f.value }}>{f.label}</span>
                <span className="text-[10px] text-gray-400 ml-2">{f.category}</span>
              </div>
              {style.fontFamily === f.value && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
            </button>
          ))}
        </div>
      </section>

      {/* ── Font Size ── */}
      <section>
        <h3 className="section-label mb-3">Font Size</h3>
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => updateStyle({ fontSize: sz })}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                style.fontSize === sz
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {sz === 'small' ? 'Small' : sz === 'medium' ? 'Medium' : 'Large'}
            </button>
          ))}
        </div>
      </section>

      {/* ── Margins & Spacing ── */}
      <section>
        <h3 className="section-label mb-3 flex items-center gap-2">
          <Columns className="w-3.5 h-3.5" /> Margins & Spacing
        </h3>
        <div className="space-y-3">
          {/* Top / Bottom */}
          <div className="grid grid-cols-2 gap-3">
            <SliderField
              label="Top margin"
              value={marginVal(style.marginTop, 48)}
              min={16} max={96} step={4}
              unit="px"
              onChange={(v) => updateStyle({ marginTop: v })}
            />
            <SliderField
              label="Bottom margin"
              value={marginVal(style.marginBottom, 48)}
              min={16} max={96} step={4}
              unit="px"
              onChange={(v) => updateStyle({ marginBottom: v })}
            />
          </div>
          {/* Left / Right */}
          <div className="grid grid-cols-2 gap-3">
            <SliderField
              label="Left margin"
              value={marginVal(style.marginLeft, 56)}
              min={16} max={96} step={4}
              unit="px"
              onChange={(v) => updateStyle({ marginLeft: v })}
            />
            <SliderField
              label="Right margin"
              value={marginVal(style.marginRight, 56)}
              min={16} max={96} step={4}
              unit="px"
              onChange={(v) => updateStyle({ marginRight: v })}
            />
          </div>
          {/* Paragraph spacing */}
          <SliderField
            label="Paragraph spacing"
            value={marginVal(style.paragraphSpacing, 4)}
            min={0} max={16} step={2}
            unit="px"
            onChange={(v) => updateStyle({ paragraphSpacing: v })}
          />
        </div>
      </section>

      {/* ── Display Options ── */}
      <section>
        <h3 className="section-label mb-3">Display Options</h3>
        <label className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer select-none">
          <div>
            <p className="text-xs font-semibold text-gray-800">Page break guides</p>
            <p className="text-[10px] text-gray-400">Show dashed A4 break lines in preview</p>
          </div>
          <div
            onClick={() => updateStyle({ showPageBreakIndicators: !(style.showPageBreakIndicators ?? true) })}
            className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
              (style.showPageBreakIndicators ?? true) ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              (style.showPageBreakIndicators ?? true) ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </div>
        </label>
      </section>

      {/* ── Section Visibility ── */}
      <section>
        <h3 className="section-label mb-3 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" /> Section Visibility
        </h3>
        <div className="space-y-1">
          {style.sectionOrder.map((section) => {
            const isHidden = style.hiddenSections.includes(section);
            return (
              <button
                key={section}
                onClick={() => toggleSection(section)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                  isHidden
                    ? 'bg-gray-50 text-gray-400 border border-gray-100'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <span className="text-xs font-medium">{SECTION_LABELS[section]}</span>
                {isHidden
                  ? <EyeOff className="w-3.5 h-3.5 text-gray-300" />
                  : <Eye className="w-3.5 h-3.5 text-blue-500" />
                }
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}

/* ── Slider Field Helper ─────────────────────────────────── */
function SliderField({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-gray-500">{label}</span>
        <span className="text-[10px] font-bold text-gray-700 tabular-nums">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
      />
    </div>
  );
}

/* Add CSS for section-label util if not already in globals */
