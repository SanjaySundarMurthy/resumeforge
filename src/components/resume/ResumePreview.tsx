/* ── ResumePreview — Renders current template with visual scale ── */
'use client';

import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react';
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

/** A4 page dimensions at 96 dpi */
const A4_W = 794;
const A4_H = 1123;

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
 *
 * Single-page mode: measures actual content height and applies a CSS scale
 * to shrink the entire template so all content fits within exactly 1 A4 page (1123px).
 * The template always renders at 794px width so its internal layout is never distorted.
 */
const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data, style, scale = 1, className = '' }, ref) => {
    const Template = templateMap[style.template] || ProfessionalTemplate;
    const isSingle = style.pageMode === 'single';
    const isAuto = (style.pageMode ?? 'auto') === 'auto';
    const pageCount = style.pageMode === 'double' ? 2 : style.pageMode === 'triple' ? 3 : 1;

    // For single-page mode: measure content then compute scale-to-fit
    const contentRef = useRef<HTMLDivElement>(null);
    const [fitScale, setFitScale] = useState(1);

    // For auto mode: measure actual content height to avoid truncation
    const autoRef = useRef<HTMLDivElement>(null);
    const [autoHeight, setAutoHeight] = useState(A4_H);

    const measureAndFit = useCallback(() => {
      if (!isSingle || !contentRef.current) {
        setFitScale(1);
        return;
      }
      const naturalHeight = contentRef.current.scrollHeight;
      if (naturalHeight > A4_H) {
        setFitScale(Math.max(A4_H / naturalHeight, 0.4));
      } else {
        setFitScale(1);
      }
    }, [isSingle]);

    const measureAutoHeight = useCallback(() => {
      if (!isAuto || !autoRef.current) return;
      const h = autoRef.current.scrollHeight;
      setAutoHeight(Math.max(A4_H, h));
    }, [isAuto]);

    // Re-measure whenever data, style, or mode changes
    useEffect(() => {
      measureAndFit();
      measureAutoHeight();
    }, [data, style, measureAndFit, measureAutoHeight]);

    // Also observe resize of the content div for dynamic changes
    useEffect(() => {
      if (!isSingle || !contentRef.current) return;
      const observer = new ResizeObserver(() => measureAndFit());
      observer.observe(contentRef.current);
      return () => observer.disconnect();
    }, [isSingle, measureAndFit]);

    // Observe auto-mode inner div for height changes
    useEffect(() => {
      if (!isAuto || !autoRef.current) return;
      const observer = new ResizeObserver(() => measureAutoHeight());
      observer.observe(autoRef.current);
      return () => observer.disconnect();
    }, [isAuto, measureAutoHeight]);

    // Combined outer scale: preview zoom × single-page fit
    const combinedScale = scale * fitScale;

    // For single-page mode, the inner div is always A4_H tall (clipped).
    // For auto mode, content flows naturally with no height constraint.
    // For multi-page modes, content flows with a minimum height.
    const innerMinHeight = isSingle ? undefined : isAuto ? `${A4_H}px` : `${A4_H * pageCount}px`;
    const innerHeight = isSingle ? `${A4_H}px` : undefined;
    const innerOverflow = isSingle ? 'hidden' as const : undefined;

    // Layout compensation: CSS transform doesn't affect layout flow, so we
    // use the outer div's explicit height to match the visual size.
    const visualHeight = isSingle
      ? A4_H * combinedScale
      : isAuto
        ? autoHeight * scale
        : A4_H * pageCount * scale;

    return (
      <div
        className={className}
        role="document"
        aria-label="Resume preview"
        style={{
          width: `${A4_W * scale}px`,
          height: `${visualHeight}px`,
          overflow: isAuto ? 'visible' : 'hidden',
          flexShrink: 0,
        }}
      >
        {/*
          Measurement layer (invisible): renders the template at full 794px width
          with NO height constraint so we can measure its natural height.
          Only used in single-page mode.
        */}
        {isSingle && (
          <div
            ref={contentRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              top: 0,
              width: `${A4_W}px`,
              visibility: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <Template data={data} style={style} />
          </div>
        )}

        {/* Visible preview */}
        <div
          ref={(node) => {
            // Forward the ref for PDF capture
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            // Also track for auto-mode height measurement
            (autoRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          id="resume-preview"
          style={{
            transformOrigin: 'top left',
            transform: isSingle
              ? `scale(${combinedScale})`
              : `scale(${scale})`,
            width: `${A4_W}px`,
            minHeight: innerMinHeight,
            height: innerHeight,
            overflow: innerOverflow,
            background: '#fff',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            position: 'relative',
          }}
        >
          <Template data={data} style={style} />

          {/* Page break indicators */}
          {style.showPageBreakIndicators && pageCount >= 2 && Array.from({ length: pageCount - 1 }, (_, i) => (
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
          {/* Always show page-break guides in auto mode based on actual content */}
          {style.showPageBreakIndicators && isAuto && Array.from(
            { length: Math.max(1, Math.ceil(autoHeight / A4_H) - 1) },
            (_, i) => (
              <div
                key={`auto-${i}`}
                aria-hidden="true"
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
            )
          )}
        </div>
      </div>
    );
  },
);

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
