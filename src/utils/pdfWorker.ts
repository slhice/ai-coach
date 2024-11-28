import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js with a bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const initPdfWorker = async () => {
  try {
    return pdfjsLib;
  } catch (error) {
    console.error('Failed to initialize PDF.js:', error);
    throw new Error('Failed to initialize PDF processing');
  }
};