import { GlobalWorkerOptions } from 'pdfjs-dist';
// import workerUrl from "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js";
// import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js';


export const setupWorker = async () => {
    // GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.js`;
    // GlobalWorkerOptions.workerSrc = workerSrc;
    GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.js",
        import.meta.url
    ).toString();
};
