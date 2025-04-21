import { GlobalWorkerOptions } from 'pdfjs-dist';

export const setupWorker = async () => {
   GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.js",
        import.meta.url
    ).toString();
};
