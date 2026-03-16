/* ── Template Mini Preview — Live Resume Data Thumbnails ──── */
'use client';

import { useState, useMemo } from 'react';
import type { TemplateId, ResumeData, ResumeStyle } from '@/types/resume';
import { useResumeStore } from '@/store/useResumeStore';

interface Props {
  templateId: TemplateId;
  primaryColor: string;
  isActive?: boolean;
  onClick?: () => void;
  name: string;
  desc: string;
}

export default function TemplateMiniPreview({ templateId, primaryColor, isActive, onClick, name, desc }: Props) {
  const { data } = useResumeStore();
  const c = primaryColor;
  const [hovered, setHovered] = useState(false);

  // Extract key data for live preview
  const fullName = `${data.personalInfo.firstName || 'Your'} ${data.personalInfo.lastName || 'Name'}`;
  const title = data.personalInfo.title || 'Professional Title';
  const hasContent = data.experience.length > 0 || data.summary.length > 20;

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
      {/* Mini SVG Preview with live data */}
      <div className="bg-white relative overflow-hidden" style={{ paddingTop: '130%' }}>
        <div className={`absolute inset-0 transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}>
          <LivePreview
            templateId={templateId}
            c={c}
            animate={hovered}
            name={fullName}
            title={title}
            hasExp={data.experience.length > 0}
            hasEdu={data.education.length > 0}
            hasSkills={data.skills.length > 0}
            hasSummary={data.summary.length > 20}
            expCount={data.experience.length}
          />
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

/* ── Live SVG Previews with actual data ─────────────────── */
interface LiveProps {
  templateId: TemplateId;
  c: string;
  animate: boolean;
  name: string;
  title: string;
  hasExp: boolean;
  hasEdu: boolean;
  hasSkills: boolean;
  hasSummary: boolean;
  expCount: number;
}

function LivePreview(props: LiveProps) {
  switch (props.templateId) {
    case 'professional': return <ProfessionalPreview {...props} />;
    case 'modern': return <ModernPreview {...props} />;
    case 'minimal': return <MinimalPreview {...props} />;
    case 'executive': return <ExecutivePreview {...props} />;
    case 'creative': return <CreativePreview {...props} />;
    case 'technical': return <TechnicalPreview {...props} />;
    case 'elegant': return <ElegantPreview {...props} />;
    case 'bold': return <BoldPreview {...props} />;
    default: return <ProfessionalPreview {...props} />;
  }
}

/* ── Text truncation helper for SVG ─────────────────────── */
function truncSvg(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

/* ── Professional ───────────────────────────────────────── */
function ProfessionalPreview({ c, animate, name, title, hasExp, hasEdu, hasSkills, hasSummary }: LiveProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      {/* Name */}
      <text x="12" y="13" fontSize="5.5" fontWeight="bold" fill="#111" opacity="0.85">{truncSvg(name, 18)}</text>
      <text x="12" y="18" fontSize="3" fill={c} opacity="0.8">{truncSvg(title, 25)}</text>
      <rect x="12" y="20" width="76" height="1" rx="0.5" fill={c} opacity="0.35" />
      {/* Contact pills */}
      <rect x="12" y="23" width="15" height="1.5" rx="0.75" fill="#bbb" />
      <rect x="30" y="23" width="12" height="1.5" rx="0.75" fill="#bbb" />
      <rect x="45" y="23" width="20" height="1.5" rx="0.75" fill="#bbb" />
      {/* Sections */}
      {[32, 58, 86].map((y, i) => {
        const labels = ['Experience', 'Education', 'Skills'];
        const has = [hasExp, hasEdu, hasSkills][i];
        return (
          <g key={i} opacity={has ? (animate ? 1 : 0.85) : 0.4} className="svg-transition">
            <text x="12" y={y + 2.5} fontSize="3" fontWeight="bold" fill="#111" opacity="0.7">{labels[i]}</text>
            <rect x="12" y={y + 3.5} width="76" height="0.5" fill={c} opacity="0.25" />
            <rect x="12" y={y + 6} width="76" height="1.5" rx="0.75" fill={has ? '#d1d5db' : '#f3f4f6'} />
            <rect x="12" y={y + 10} width="60" height="1.5" rx="0.75" fill={has ? '#d1d5db' : '#f3f4f6'} />
            <rect x="12" y={y + 14} width="70" height="1.5" rx="0.75" fill={has ? '#e5e7eb' : '#f3f4f6'} />
            <rect x="14" y={y + 18} width="72" height="1" rx="0.5" fill="#f3f4f6" />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Modern ─────────────────────────────────────────────── */
function ModernPreview({ c, animate, name, title, hasExp, hasSkills }: LiveProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="0" y="0" width={animate ? 34 : 30} height="130" fill={c} className="svg-transition" />
      <circle cx="16" cy="16" r="8" fill="white" opacity="0.2" />
      {/* Sidebar name */}
      <text x="5" y="31" fontSize="3" fontWeight="bold" fill="white" opacity="0.9">{truncSvg(name.split(' ')[0] || 'Name', 10)}</text>
      <text x="7" y="35" fontSize="2" fill="white" opacity="0.6">{truncSvg(title, 12)}</text>
      {/* Sidebar sections */}
      {[46, 63, 82, 102].map((y, i) => (
        <g key={i}>
          <rect x="4" y={y} width="15" height="1.5" rx="0.75" fill="white" opacity="0.5" />
          <rect x="4" y={y + 4} width="22" height="1" rx="0.5" fill="white" opacity="0.3" />
          <rect x="4" y={y + 7} width="18" height="1" rx="0.5" fill="white" opacity="0.3" />
        </g>
      ))}
      {/* Main content */}
      <text x="36" y="12" fontSize="4.5" fontWeight="bold" fill="#111" opacity="0.8">{truncSvg(name, 14)}</text>
      <text x="36" y="16" fontSize="2.5" fill={c} opacity="0.7">{truncSvg(title, 18)}</text>
      {[24, 54, 88].map((y, i) => {
        const has = [hasExp, hasExp, hasSkills][i];
        return (
          <g key={i} opacity={has ? (animate ? 1 : 0.85) : 0.4} className="svg-transition">
            <rect x="34" y={y} width="3.5" height="10" rx="1" fill={c} opacity="0.8" />
            <rect x="40" y={y + 1} width="20" height="2.5" rx="1" fill="#111" opacity="0.7" />
            <rect x="34" y={y + 12} width="58" height="1" rx="0.5" fill="#e5e7eb" />
            <rect x="34" y={y + 15} width="46" height="1" rx="0.5" fill="#e5e7eb" />
            <rect x="34" y={y + 18} width="52" height="1" rx="0.5" fill="#e5e7eb" />
          </g>
        );
      })}
    </svg>
  );
}

/* ── Minimal ────────────────────────────────────────────── */
function MinimalPreview({ c, animate, name, title }: LiveProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <text x="50" y="13" fontSize="5" fontWeight="bold" fill="#111" opacity="0.85" textAnchor="middle">{truncSvg(name, 16)}</text>
      <text x="50" y="18" fontSize="2.5" fill={c} opacity="0.7" textAnchor="middle">{truncSvg(title, 22)}</text>
      <rect x="15" y="21" width="70" height="1" rx="0.5" fill="#d1d5db" />
      {[32, 60, 90].map((y, i) => (
        <g key={i} opacity={animate ? 1 : 0.85} className="svg-transition">
          <text x="50" y={y + 1.5} fontSize="2" fill="#9ca3af" opacity="0.5" textAnchor="middle">{['Experience', 'Education', 'Skills'][i]}</text>
          <rect x="12" y={y + 3} width="76" height="0.3" fill="#e5e7eb" />
          <rect x="12" y={y + 6} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="12" y={y + 9} width="58" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="12" y={y + 13} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="12" y={y + 16} width="44" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}

/* ── Executive ──────────────────────────────────────────── */
function ExecutivePreview({ c, animate, name, title }: LiveProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="0" y="0" width="100" height={animate ? 30 : 28} fill={c} className="svg-transition" />
      <text x="8" y="12" fontSize="5.5" fontWeight="bold" fill="white" opacity="0.95">{truncSvg(name, 16)}</text>
      <text x="8" y="18" fontSize="2.5" fill="white" opacity="0.7">{truncSvg(title, 24)}</text>
      <rect x="8" y="21" width="84" height="1" rx="0.5" fill="white" opacity="0.4" />
      {[35, 65, 96].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="4" height="12" rx="1" fill={c} opacity={animate ? 1 : 0.7} className="svg-transition" />
          <rect x="14" y={y + 1} width="32" height="3" rx="1" fill="#111" opacity="0.7" />
          <rect x="8" y={y + 7} width="84" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="8" y={y + 10} width="66" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="8" y={y + 14} width="75" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="8" y={y + 17} width="58" height="1" rx="0.5" fill="#f3f4f6" />
        </g>
      ))}
    </svg>
  );
}

/* ── Creative ───────────────────────────────────────────── */
function CreativePreview({ c, animate, name, title }: LiveProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <text x="8" y="10" fontSize="5" fontWeight="bold" fill="#111" opacity="0.85">{truncSvg(name, 16)}</text>
      <text x="8" y="15" fontSize="3" fill={c} opacity="0.6">{truncSvg(title, 24)}</text>
      <rect x="0" y="18" width="100" height={animate ? 3 : 2} fill={c} opacity="0.9" className="svg-transition" />
      <rect x="62" y="22" width="38" height="108" fill="#f8f9fa" />
      {[25, 55, 85].map((y, i) => (
        <g key={i}>
          <text x="8" y={y + 2} fontSize="2.5" fontWeight="bold" fill={c} opacity="0.8">
            {['Experience', 'Education', 'Projects'][i]}
          </text>
          <rect x="14" y={y + 6} width="1.5" height="18" fill="#e5e7eb" />
          {[y + 5, y + 14].map((dy, j) => (
            <g key={j}>
              <circle cx="14.75" cy={dy + 1} r={animate ? 3.5 : 3} fill="white" stroke={c} strokeWidth="1.5" className="svg-transition" />
              <rect x="20" y={dy - 1} width="30" height="2" rx="1" fill="#111" opacity="0.7" />
              <rect x="20" y={dy + 3} width="34" height="1" rx="0.5" fill="#e5e7eb" />
            </g>
          ))}
        </g>
      ))}
      {[28, 55, 82].map((y, i) => (
        <g key={i}>
          <rect x="64" y={y} width="28" height="1.5" rx="0.75" fill={c} opacity="0.7" />
          {[y + 4, y + 8, y + 12].map((dy, j) => (
            <rect key={j} x="64" y={dy} width={10 + j * 5} height="2.5" rx="3" fill={c} opacity={animate ? 0.2 : 0.12} className="svg-transition" />
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ── Technical ──────────────────────────────────────────── */
function TechnicalPreview({ c, animate, name, title }: LiveProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="0" y="0" width="100" height="30" fill="#1e1e2e" />
      <circle cx="10" cy="7" r="2.5" fill="#f38ba8" />
      <circle cx="17" cy="7" r="2.5" fill="#f9e2af" />
      <circle cx="24" cy="7" r="2.5" fill="#a6e3a1" />
      <text x="8" y="22" fontSize="4.5" fontWeight="bold" fill="#cdd6f4" opacity="0.9">{truncSvg(name, 16)}</text>
      <text x="8" y="27" fontSize="2.5" fill={c} opacity="0.8">{truncSvg(title, 22)}</text>
      {[34, 60, 88].map((y, i) => (
        <g key={i}>
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

/* ── Elegant ────────────────────────────────────────────── */
function ElegantPreview({ c, animate, name, title }: LiveProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <text x="50" y="13" fontSize="5.5" fontWeight="bold" fill="#222" opacity="0.85" textAnchor="middle">{truncSvg(name, 14)}</text>
      <text x="50" y="19" fontSize="3" fill={c} opacity="0.65" textAnchor="middle">{truncSvg(title, 20)}</text>
      <rect x="12" y="23" width="28" height="0.6" fill="#d4d4d4" />
      <circle cx="50" cy="23" r={animate ? 3 : 2.5} fill={c} opacity={animate ? 0.6 : 0.4} className="svg-transition" />
      <rect x="60" y="23" width="28" height="0.6" fill="#d4d4d4" />
      {[34, 62, 92].map((y, i) => (
        <g key={i}>
          <rect x="30" y={y - 1.5} width="40" height="3" rx="0.75" fill={c} opacity="0.15" />
          <text x="50" y={y + 1} fontSize="2" fill={c} opacity={animate ? 0.4 : 0.25} textAnchor="middle">{['Experience', 'Education', 'Skills'][i]}</text>
          <rect x="12" y={y + 4} width="76" height="1" rx="0.5" fill="#e5e7eb" />
          <rect x="12" y={y + 7} width="58" height="1" rx="0.5" fill="#e5e7eb" opacity="0.8" />
          <rect x="18" y={y + 10} width="60" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="12" y={y + 14} width="50" height="1" rx="0.5" fill="#e5e7eb" opacity="0.6" />
          <rect x="16" y={y + 18} width="68" height="1" rx="0.5" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  );
}

/* ── Bold ───────────────────────────────────────────────── */
function BoldPreview({ c, animate, name, title }: LiveProps) {
  return (
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="100" height="130" fill="white" />
      <rect x="8" y="6" width={animate ? 38 : 34} height="9" rx="1.5" fill="#111" opacity="0.9" className="svg-transition" />
      <text x="10" y="12" fontSize="3.5" fontWeight="bold" fill="white">{truncSvg(name.split(' ')[0] || 'Name', 10)}</text>
      <rect x={animate ? 48 : 44} y="6" width="36" height="9" rx="1.5" fill={c} opacity="0.9" className="svg-transition" />
      <text x={animate ? 50 : 46} y="12" fontSize="3" fontWeight="bold" fill="white">{truncSvg(name.split(' ').slice(1).join(' ') || 'Last', 10)}</text>
      <text x="8" y="20" fontSize="2.5" fill="#9ca3af" opacity="0.6">{truncSvg(title, 26)}</text>
      <rect x="8" y="23" width="84" height={animate ? 2 : 1.5} fill={c} opacity="0.9" className="svg-transition" />
      {[28, 56, 86].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="42" height="3" rx="1" fill="#111" opacity="0.85" />
          <rect x="8" y={y + 4} width="84" height={animate ? 3 : 2.5} rx="0.5" fill={c} opacity="0.85" className="svg-transition" />
          <rect x="8" y={y + 10} width="84" height="1" rx="0.5" fill="#f3f4f6" />
          <rect x="8" y={y + 13} width="70" height="1" rx="0.5" fill="#f3f4f6" />
          {[0, 1, 2].map(j => (
            <rect key={j} x={8 + j * 22} y={y + 17} width="18" height="4.5" rx="2" fill={c} opacity={animate ? 0.9 : 0.7} className="svg-transition" />
          ))}
        </g>
      ))}
    </svg>
  );
}
