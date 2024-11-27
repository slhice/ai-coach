import * as pdfjsLib from 'pdfjs-dist';

let isWorkerInitialized = false;

export const initPdfWorker = async () => {
  if (!isWorkerInitialized) {
    try {
      const workerSrc = '/pdf.worker.min.js';
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
      isWorkerInitialized = true;
    } catch (error) {
      console.error('Failed to initialize PDF.js worker:', error);
      throw new Error('Failed to initialize PDF worker');
    }
  }
  return pdfjsLib;
};