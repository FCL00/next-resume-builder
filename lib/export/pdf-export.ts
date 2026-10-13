'use client';

import { toast } from 'sonner';

/**
 * Triggers standard browser print dialog optimized via CSS @media print
 * This creates a 100% crisp, selectable text PDF with zero image blurriness.
 */
export function printResume(): void {
  if (typeof window === 'undefined') return;
  toast.info('Opening Print dialog. Choose "Save as PDF" for the crispest text.');
  setTimeout(() => {
    window.print();
  }, 250);
}

/**
 * Direct client-side PDF generation using jsPDF
 */
export async function downloadResumeAsPdf(resumeTitle: string = 'Resume'): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const { jsPDF } = await import('jspdf');

    // Create an A4 document (210 x 297 mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const element = document.getElementById('resume-preview-container');
    if (!element) {
      toast.error('Resume preview element not found. Please try printing instead.');
      return false;
    }

    toast.loading('Preparing PDF document...');

    // Use jsPDF's built-in html renderer
    await doc.html(element, {
      callback: (pdf) => {
        const cleanTitle = resumeTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
        pdf.save(`${cleanTitle}.pdf`);
        toast.dismiss();
        toast.success('Resume PDF downloaded!');
      },
      x: 0,
      y: 0,
      width: 210, // A4 width in mm
      windowWidth: element.offsetWidth || 794, // Standard 96 DPI A4 width in px
      autoPaging: 'text',
      margin: [0, 0, 0, 0],
    });

    return true;
  } catch (err: any) {
    console.error('jsPDF generation failed, falling back to print dialog:', err);
    toast.dismiss();
    toast.error('Direct PDF rendering had an issue. Opening browser Print to PDF...');
    window.print();
    return false;
  }
}
