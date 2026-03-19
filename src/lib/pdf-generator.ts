/* ── PDF Generator — Pixel-perfect A4 export ─────────────── */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Captures the resume preview element at its NATIVE pixel size (794×1123 = A4
 * at 96 dpi).  We clone the element off-screen at 1:1 scale so html2canvas
 * never has to deal with CSS transforms or mm units.
 *
 * Optimized for file size: uses JPEG compression instead of lossless PNG,
 * and a balanced scale factor for crisp text without multi-MB bloat.
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
  clone.style.maxHeight = 'none';
  clone.style.height = 'auto';
  clone.style.overflow = 'visible';
  clone.style.background = '#fff';
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 1.5, // 1.5x: good balance of crisp text vs small file size (was 2x)
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794,
      windowWidth: 794,
    });

    // Use JPEG at 85% quality — typically 3-5x smaller than PNG
    const imgData = canvas.toDataURL('image/jpeg', 0.85);

    // A4: 210mm × 297mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true, // enable stream compression
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    // Handle multi-page if content is taller than one A4 page
    const canvasAspect = canvas.height / canvas.width;
    const contentHeight = pdfWidth * canvasAspect;
    const scaleFactor = 1.5; // matches html2canvas scale above

    if (contentHeight <= pdfHeight + 2) {
      // Content fits in one page
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, contentHeight, undefined, 'FAST');
    } else {
      // Multi-page: slice the canvas
      const pageHeightPx = (pdfHeight / pdfWidth) * 794 * scaleFactor; // pixels per page at current scale
      const totalPages = Math.ceil(canvas.height / pageHeightPx);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const srcY = page * pageHeightPx;
        const srcH = Math.min(pageHeightPx, canvas.height - srcY);

        // Create a sub-canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcH;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
          const pageImg = pageCanvas.toDataURL('image/jpeg', 0.85);
          const pageH = (srcH / pageHeightPx) * pdfHeight;
          pdf.addImage(pageImg, 'JPEG', 0, 0, pdfWidth, pageH, undefined, 'FAST');
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
  clone.style.maxHeight = 'none';
  clone.style.height = 'auto';
  clone.style.overflow = 'visible';
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

    // Use blob URL for more reliable download + proper cleanup
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      // Clean up the object URL after download triggers
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, 'image/png');
  } finally {
    document.body.removeChild(clone);
  }
}
