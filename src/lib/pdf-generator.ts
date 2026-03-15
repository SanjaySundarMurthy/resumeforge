/* ── ResumeForge — PDF Generator ─────────────────────────── */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
  margin?: number;
}

/**
 * Generate a PDF from an HTML element (the resume preview)
 */
export async function generatePDF(
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<Blob> {
  const {
    quality = 2,
    scale = 2,
    margin = 0,
  } = options;

  // Use html2canvas to render the element
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  // Create PDF at A4 size
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;  // A4 width in mm
  const pageHeight = 297; // A4 height in mm

  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const imgData = canvas.toDataURL('image/png', quality);

  // If content fits in one page
  if (imgHeight <= contentHeight) {
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
  } else {
    // Multi-page: split canvas into pages
    let remainingHeight = canvas.height;
    let position = 0;
    const pageCanvasHeight = (canvas.width * contentHeight) / contentWidth;

    while (remainingHeight > 0) {
      // Create a sub-canvas for this page
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageCanvasHeight, remainingHeight);
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvas,
          0, position,
          canvas.width, pageCanvas.height,
          0, 0,
          canvas.width, pageCanvas.height
        );
      }

      const pageImgData = pageCanvas.toDataURL('image/png', quality);
      const pageImgHeight = (pageCanvas.height * imgWidth) / canvas.width;

      if (position > 0) pdf.addPage();
      pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, pageImgHeight);

      remainingHeight -= pageCanvasHeight;
      position += pageCanvasHeight;
    }
  }

  return pdf.output('blob');
}

/**
 * Download the resume as PDF
 */
export async function downloadPDF(
  element: HTMLElement,
  filename = 'resume.pdf',
  options: PDFOptions = {}
): Promise<void> {
  const blob = await generatePDF(element, options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
