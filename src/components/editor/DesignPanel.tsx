/* ── ResumeForge — Design Panel v3 ──────────────────────────── */
'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { COLOR_PRESETS, FONT_OPTIONS, SECTION_LABELS } from '@/types/resume';
import type { TemplateId, FontFamily, PageMode, SectionKey } from '@/types/resume';
import {
  Check, Eye, EyeOff, Columns, FileText, Layout, Type,
  Maximize, Minimize, AlignJustify, SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
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
const PAGE_MODES: { id: PageMode; label: string; icon: typeof Layout; desc: string }[] = [
  { id: 'auto',   label: 'Auto',   icon: Layout, desc: 'Content flows naturally across pages' },
  { id: 'single', label: '1 Page', icon: FileText, desc: 'Force-fit all content to one page' },
  { id: 'double', label: '2 Pages', icon: Columns, desc: 'Balanced two-page resume' },
  { id: 'triple', label: '3 Pages', icon: AlignJustify, desc: 'Executive-length three pages' },
];

/* ── Margin presets ──────────────────────────────────────── */
const MARGIN_PRESETS = [
  { name: 'Compact', top: 24, bottom: 24, left: 32, right: 32, desc: 'Max content space' },
  { name: 'Normal', top: 48, bottom: 48, left: 56, right: 56, desc: 'Standard professional' },
  { name: 'Wide', top: 56, bottom: 56, left: 72, right: 72, desc: 'Spacious & elegant' },
  { name: 'Academic', top: 72, bottom: 72, left: 80, right: 80, desc: 'Academic style margins' },
];

/* ─────────────────────────────────────────────────────────── */
export default function DesignPanel() {
  const {
    style, setTemplate, setColor, setFont, toggleSection, updateStyle,
  } = useResumeStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const marginVal = (v: number | undefined, fallback: number) => v ?? fallback;

  const resetFormatting = () => {
    updateStyle({
      marginTop: 48, marginBottom: 48, marginLeft: 56, marginRight: 56,
      paragraphSpacing: 4, lineHeight: 1.5, sectionSpacing: 16,
      pageMode: 'auto', showPageBreakIndicators: true,
    });
  };

  return (
    <div className="space-y-7 p-1">

      {/* ── Template Selection ── */}
      <section>
        <h3 className="section-label mb-3">Template</h3>
        <div className="grid grid-cols-2 gap-3">
          {templateMeta.map((t, i) => (
            <div key={t.id} style={{ animationDelay: `${i * 50}ms` }} className="template-stagger">
              <TemplateMiniPreview
                templateId={t.id}
                primaryColor={style.primaryColor}
                isActive={style.template === t.id}
                onClick={() => setTemplate(t.id)}
                name={t.name}
                desc={t.desc}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Page Layout ── */}
      <section>
        <h3 className="section-label mb-3">
          <Layout className="w-3.5 h-3.5 mr-1.5" /> Page Layout
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {PAGE_MODES.map((m) => {
            const Icon = m.icon;
            const active = (style.pageMode ?? 'auto') === m.id;
            return (
              <button
                key={m.id}
                onClick={() => updateStyle({ pageMode: m.id })}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  active
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-400/30 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                <div>
                  <p className={`text-[11px] font-bold ${active ? 'text-blue-700' : 'text-gray-700'}`}>{m.label}</p>
                  <p className="text-[9px] text-gray-400">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Color Theme ── */}
      <section>
        <h3 className="section-label mb-3">Color Theme</h3>
        <div className="grid grid-cols-5 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setColor(preset.primary, preset.secondary, preset.accent)}
              title={preset.name}
              className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                style.primaryColor === preset.primary
                  ? 'border-gray-400 bg-white shadow-md scale-105'
                  : 'border-gray-100 hover:border-gray-300 hover:shadow-sm hover:scale-105'
              }`}
            >
              <div
                className="w-7 h-7 rounded-full border-[3px] border-white shadow-md transition-transform group-hover:scale-110"
                style={{ backgroundColor: preset.primary }}
              />
              <span className="text-[8px] text-gray-500 truncate w-full text-center">{preset.name}</span>
              {style.primaryColor === preset.primary && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow animate-scale-pop">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 bg-gray-50 rounded-lg p-2">
          <label className="text-[10px] text-gray-500 shrink-0">Custom:</label>
          <input
            type="color"
            value={style.primaryColor}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-200 hover:scale-110 transition-transform"
          />
          <span className="text-[10px] text-gray-400 font-mono">{style.primaryColor}</span>
        </div>
      </section>

      {/* ── Typography ── */}
      <section>
        <h3 className="section-label mb-3">
          <Type className="w-3.5 h-3.5 mr-1.5" /> Typography
        </h3>

        {/* Font Family */}
        <div className="space-y-1.5 mb-4">
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
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold w-8 text-center" style={{ fontFamily: f.value }}>Aa</span>
                <div>
                  <span className="text-xs font-semibold text-gray-900" style={{ fontFamily: f.value }}>{f.label}</span>
                  <span className="text-[10px] text-gray-400 ml-1.5">{f.category}</span>
                </div>
              </div>
              {style.fontFamily === f.value && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
            </button>
          ))}
        </div>

        {/* Font Size */}
        <p className="text-[10px] text-gray-500 mb-2 font-medium">Font Size</p>
        <div className="flex gap-2 mb-4">
          {([
            { id: 'small', label: 'Small', sample: 'Aa', px: '10px' },
            { id: 'medium', label: 'Medium', sample: 'Aa', px: '11px' },
            { id: 'large', label: 'Large', sample: 'Aa', px: '12.5px' },
          ] as const).map((sz) => (
            <button
              key={sz.id}
              onClick={() => updateStyle({ fontSize: sz.id })}
              className={`flex-1 py-2 rounded-xl border text-center transition-all ${
                style.fontSize === sz.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span style={{ fontSize: sz.px, fontFamily: style.fontFamily }} className="block font-semibold">{sz.sample}</span>
              <span className="text-[9px] block mt-0.5">{sz.label}</span>
            </button>
          ))}
        </div>

        {/* Line Height */}
        <SliderField
          label="Line height"
          value={style.lineHeight ?? 1.5}
          min={1.0} max={2.2} step={0.1}
          unit="x"
          onChange={(v) => updateStyle({ lineHeight: v })}
        />
      </section>

      {/* ── Formatting Presets ── */}
      <section>
        <h3 className="section-label mb-3">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" /> Margin Presets
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {MARGIN_PRESETS.map((p) => {
            const active = marginVal(style.marginTop, 48) === p.top && marginVal(style.marginLeft, 56) === p.left;
            return (
              <button
                key={p.name}
                onClick={() => updateStyle({
                  marginTop: p.top, marginBottom: p.bottom,
                  marginLeft: p.left, marginRight: p.right,
                })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  active
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {/* Visual margin indicator — represents content area within page */}
                <div className={`w-full aspect-[5/7] rounded-md border-2 mb-1.5 relative overflow-hidden ${
                  active ? 'border-blue-300' : 'border-gray-200'
                }`}>
                  {/* Page background */}
                  <div className="absolute inset-0 bg-gray-50" />
                  {/* Content area: inset based on margin preset values scaled to indicator box */}
                  <div
                    className={`absolute rounded-sm ${active ? 'bg-blue-200/80' : 'bg-gray-200/70'}`}
                    style={{
                      top:    `${Math.round((p.top    / 96) * 35)}%`,
                      bottom: `${Math.round((p.bottom / 96) * 35)}%`,
                      left:   `${Math.round((p.left   / 96) * 35)}%`,
                      right:  `${Math.round((p.right  / 96) * 35)}%`,
                    }}
                  />
                </div>
                <p className={`text-[10px] font-bold ${active ? 'text-blue-700' : 'text-gray-700'}`}>{p.name}</p>
                <p className="text-[8px] text-gray-400">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Advanced Spacing (expandable) ── */}
      <section>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between py-2"
        >
          <h3 className="section-label">
            <Columns className="w-3.5 h-3.5 mr-1.5" /> Fine-tune Spacing
          </h3>
          <span className="text-[10px] text-blue-600 font-semibold">
            {showAdvanced ? 'Collapse' : 'Expand'}
          </span>
        </button>

        {showAdvanced && (
          <div className="space-y-3 mt-2 animate-fade-in">
            <div className="flex justify-end mb-1">
              <button
                onClick={resetFormatting}
                className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset to defaults
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SliderField
                label="Top margin"
                value={marginVal(style.marginTop, 48)}
                min={8} max={96} step={4}
                unit="px"
                onChange={(v) => updateStyle({ marginTop: v })}
              />
              <SliderField
                label="Bottom margin"
                value={marginVal(style.marginBottom, 48)}
                min={8} max={96} step={4}
                unit="px"
                onChange={(v) => updateStyle({ marginBottom: v })}
              />
            </div>
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
            <SliderField
              label="Section spacing"
              value={style.sectionSpacing ?? 16}
              min={8} max={48} step={4}
              unit="px"
              onChange={(v) => updateStyle({ sectionSpacing: v })}
            />
            <SliderField
              label="Paragraph spacing"
              value={marginVal(style.paragraphSpacing, 4)}
              min={0} max={16} step={1}
              unit="px"
              onChange={(v) => updateStyle({ paragraphSpacing: v })}
            />
          </div>
        )}
      </section>

      {/* ── Display Toggles ── */}
      <section>
        <h3 className="section-label mb-3">Display Options</h3>
        <div className="space-y-2">
          <ToggleField
            title="Page break guides"
            desc="Show dashed A4 break lines"
            checked={style.showPageBreakIndicators ?? true}
            onChange={(v) => updateStyle({ showPageBreakIndicators: v })}
          />
          <ToggleField
            title="Show section icons"
            desc="Display icons next to section headings"
            checked={style.showIcons ?? true}
            onChange={(v) => updateStyle({ showIcons: v })}
          />
          <ToggleField
            title="Show photo"
            desc="Display profile photo if uploaded"
            checked={style.showPhoto ?? false}
            onChange={(v) => updateStyle({ showPhoto: v })}
          />
        </div>
      </section>

      {/* ── Section Visibility ── */}
      <section>
        <h3 className="section-label mb-3">
          <FileText className="w-3.5 h-3.5 mr-1.5" /> Section Visibility
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
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-gray-500 font-medium">{label}</span>
        <span className="text-[10px] font-bold text-gray-700 tabular-nums bg-gray-100 px-1.5 rounded">
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-blue-600 cursor-pointer slider-styled"
        />
        <div
          className="absolute top-0 left-0 h-2 rounded-full bg-blue-500/30 pointer-events-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── Toggle Switch Helper ────────────────────────────────── */
function ToggleField({
  title, desc, checked, onChange,
}: {
  title: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
      <div>
        <p className="text-xs font-semibold text-gray-800">{title}</p>
        <p className="text-[10px] text-gray-400">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative rounded-full transition-colors shrink-0 ${
          checked ? 'bg-blue-500' : 'bg-gray-200'
        }`}
        style={{ width: '40px', height: '22px' }}
      >
        <div className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-md transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );
}
