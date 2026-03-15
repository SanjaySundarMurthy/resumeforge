/* ── Template Mini Preview — Animated Visual Layout Thumbnails ── */
'use client';

import { useState } from 'react';
import type { TemplateId } from '@/types/resume';

interface Props {
  templateId: TemplateId;
  primaryColor: string;
  isActive?: boolean;
  onClick?: () => void;
  name: string;
  desc: string;
}

export default function TemplateMiniPreview({ templateId, primaryColor, isActive, onClick, name, desc }: Props) {
  const c = primaryColor;
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full text-left rounded-xl overflow-hidden transition-all duration-300 group template-card-enter ${
        isActive
          ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/20 scale-[1.02]'
          : 'border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* Mini SVG Preview with shimmer */}
      <div className="bg-white relative overflow-hidden" style={{ paddingTop: '130%' }}>
        <div className={`absolute inset-0 transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}>
          {templateId === 'professional' && <ProfessionalPreview c={c} animate={hovered} />}
          {templateId === 'modern' && <ModernPreview c={c} animate={hovered} />}
          {templateId === 'minimal' && <MinimalPreview c={c} animate={hovered} />}
          {templateId === 'executive' && <ExecutivePreview c={c} animate={hovered} />}
          {templateId === 'creative' && <CreativePreview c={c} animate={hovered} />}
          {templateId === 'technical' && <TechnicalPreview c={c} animate={hovered} />}
          {templateId === 'elegant' && <ElegantPreview c={c} animate={hovered} />}
          {templateId === 'bold' && <BoldPreview c={c} animate={hovered} />}
        </div>
        {/* Shimmer overlay on hover */}
        {hovered && !isActive && (
          <div className="absolute inset-0 template-shimmer pointer-events-none" />
        )}
        {/* Active check */}
        {isActive && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-scale-pop">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
        )}
        {/* Hover overlay label */}
        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-2.5 pt-6 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-[10px] font-bold text-white">{name}</p>
          <p className="text-[8px] text-white/80">{desc}</p>
        </div>
      </div>
      {/* Label */}
      <div className={`px-2.5 py-2 transition-all duration-300 ${isActive ? 'bg-blue-50' : 'bg-gray-50 group-hover:bg-white'}`}>
        <div className="flex items-center justify-between">
          <p className={`text-[11px] font-bold ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>{name}</p>
          {isActive && <span className="text-[8px] font-bold text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded">ACTIVE</span>}
        </div>
        <p className="text-[9px] text-gray-400 mt-0.5">{desc}</p>
      </div>
    </button>
  );
}

/* ── Animated SVG Previews ──────────────────────────────── */
type PrevProps = { c: string; animate: boolean };

function ProfessionalPreview({ c, animate }: PrevProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="12" y="8" width={animate ? 50 : 45} height="5" rx="2" fill="#111" opacity="0.85" className="svg-transition" />
      <rect x="12" y="15" width={animate ? 38 : 32} height="3" rx="1.5" fill={c} opacity="0.8" className="svg-transition" />
      <rect x="12" y="20" width="76" height="1.5" rx="0.75" fill={c} opacity="0.35" />
      <rect x="12" y="25" width="15" height="1.5" rx="0.75" fill="#bbb" />
      <rect x="30" y="25" width="12" height="1.5" rx="0.75" fill="#bbb" />
      <rect x="45" y="25" width="20" height="1.5" rx="0.75" fill="#bbb" />
      {[32, 58, 86].map((y, i) => (
        <g key={i} opacity={animate ? 1 : 0.85} className="svg-transition">
          <rect x="12" y={y} width="28" height="2.5" rx="1" fill="#111" opacity="0.7" />
          <rect x="12" y={y + 1.25} width="76" height="0.6" fill={c} opacity="0.25" />
          <rect x="12" y={y + 5} width="76" height="1.5" rx="0.75" fill="#e5e7eb" />
          <rect x="12" y={y + 9} width="60" height="1.5" rx="0.75" fill="#e5e7eb" />
          <rect x="12" y={y + 13} width="70" height="1.5" rx="0.75" fill="#e5e7eb" />
          <rect x="14" y={y + 17} width="72" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="14" y={y + 20} width="55" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}

function ModernPreview({ c, animate }: PrevProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="0" y="0" width={animate ? 34 : 30} height="130" fill={c} className="svg-transition" />
      <circle cx="16" cy="16" r="8" fill="white" opacity="0.2" />
      <rect x="5" y="28" width="22" height="3" rx="1" fill="white" opacity="0.9" />
      <rect x="7" y="33" width="18" height="1.5" rx="0.75" fill="white" opacity="0.6" />
      {[46, 63, 82, 102].map((y, i) => (
        <g key={i}>
          <rect x="4" y={y} width="15" height="1.5" rx="0.75" fill="white" opacity="0.5" />
          <rect x="4" y={y + 4} width="22" height="1" rx="0.5" fill="white" opacity="0.3" />
          <rect x="4" y={y + 7} width="18" height="1" rx="0.5" fill="white" opacity="0.3" />
          <rect x="4" y={y + 10} width={10} height="2" rx="3" fill="white" opacity="0.2" />
        </g>
      ))}
      <rect x="36" y="8" width="38" height="4" rx="1.5" fill="#111" opacity="0.8" />
      <rect x="36" y="14" width="26" height="2.5" rx="1" fill={c} opacity="0.7" />
      {[24, 54, 88].map((y, i) => (
        <g key={i} opacity={animate ? 1 : 0.85} className="svg-transition">
          <rect x="34" y={y} width="3.5" height="10" rx="1" fill={c} opacity="0.8" />
          <rect x="40" y={y + 1} width="20" height="2.5" rx="1" fill="#111" opacity="0.7" />
          <rect x="34" y={y + 12} width="58" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="34" y={y + 15} width="46" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="34" y={y + 18} width="52" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="34" y={y + 22} width="36" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}

function MinimalPreview({ c, animate }: PrevProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="22" y="9" width="56" height="5" rx="2" fill="#111" opacity="0.85" />
      <rect x="30" y="16" width={animate ? 44 : 38} height="2.5" rx="1" fill={c} opacity="0.7" className="svg-transition" />
      <rect x="15" y="22" width="70" height="1.5" rx="0.75" fill="#d1d5db" />
      <rect x="10" y="27" width="35" height="0.6" fill="#e5e7eb" />
      <circle cx="50" cy="27" r="1.8" fill={c} opacity={animate ? 0.6 : 0.3} className="svg-transition" />
      <rect x="55" y="27" width="35" height="0.6" fill="#e5e7eb" />
      {[32, 60, 90].map((y, i) => (
        <g key={i} opacity={animate ? 1 : 0.85} className="svg-transition">
          <rect x="28" y={y} width="44" height="1.5" rx="0.75" fill="#9ca3af" opacity="0.5" />
          <rect x="12" y={y + 1} width="76" height="0.3" fill="#e5e7eb" />
          <rect x="12" y={y + 5} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="12" y={y + 8} width="58" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="12" y={y + 12} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="12" y={y + 15} width="44" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="12" y={y + 19} width="66" height="1" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  );
}

function ExecutivePreview({ c, animate }: PrevProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="0" y="0" width="100" height={animate ? 30 : 28} fill={c} className="svg-transition" />
      <rect x="8" y="7" width="50" height="6" rx="2" fill="white" opacity="0.95" />
      <rect x="8" y="16" width="35" height="2.5" rx="1" fill="white" opacity="0.7" />
      <rect x="8" y="21" width="84" height="1.5" rx="0.75" fill="white" opacity="0.4" />
      <rect x="0" y={animate ? 28 : 26} width="100" height="3" fill="black" opacity="0.12" className="svg-transition" />
      {[35, 65, 96].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="4" height="12" rx="1" fill={c} opacity={animate ? 1 : 0.7} className="svg-transition" />
          <rect x="14" y={y + 1} width="32" height="3" rx="1" fill="#111" opacity="0.7" />
          <rect x="8" y={y + 7} width="84" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="8" y={y + 10} width="66" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="8" y={y + 14} width="75" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="8" y={y + 17} width="58" height="1" rx="0.5" fill="#f3f4f6" />
          <circle cx="10" cy={y + 21.5} r="1" fill={c} opacity="0.5" />
          <rect x="14" y={y + 21} width="50" height="1" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  );
}

function CreativePreview({ c, animate }: PrevProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="8" y="5" width="45" height="5.5" rx="2" fill="#111" opacity="0.85" />
      <rect x="8" y="12.5" width="60" height="3.5" rx="1" fill={c} opacity="0.6" />
      <rect x="8" y="18" width="84" height="1.5" rx="0.75" fill="#d1d5db" />
      <rect x="0" y="21" width="100" height={animate ? 3 : 2} fill={c} opacity="0.9" className="svg-transition" />
      <rect x="0" y="25" width="60" height="105" fill="white" />
      <rect x="62" y="25" width="38" height="105" fill="#f8f9fa" />
      {[28, 60, 92].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="20" height="2" rx="1" fill={c} opacity="0.8" />
          <rect x="14" y={y + 6} width="1.5" height="22" fill="#e5e7eb" />
          {[y + 5, y + 16].map((dy, j) => (
            <g key={j}>
              <circle cx="14.75" cy={dy + 1} r={animate ? 3.5 : 3} fill="white" stroke={c} strokeWidth="1.5" className="svg-transition" />
              <rect x="20" y={dy - 1} width="30" height="2" rx="1" fill="#111" opacity="0.7" />
              <rect x="20" y={dy + 3} width="22" height="1.5" rx="0.75" fill={c} opacity="0.5" />
              <rect x="20" y={dy + 7} width="34" height="1" rx="0.5" fill="#e5e7eb" />
            </g>
          ))}
        </g>
      ))}
      {[28, 55, 82, 108].map((y, i) => (
        <g key={i}>
          <rect x="64" y={y} width="28" height="1.5" rx="0.75" fill={c} opacity="0.7" />
          <rect x="64" y={y + 1.5} width="30" height="0.4" fill={c} opacity="0.3" />
          {[y + 4, y + 8, y + 12].map((dy, j) => (
            <rect key={j} x="64" y={dy} width={10 + j * 5} height="2.5" rx="3" fill={c} opacity={animate ? 0.2 : 0.12} className="svg-transition" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function TechnicalPreview({ c, animate }: PrevProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="0" y="0" width="100" height="30" fill="#1e1e2e" />
      <circle cx="10" cy="7" r="2.5" fill="#f38ba8" />
      <circle cx="17" cy="7" r="2.5" fill="#f9e2af" />
      <circle cx="24" cy="7" r="2.5" fill="#a6e3a1" />
      <rect x="8" y="13" width="6" height="2" rx="1" fill="#a6e3a1" opacity={animate ? 1 : 0.7} className="svg-transition" />
      <rect x="16" y="13" width={animate ? 38 : 32} height="2" rx="1" fill="#6c7086" className="svg-transition" />
      <rect x="8" y="19" width="55" height="4.5" rx="1" fill="#cdd6f4" opacity="0.9" />
      <rect x="8" y="25" width="36" height="2.5" rx="1" fill={c} opacity="0.8" />
      {[34, 60, 88, 110].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="5" height="2.5" rx="0.5" fill="#9ca3af" opacity="0.6" />
          <rect x="15" y={y} width="30" height="2.5" rx="1" fill={c} opacity={animate ? 0.9 : 0.7} className="svg-transition" />
          <rect x="8" y={y + 5} width="84" height="1" rx="0.5" fill="#e5e7eb" />
          {[0, 1].map(j => (
            <g key={j}>
              <rect x={8 + j * 28} y={y + 8} width="24" height="3.5" rx="2" fill="#1e1e2e" opacity={animate ? 0.9 : 0.75} className="svg-transition" />
              <rect x={11 + j * 28} y={y + 9.5} width="15" height="1.5" rx="0.75" fill="#cdd6f4" opacity="0.6" />
            </g>
          ))}
          <rect x="8" y={y + 14} width="84" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="8" y={y + 17} width="64" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}

function ElegantPreview({ c, animate }: PrevProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="15" y="8" width="70" height="6" rx="1.5" fill="#222" opacity="0.85" />
      <rect x="28" y="17" width={animate ? 48 : 42} height="3" rx="1" fill={c} opacity="0.65" className="svg-transition" />
      <rect x="12" y="24" width="28" height="0.6" fill="#d4d4d4" />
      <circle cx="50" cy="24" r={animate ? 3 : 2.5} fill={c} opacity={animate ? 0.6 : 0.4} className="svg-transition" />
      <rect x="60" y="24" width="28" height="0.6" fill="#d4d4d4" />
      <rect x="16" y="28" width="68" height="1.5" rx="0.75" fill="#ccc" />
      {[34, 62, 92].map((y, i) => (
        <g key={i}>
          <rect x="12" y={y} width="30" height="0.4" fill="#e5e5e5" />
          <rect x="30" y={y - 1.5} width="40" height="3" rx="0.75" fill={c} opacity="0.15" />
          <rect x="34" y={y - 1} width="32" height="2" rx="0.75" fill={c} opacity={animate ? 0.4 : 0.25} className="svg-transition" />
          <rect x="58" y={y} width="30" height="0.4" fill="#e5e5e5" />
          <rect x="12" y={y + 4} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="12" y={y + 7} width="58" height="1" rx="0.5" fill="#e5e7eb" opacity="0.8" />
          <rect x="18" y={y + 10} width="60" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="12" y={y + 14} width="50" height="1" rx="0.5" fill="#e5e7eb" opacity="0.6" />
          <rect x="18" y={y + 18} width="52" height="1" rx="0.5" fill="#f3f4f6" opacity="0.8" />
          <rect x="16" y={y + 21} width="68" height="1" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  );
}

function BoldPreview({ c, animate }: PrevProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="8" y="6" width={animate ? 34 : 30} height="9" rx="1.5" fill="#111" opacity="0.9" className="svg-transition" />
      <rect x={animate ? 44 : 40} y="6" width="32" height="9" rx="1.5" fill={c} opacity="0.9" className="svg-transition" />
      <rect x="8" y="17" width="60" height="3" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="8" y="23" width="22" height="3.5" rx="8" fill="#f3f4f6" />
      <rect x="33" y="23" width="18" height="3.5" rx="8" fill="#f3f4f6" />
      <rect x="54" y="23" width="30" height="3.5" rx="8" fill="#f3f4f6" />
      <rect x="8" y="29" width="84" height={animate ? 2 : 1.5} fill={c} opacity="0.9" className="svg-transition" />
      {[34, 62, 92].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="42" height="3" rx="1" fill="#111" opacity="0.85" />
          <rect x="8" y={y + 4} width="84" height={animate ? 3 : 2.5} rx="0.5" fill={c} opacity="0.85" className="svg-transition" />
          <rect x="8" y={y + 10} width="84" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="8" y={y + 13} width="70" height="1" rx="0.5" fill="#f3f4f6" />
          {[0, 1, 2].map(j => (
            <rect key={j} x={8 + j * 22} y={y + 17} width="18" height="4.5" rx="2" fill={c} opacity={animate ? 0.9 : 0.7} className="svg-transition" />
          ))}
          <rect x="8" y={y + 24} width="76" height="1" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  );
}
