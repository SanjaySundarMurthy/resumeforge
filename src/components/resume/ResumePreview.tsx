/* ── ResumeForge — Resume Preview Component ──────────────── */

'use client';

import { forwardRef } from 'react';
import type { ResumeData, ResumeStyle, TemplateId } from '@/types/resume';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import TechnicalTemplate from './templates/TechnicalTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import BoldTemplate from './templates/BoldTemplate';

interface Props {
  data: ResumeData;
  style: ResumeStyle;
  scale?: number;
  className?: string;
}

const TEMPLATE_MAP: Record<TemplateId, React.FC<{ data: ResumeData; style: ResumeStyle }>> = {
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  technical: TechnicalTemplate,
  elegant: ElegantTemplate,
  bold: BoldTemplate,
};

const ResumePreview = forwardRef<HTMLDivElement, Props>(
  ({ data, style, scale = 1, className = '' }, ref) => {
    const Template = TEMPLATE_MAP[style.template] || ProfessionalTemplate;

    return (
      <div className={`inline-block origin-top-left ${className}`} style={{ transform: `scale(${scale})` }}>
        <div ref={ref} id="resume-preview">
          <Template data={data} style={style} />
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
