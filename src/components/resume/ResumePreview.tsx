/* ── ResumePreview — Renders current template with visual scale ── */
'use client';

import React, { forwardRef } from 'react';
import type { ResumeData, ResumeStyle, TemplateId } from '@/types/resume';

import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import TechnicalTemplate from './templates/TechnicalTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import BoldTemplate from './templates/BoldTemplate';

const templateMap: Record<TemplateId, React.ComponentType<{ data: ResumeData; style: ResumeStyle }>> = {
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  technical: TechnicalTemplate,
  elegant: ElegantTemplate,
  bold: BoldTemplate,
};

/** A4 page height at 96 dpi = 1123px */
const A4_H = 1123;

/** Returns the min/max height and overflow based on pageMode */
function getPageConstraints(mode?: string): React.CSSProperties {
  switch (mode) {
    case 'single':
      return { minHeight: `${A4_H}px`, maxHeight: `${A4_H}px`, overflow: 'hidden' };
    case 'double':
      return { minHeight: `${A4_H * 2}px` };
    case 'triple':
      return { minHeight: `${A4_H * 3}px` };
    default: // auto
      return { minHeight: `${A4_H}px` };
  }
}

interface ResumePreviewProps {
  data: ResumeData;
  style: ResumeStyle;
  scale?: number;
  className?: string;
}

/**
 * Wrapper that renders the chosen template at 1:1 pixel size (794×1123 = A4 at 96dpi).
 * Visual scaling is done on an OUTER wrapper so the inner element stays pixel-perfect
 * for html2canvas capture.
 */
const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data, style, scale = 1, className = '' }, ref) => {
    const Template = templateMap[style.template] || ProfessionalTemplate;
    const pageConstraints = getPageConstraints(style.pageMode);
    const pageCount = style.pageMode === 'double' ? 2 : style.pageMode === 'triple' ? 3 : 1;

    return (
      <div
        className={className}
        style={{
          width: `${794 * scale}px`,
          height: 'auto',
          overflow: 'visible',
        }}
      >
        <div
          ref={ref}
          id="resume-preview"
          style={{
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            width: '794px',
            background: '#fff',
            boxShadow: scale < 1 ? 'none' : '0 4px 24px rgba(0,0,0,0.08)',
            position: 'relative',
            ...pageConstraints,
          }}
        >
          <Template data={data} style={style} />

          {/* Page break indicators */}
          {style.showPageBreakIndicators && pageCount >= 1 && Array.from({ length: pageCount - 1 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0, right: 0,
                top: `${A4_H * (i + 1)}px`,
                height: '0',
                borderTop: '2px dashed #93c5fd',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
          ))}
          {/* Always show at least one page-break guide in auto mode */}
          {style.showPageBreakIndicators && (style.pageMode ?? 'auto') === 'auto' && (
            <div
              style={{
                position: 'absolute',
                left: 0, right: 0,
                top: `${A4_H}px`,
                height: '0',
                borderTop: '2px dashed #93c5fd',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>
    );
  },
);

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
