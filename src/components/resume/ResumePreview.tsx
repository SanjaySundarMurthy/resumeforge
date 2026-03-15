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

    return (
      <div
        className={className}
        style={{
          width: `${794 * scale}px`,
          height: 'auto',
          overflow: 'hidden',
        }}
      >
        <div
          ref={ref}
          id="resume-preview"
          style={{
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            width: '794px',
            minHeight: '1123px',
            background: '#fff',
            boxShadow: scale < 1 ? 'none' : '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <Template data={data} style={style} />
        </div>
      </div>
    );
  },
);

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
