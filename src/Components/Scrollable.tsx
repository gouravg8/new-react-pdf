import {
	// GlobalWorkerOptions,
	type PDFDocumentProxy,
	getDocument,
} from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ScrollableProps } from "../types";
import { setupWorker } from "../setupPdf";

setupWorker();
// const worker = "./pdf.worker.mjs";
// const worker = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js";
// GlobalWorkerOptions.workerSrc = worker;

function Scrollable({
	url,
	scale: initialScale = window.innerWidth / 500,
	// title = "PDF Viewer",
	title,
	loading,
	titleStyle,
	canvasStyle,
	totalPagesStyle,
	totalPagesCustomize,
}: ScrollableProps) {
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [scale, setScale] = useState(initialScale);
	const containerRef = useRef<HTMLDivElement>(null);
	const pdfDocRef = useRef<PDFDocumentProxy | null>(null);

	const outputScale = window.devicePixelRatio || 1;

	// Handle window resize properly
	useEffect(() => {
		const handleResize = () => {
			setScale(window.innerWidth / 800);
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [outputScale, scale]);

	const renderAllPages = useCallback(async () => {
		const pdfDoc = pdfDocRef.current;
		const oldScale = scale;

		console.log("from renderAllPages", {
			pdfDoc,
			container: containerRef.current,
		});

		if (
			!pdfDoc ||
			!containerRef.current ||
			(oldScale !== scale && containerRef.current)
		)
			return;

		// Clear container
		containerRef.current.innerHTML = "";

		// document fragment to hold the rendered pages
		const fragment = document.createDocumentFragment();

		// Render each page
		for (let pageNum = 1; pageNum <= (pdfDoc?.numPages ?? 0); pageNum++) {
			console.log("from loop", pageNum);
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
				canvas.style.width = `${Math.floor(viewport.width)}px`;
				canvas.style.height = `${Math.floor(viewport.height)}px`;
				canvas.style.display = "block";
				canvas.style.margin = "0 auto"; // Center the canvas

				// Add to container
				// containerRef.current?.appendChild(canvas);
				fragment.appendChild(canvas);

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

		containerRef.current.appendChild(fragment); // Append all pages at once
		setIsLoading(false);
	}, []);

	useEffect(() => {
		const loadPdf = async () => {
			try {
				const pdf = await getDocument(url).promise;
				pdfDocRef.current = pdf;
				setTotalPages(pdf.numPages);
				renderAllPages(); // This will be called only once when PDF is loaded
			} catch (error) {
				console.error("Error loading PDF:", error);
				setIsLoading(false);
			}
		};

		loadPdf();

		return () => {
			if (pdfDocRef.current) {
				pdfDocRef.current.destroy();
			}
		};
	}, [url, renderAllPages]); // Keep renderAllPages in dependencies

	useEffect(() => {
		if (pdfDocRef.current && !isLoading) {
			renderAllPages();
		}
	}, [scale]); // Only re-render when scale changes

	return (
		<div className="my-6 max-h-[90vh] overflow-y-scroll">
			<h1 className={titleStyle || "font-semibold text-2xl text-center py-4"}>
				{title}
			</h1>
			{isLoading &&
				(loading || <div className="text-center">Loading PDF...</div>)}
			<div
				ref={containerRef}
				className={`${canvasStyle || "w-fit mx-auto overflow-auto"} ${isLoading ? "hidden" : ""}`}
			/>
			{totalPagesCustomize || (
				<div className={totalPagesStyle || "mt-4 text-center"}>
					<span>Total Pages: {totalPages}</span>
				</div>
			)}
		</div>
	);
}
export default Scrollable;
