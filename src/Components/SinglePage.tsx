import { type PDFDocumentProxy, getDocument } from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";
import type { SinglePageProps } from "../types";
import { setupWorker } from "../setupWorker";

function SinglePage({
	url,
	scale = window.innerWidth / 500,
	title = "PDF Viewer",
	loading = "Loading...",
	canvasStyle,
	previousButtonStyle,
	nextButtonStyle,
	previousButtonText,
	nextButtonText,
	buttonsStyle,
}: SinglePageProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [pendingPage, setPendingPage] = useState<number | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pdfDocRef = useRef<PDFDocumentProxy | null>(null);

	const outputScale = window.devicePixelRatio || 1;

	// Load the PDF document only once when component mounts
	useEffect(() => {
		// worker should only initialize once
		setupWorker();
	}, []);

	// Effect to handle page changes
	useEffect(() => {
		if (pdfDocRef.current) {
			queueRenderPage(currentPage);
		}

		getDocument(url)
			.promise.then((pdf: PDFDocumentProxy) => {
				pdfDocRef.current = pdf;
				setTotalPages(pdf.numPages);
				renderPage(currentPage);
			})
			.catch((error) => {
				console.error("Error loading PDF:", error);
			});

		return () => {
			if (pdfDocRef.current) {
				pdfDocRef.current.destroy();
			}
		};
	}, [currentPage, url]);

	const renderPage = async (num: number) => {
		const pdfDoc = pdfDocRef.current;
		if (!pdfDoc) return;

		setIsLoading(true);

		try {
			const page = await pdfDoc.getPage(num);

			const viewport = page.getViewport({ scale });
			const canvas = canvasRef.current;

			if (canvas) {
				const context = canvas.getContext("2d");
				if (!context) return;

				canvas.width = Math.floor(viewport.width * outputScale);
				canvas.height = Math.floor(viewport.height * outputScale);
				canvas.style.width = `${Math.floor(viewport.width)}px`;
				canvas.style.height = `${Math.floor(viewport.height)}px`;

				const transform =
					outputScale !== 1
						? [outputScale, 0, 0, outputScale, 0, 0]
						: undefined;

				const renderContext = {
					canvasContext: context,
					transform,
					viewport,
				};

				// Render the page on the canvas
				await page.render(renderContext).promise;

				if (pendingPage !== null && pendingPage !== num) {
					const nextPage = pendingPage;
					setPendingPage(null);
					renderPage(nextPage);
				}
			}
		} catch (error) {
			console.error("Error getting page:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const queueRenderPage = (num: number) => {
		if (isLoading) {
			setPendingPage(num);
		} else {
			renderPage(num);
		}
	};

	const onPrevPage = () => {
		if (currentPage <= 1) return;
		setCurrentPage((prev) => prev - 1);
	};

	const onNextPage = () => {
		if (!pdfDocRef.current || currentPage >= totalPages) return;
		setCurrentPage((prev) => prev + 1);
	};

	return (
		<div className="w-fit mx-auto">
			<h1 className="w-fit py-4 font-semibold mx-auto text-2xl">{title}</h1>

			{isLoading ? (
				loading
			) : (
				<canvas
					ref={canvasRef}
					className={canvasStyle || "border-2 border-dashed rounded"}
				/>
			)}

			<div
				className={
					buttonsStyle || "mx-auto flex justify-between items-center py-4 px-4"
				}
			>
				<button
					type="button"
					onClick={onPrevPage}
					className={`cursor-pointer ${previousButtonStyle}`}
					disabled={currentPage <= 1}
				>
					{previousButtonText || "Previous"}
				</button>
				<span>{currentPage || `Page: ${currentPage} / ${totalPages}`}</span>
				<button
					type="button"
					onClick={onNextPage}
					className={`cursor-pointer ${nextButtonStyle}`}
					disabled={currentPage >= totalPages}
				>
					{nextButtonText || "Next"}
				</button>
			</div>
		</div>
	);
}

export default SinglePage;
