import { GlobalWorkerOptions, PDFDocumentProxy, getDocument } from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";

const worker = "/pdf.worker.mjs";
GlobalWorkerOptions.workerSrc = worker;

type Props = {
  url: string;
  scale?: number;
  title?: string | React.ReactNode;
  loading?: string | React.ReactNode;
};

function Scrollable({ url, scale = window.innerWidth / 500, title , loading}: Props) {
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);

  const outputScale = window.devicePixelRatio || 1;

  useEffect(() => {
    getDocument(url)
      .promise.then((pdf: PDFDocumentProxy) => {
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        renderAllPages();
      })
      .catch((error) => {
        console.error("Error loading PDF:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    scale = window.innerWidth / 800;
  }, [window.innerWidth]);

  const renderAllPages = async () => {
    const pdfDoc = pdfDocRef.current;
    if (!pdfDoc || !containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Render each page
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      if (pdfDoc.numPages < pageNum) return;
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        // Create canvas for this page
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        // Set dimensions
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        // Add to container
        containerRef.current.appendChild(canvas);

        // Render page
        const transform =
          outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : undefined;

        const renderContext = {
          canvasContext: context,
          transform,
          viewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error);
      }
    }
  };

  return (
    <div className="my-6">
      <h1 className="font-semibold text-2xl text-center py-4">{title}</h1>
      {isLoading ? (
       loading || <div className="text-center">Loading PDF...</div>
      ) : (
        <div
          ref={containerRef}
          className="w-fit mx-auto max-h-[80vh] overflow-y-scroll"
        />
      )}
      <div className="mt-4 text-center">
        <span>Total Pages: {totalPages}</span>
      </div>
    </div>
  );
}

export default Scrollable;
