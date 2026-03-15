/* ── Template Mini Preview — Visual layout thumbnails ─────── */
'use client';

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

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all duration-200 group ${
        isActive
          ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/20'
          : 'border-gray-100 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Mini SVG Preview */}
      <div className="bg-white relative overflow-hidden" style={{ paddingTop: '141.4%' }}>
        <div className="absolute inset-0">
          {templateId === 'professional' && <ProfessionalPreview c={c} />}
          {templateId === 'modern' && <ModernPreview c={c} />}
          {templateId === 'minimal' && <MinimalPreview c={c} />}
          {templateId === 'executive' && <ExecutivePreview c={c} />}
          {templateId === 'creative' && <CreativePreview c={c} />}
          {templateId === 'technical' && <TechnicalPreview c={c} />}
          {templateId === 'elegant' && <ElegantPreview c={c} />}
          {templateId === 'bold' && <BoldPreview c={c} />}
        </div>
        {isActive && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
        )}
      </div>
      {/* Label */}
      <div className={`px-2.5 py-2 transition-colors ${isActive ? 'bg-blue-50' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
        <p className={`text-xs font-bold ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>{name}</p>
        <p className="text-[9px] text-gray-500">{desc}</p>
      </div>
    </button>
  );
}

/* ── SVG Mini Previews ──────────────────────────────────── */

