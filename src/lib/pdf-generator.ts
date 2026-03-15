/* ── PDF Generator — Pixel-perfect A4 export ─────────────── */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Captures the resume preview element at its NATIVE pixel size (794×1123 = A4
 * at 96 dpi).  We clone the element off-screen at 1:1 scale so html2canvas
 * never has to deal with CSS transforms or mm units.
 */
export async function generatePDF(filename = 'resume.pdf'): Promise<void> {
  const el = document.getElementById('resume-preview');
  if (!el) throw new Error('Resume preview element not found');

  // Clone the resume element and render it at 1:1 off-screen
  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'top left';
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = '794px';
  clone.style.minHeight = '1123px';
  clone.style.background = '#fff';
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2, // 2x for crisp text
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794,
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL('image/png');

    // A4: 210mm × 297mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    // Handle multi-page if content is taller than one A4 page
    const canvasAspect = canvas.height / canvas.width;
    const singlePageHeight = pdfWidth * (1123 / 794); // Expected height in mm for one A4 page
    const contentHeight = pdfWidth * canvasAspect;

    if (contentHeight <= pdfHeight + 2) {
      // Content fits in one page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, contentHeight);
    } else {
      // Multi-page: slice the canvas
      const pageHeightPx = (pdfHeight / pdfWidth) * 794; // pixels per page
      const totalPages = Math.ceil(canvas.height / (pageHeightPx * 2)); // account for scale: 2

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const srcY = page * pageHeightPx * 2;
        const srcH = Math.min(pageHeightPx * 2, canvas.height - srcY);

        // Create a sub-canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcH;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
          const pageImg = pageCanvas.toDataURL('image/png');
          const pageH = (srcH / (pageHeightPx * 2)) * pdfHeight;
          pdf.addImage(pageImg, 'PNG', 0, 0, pdfWidth, pageH);
        }
      }
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(clone);
  }
}

/**
 * Quick PNG export for sharing.
 */
export async function generatePNG(filename = 'resume.png'): Promise<void> {
  const el = document.getElementById('resume-preview');
  if (!el) throw new Error('Resume preview element not found');

  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = '794px';
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794,
      windowWidth: 794,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    document.body.removeChild(clone);
  }
}