function ProfessionalPreview({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 141" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="141" fill="white" />
      {/* Header */}
      <rect x="12" y="8" width="50" height="5" rx="2" fill="#111" opacity="0.85" />
      <rect x="12" y="15" width="35" height="3" rx="1.5" fill={c} opacity="0.8" />
      <rect x="12" y="20" width="76" height="1.5" rx="0.75" fill={c} opacity="0.4" />
      {/* Contact row */}
      <rect x="12" y="25" width="15" height="1.5" rx="0.75" fill="#9ca3af" />
      <rect x="30" y="25" width="12" height="1.5" rx="0.75" fill="#9ca3af" />
      <rect x="45" y="25" width="20" height="1.5" rx="0.75" fill="#9ca3af" />
      {/* Section */}
      {[35, 65, 95].map((y, i) => (
        <g key={i}>
          <rect x="12" y={y} width="30" height="2.5" rx="1" fill="#111" opacity="0.7" />
          <rect x="12" y={y + 1.25} width="76" height="0.75" fill={c} opacity="0.25" />
          <rect x="12" y={y + 6} width="76" height="1.5" rx="0.75" fill="#e5e7eb" />
          <rect x="12" y={y + 10} width="60" height="1.5" rx="0.75" fill="#e5e7eb" />
          <rect x="12" y={y + 14} width="70" height="1.5" rx="0.75" fill="#e5e7eb" />
          <rect x="14" y={y + 19} width="72" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="14" y={y + 22} width="55" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}

function ModernPreview({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 141" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="141" fill="white" />
      {/* Sidebar */}
      <rect x="0" y="0" width="32" height="141" fill={c} />
      {/* Avatar circle */}
      <circle cx="16" cy="18" r="9" fill="white" opacity="0.2" />
      <text x="16" y="22" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">JD</text>
      {/* Sidebar name */}
      <rect x="4" y="32" width="24" height="3" rx="1" fill="white" opacity="0.9" />
      <rect x="6" y="37" width="20" height="1.5" rx="0.75" fill="white" opacity="0.6" />
      {/* Sidebar sections */}
      {[50, 70, 90, 110].map((y, i) => (
        <g key={i}>
          <rect x="4" y={y} width="16" height="1.5" rx="0.75" fill="white" opacity="0.5" />
          <rect x="4" y={y+4} width="24" height="1" rx="0.5" fill="white" opacity="0.3" />
          <rect x="4" y={y+7} width="20" height="1" rx="0.5" fill="white" opacity="0.3" />
          {[0,1].map(j => <rect key={j} x="4" y={y+11+j*5} width={10 + j*8} height="2" rx="3" fill="white" opacity="0.2" />)}
        </g>
      ))}
      {/* Main content header */}
      <rect x="38" y="8" width="40" height="4" rx="1.5" fill="#111" opacity="0.8" />
      <rect x="38" y="14" width="28" height="2.5" rx="1" fill={c} opacity="0.7" />
      {/* Main sections */}
      {[26, 60, 95].map((y, i) => (
        <g key={i}>
          <rect x="36" y={y} width="4" height="10" rx="1" fill={c} opacity="0.8" />
          <rect x="42" y={y+1} width="22" height="2.5" rx="1" fill="#111" opacity="0.7" />
          <rect x="36" y={y+14} width="58" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="36" y={y+17} width="46" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="36" y={y+20} width="52" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="36" y={y+24} width="38" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}

function MinimalPreview({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 141" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="141" fill="white" />
      {/* Centered name */}
      <rect x="22" y="9" width="56" height="5" rx="2" fill="#111" opacity="0.85" />
      <rect x="30" y="16" width="40" height="2.5" rx="1" fill={c} opacity="0.7" />
      {/* Centered contacts */}
      <rect x="15" y="22" width="70" height="1.5" rx="0.75" fill="#d1d5db" />
      {/* Ornamental divider */}
      <rect x="10" y="28" width="35" height="0.75" fill="#e5e7eb" />
      <rect x="44" y="26" width="12" height="4" rx="1" fill={c} opacity="0.3" />
      <rect x="55" y="28" width="35" height="0.75" fill="#e5e7eb" />
      {/* Sections with centered title */}
      {[34, 65, 96].map((y, i) => (
        <g key={i}>
          <rect x="28" y={y} width="44" height="1.5" rx="0.75" fill="#9ca3af" opacity="0.6" />
          <rect x="12" y={y+1} width="76" height="0.4" fill="#e5e7eb" />
          <rect x="12" y={y+5} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="12" y={y+8} width="58" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="12" y={y+12} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="12" y={y+15} width="44" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="12" y={y+19} width="66" height="1" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  );
}

function ExecutivePreview({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 141" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="141" fill="white" />
      {/* Banner header */}
      <rect x="0" y="0" width="100" height="30" fill={c} />
      <rect x="8" y="7" width="50" height="6" rx="2" fill="white" opacity="0.95" />
      <rect x="8" y="16" width="35" height="2.5" rx="1" fill="white" opacity="0.7" />
      <rect x="8" y="21" width="84" height="1.5" rx="0.75" fill="white" opacity="0.4" />
      <rect x="0" y="28" width="100" height="3" fill="black" opacity="0.15" />
      {/* Sections with left accent */}
      {[36, 70, 104].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="4" height="14" rx="1" fill={c} opacity="0.8" />
          <rect x="14" y={y+1} width="35" height="3" rx="1" fill="#111" opacity="0.7" />
          <rect x="8" y={y+8} width="84" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="8" y={y+11} width="66" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="8" y={y+15} width="75" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="8" y={y+18} width="58" height="1" rx="0.5" fill="#f3f4f6" />
          {[y+22, y+25].map((ry, j) => (
            <g key={j} style={{ transform: `translateX(${j * 0}px)` }}>
              <circle cx="10" cy={ry + 0.5} r="1" fill={c} opacity="0.5" />
              <rect x="14" y={ry} width={52 - j*12} height="1" rx="0.5" fill="#e5e7eb" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

function CreativePreview({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 141" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="141" fill="white" />
      {/* Top border */}
      <rect x="0" y="0" width="100" height="24" fill="white" />
      <rect x="8" y="5" width="45" height="5.5" rx="2" fill="#111" opacity="0.85" />
      <rect x="8" y="12.5" width="60" height="3.5" rx="1" fill={c} opacity="0.6" />
      <rect x="8" y="18" width="84" height="1.5" rx="0.75" fill="#d1d5db" />
      <rect x="0" y="22" width="100" height="2.5" fill={c} opacity="0.9" />
      {/* Left main */}
      <rect x="0" y="25" width="62" height="116" fill="white" />
      {/* Right sidebar */}
      <rect x="64" y="25" width="36" height="116" fill="#f9fafb" />
      {/* Left sections with timeline */}
      {[30, 65, 100].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="22" height="2" rx="1" fill={c} opacity="0.8" />
          {/* Timeline line */}
          <rect x="14" y={y+8} width="1.5" height="26" fill="#e5e7eb" />
          {[y+6, y+18].map((dy, j) => (
            <g key={j}>
              <circle cx="14.75" cy={dy+1} r="3.5" fill="white" stroke={c} strokeWidth="1.5" />
              <rect x="22" y={dy-2} width="32" height="2.5" rx="1" fill="#111" opacity="0.7" />
              <rect x="22" y={dy+2} width="24" height="1.5" rx="0.75" fill={c} opacity="0.5" />
              <rect x="22" y={dy+6} width="36" height="1" rx="0.5" fill="#e5e7eb" />
              <rect x="22" y={dy+9} width="28" height="1" rx="0.5" fill="#f3f4f6" />
            </g>
          ))}
        </g>
      ))}
      {/* Right sidebar sections */}
      {[28, 60, 90, 118].map((y, i) => (
        <g key={i}>
          <rect x="66" y={y} width="30" height="1.5" rx="0.75" fill={c} opacity="0.7" />
          <rect x="66" y={y+1.5} width="30" height="0.5" fill={c} opacity="0.3" />
          {[y+4, y+8, y+12].map((dy, j) => (
            <g key={j}>
              <rect x="66" y={dy} width={10+j*5} height="2.5" rx="3" fill={c} opacity="0.15" />
            </g>
          ))}
          <rect x="66" y={y+18} width="30" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="66" y={y+21} width="22" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}

function TechnicalPreview({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 141" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="141" fill="white" />
      {/* Dark terminal header */}
      <rect x="0" y="0" width="100" height="32" fill="#1e1e2e" />
      {/* Terminal dots */}
      <circle cx="10" cy="8" r="2.5" fill="#f38ba8" />
      <circle cx="17" cy="8" r="2.5" fill="#f9e2af" />
      <circle cx="24" cy="8" r="2.5" fill="#a6e3a1" />
      {/* Prompt */}
      <rect x="8" y="14" width="6" height="2" rx="1" fill="#a6e3a1" opacity="0.7" />
      <rect x="16" y="14" width="35" height="2" rx="1" fill="#6c7086" />
      {/* Name in terminal */}
      <rect x="8" y="20" width="55" height="5" rx="1" fill="#cdd6f4" opacity="0.9" />
      <rect x="8" y="27" width="38" height="2.5" rx="1" fill={c} opacity="0.8" />
      {/* Body sections with // comments */}
      {[36, 66, 96, 120].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="6" height="2.5" rx="0.5" fill="#9ca3af" opacity="0.6" />
          <rect x="16" y={y} width="32" height="2.5" rx="1" fill={c} opacity="0.8" />
          <rect x="8" y={y+5} width="84" height="1" rx="0.5" fill="#e5e7eb" />
          {/* Monospace skill tags */}
          {[0,1].map(j => (
            <g key={j}>
              <rect x={8 + j*30} y={y+9} width="25" height="4" rx="2" fill="#1e1e2e" opacity="0.85" />
              <rect x={11 + j*30} y={y+11} width="16" height="1.5" rx="0.75" fill="#cdd6f4" opacity="0.6" />
            </g>
          ))}
          <rect x="8" y={y+16} width="84" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="8" y={y+19} width="64" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}

function ElegantPreview({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 141" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="141" fill="white" />
      {/* Centered name (serif style) */}
      <rect x="15" y="8" width="70" height="6" rx="1.5" fill="#222" opacity="0.85" />
      <rect x="28" y="17" width="44" height="3" rx="1" fill={c} opacity="0.65" />
      {/* Ornamental divider */}
      <rect x="12" y="24" width="28" height="0.75" fill="#d4d4d4" />
      <circle cx="50" cy="24" r="2.5" fill={c} opacity="0.5" />
      <rect x="60" y="24" width="28" height="0.75" fill="#d4d4d4" />
      {/* Centered contacts */}
      <rect x="16" y="29" width="68" height="1.5" rx="0.75" fill="#ccc" />
      {/* Sections with ornamental dividers */}
      {[36, 67, 100].map((y, i) => (
        <g key={i}>
          {/* — Title — divider */}
          <rect x="12" y={y} width="30" height="0.5" fill="#e5e5e5" />
          <rect x="30" y={y-1.5} width="40" height="3" rx="0.75" fill={c} opacity="0.15" />
          <rect x="34" y={y-1} width="32" height="2" rx="0.75" fill={c} opacity="0.3" />
          <rect x="58" y={y} width="30" height="0.5" fill="#e5e5e5" />
          <rect x="12" y={y+4} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="12" y={y+7} width="58" height="1" rx="0.5" fill="#e5e7eb" opacity="0.8" />
          <rect x="20" y={y+10} width="60" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="12" y={y+14} width="50" height="1" rx="0.5" fill="#e5e7eb" opacity="0.6" />
          <rect x="20" y={y+18} width="52" height="1" rx="0.5" fill="#f3f4f6" opacity="0.8" />
          <rect x="16" y={y+21} width="68" height="1" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  );
}

function BoldPreview({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 141" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="141" fill="white" />
      {/* Big bold name */}
      <rect x="8" y="6" width="30" height="9" rx="1.5" fill="#111" opacity="0.9" />
      <rect x="41" y="6" width="32" height="9" rx="1.5" fill={c} opacity="0.9" />
      <rect x="8" y="17" width="60" height="3.5" rx="1" fill="#9ca3af" opacity="0.5" />
      {/* Contact pills */}
      <rect x="8" y="23" width="22" height="4" rx="8" fill="#f3f4f6" />
      <rect x="33" y="23" width="18" height="4" rx="8" fill="#f3f4f6" />
      <rect x="54" y="23" width="30" height="4" rx="8" fill="#f3f4f6" />
      {/* Thick color bar header */}
      <rect x="8" y="30" width="84" height="1.5" fill={c} opacity="0.9" />
      {/* Sections */}
      {[35, 68, 101].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="45" height="3.5" rx="1" fill="#111" opacity="0.85" />
          <rect x="8" y={y+4} width="84" height="3" rx="0.5" fill={c} opacity="0.85" />
          <rect x="8" y={y+10} width="84" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="8" y={y+13} width="70" height="1" rx="0.5" fill="#f3f4f6" />
          {/* Chunky skill badges */}
          {[0,1,2].map(j => (
            <rect key={j} x={8 + j*22} y={y+17} width={18} height="5" rx="2" fill={c} opacity="0.85" />
          ))}
          <rect x="8" y={y+25} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="8" y={y+28} width="58" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}
