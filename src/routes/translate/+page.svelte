<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { onMount, onDestroy } from 'svelte';
	import { jsPDF } from 'jspdf';

	let file = $state<File | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let summary = $state<string | null>(null);
	let pdfLoading = $state(false);
	let streamedText = $state('');
	let streamingComplete = $state(false);

	// Constants for safety limits
	const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
	const MAX_BUFFER_SIZE = 1024 * 1024; // 1MB
	const STREAM_TIMEOUT = 90000; // 90 seconds - increased to accommodate typical translation time of 30-60 seconds

	// Improved translation prompt
	const prompt = `You are a professional translator. Translate the entire content of the provided document into Vietnamese. The document may contain headers, footers, and page numbers—please recognize and preserve these in the translation, maintaining their position and formatting. Also, preserve the original structure, formatting, and any technical terms. If the document contains tables, lists, or special formatting, maintain them in the translation. Do not summarize or omit any content. Output only the translated Vietnamese text.`;
	// Spinner SVG
	const Spinner = `<svg class='animate-spin h-5 w-5 text-white inline-block mr-2' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle><path class='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path></svg>`;
	// Download icon SVG
	const DownloadIcon = `<svg class='h-5 w-5 inline-block mr-2' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4'/></svg>`;

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newFile = target.files && target.files[0] ? target.files[0] : null;
		
		if (newFile && newFile.size > MAX_FILE_SIZE) {
			error = `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
			file = null;
			return;
		}
		
		file = newFile;
		summary = null;
		error = null;
		streamedText = '';
	}

	async function handleSubmit() {
		if (!file) {
			error = 'Please select a file.';
			return;
		}

		loading = true;
		error = null;
		summary = null;
		streamedText = '';
		streamingComplete = false;
		
		try {
			const base64 = await toBase64(file);
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), STREAM_TIMEOUT);

			const res = await fetch('/api/summarize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ base64, prompt }),
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!res.ok) {
				const data = await res.json().catch(() => ({ 
					error: 'Failed to translate and parse error response.' 
				}));
				error = data.error || 'Failed to translate.';
				loading = false;
				return;
			}

			if (!res.body) {
				error = 'Response body is null. Cannot stream data.';
				loading = false;
				return;
			}

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					if (buffer.trim()) {
						processSSEData(buffer);
					}
					streamingComplete = true;
					break;
				}

				const chunk = decoder.decode(value, { stream: true });
				buffer += chunk;

				if (buffer.length > MAX_BUFFER_SIZE) {
					throw new Error('Buffer size exceeded maximum limit');
				}

				const messages = buffer.split('\n\n');
				buffer = messages.pop() || '';
				
				for (const message of messages) {
					if (message.trim()) {
						processSSEData(message);
					}
				}
			}
		} catch (e: unknown) {
			console.error('An error occurred during handleSubmit:', e);
			if (e instanceof Error) {
				error = e.message;
			} else if (e instanceof DOMException && e.name === 'AbortError') {
				error = 'Request timed out. Please try again.';
			} else {
				error = 'An unexpected error occurred.';
			}
		} finally {
			loading = false;
		}
	}

	function processSSEData(message: string) {
		const lines = message.split('\n');
		for (const line of lines) {
			if (line.startsWith('data: ')) {
				const jsonData = line.substring(6).trim();
				if (jsonData && jsonData !== '[DONE]') {
					try {
						const parsed = JSON.parse(jsonData);
						if (parsed.text) {
							streamedText += parsed.text;
							summary = streamedText;
						}
					} catch (e) {
						console.error('Error parsing SSE JSON data:', e, 'Data:', jsonData);
					}
				}
			}
		}
	}

	function toBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as string;
				resolve(result.split(',')[1]); // Remove the data:...;base64, prefix
			};
			reader.onerror = (errorEvent) => reject(errorEvent); // Pass the error event
			reader.readAsDataURL(file);
		});
	}

	async function generatePDF() {
	if (!summary) return;
	
	pdfLoading = true;
	try {
		const doc = new jsPDF();
		
		// Fetch and add the Noto Serif font
		const fontResponse = await fetch('/NotoSerif-VariableFont_wdth,wght.ttf');
		if (!fontResponse.ok) throw new Error('Failed to load font');
		
		const fontArrayBuffer = await fontResponse.arrayBuffer();
		const fontBase64 = btoa(
			new Uint8Array(fontArrayBuffer)
				.reduce((data, byte) => data + String.fromCharCode(byte), '')
		);
		
		doc.addFileToVFS('NotoSerif.ttf', fontBase64);
		doc.addFont('NotoSerif.ttf', 'NotoSerif', 'normal');
		doc.addFont('NotoSerif.ttf', 'NotoSerif', 'bold');
		doc.setFont('NotoSerif');
		
		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const margin = 20;
		const contentWidth = pageWidth - (margin * 2);
		let yPosition = margin;
		
		// Add title
		doc.setFontSize(18);
		doc.setFont('NotoSerif', 'bold');
		const title = 'Oak Cliff Baptist Church';
		const titleWidth = doc.getTextWidth(title);
		doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
		yPosition += 15;

		// Add subtitle
		doc.setFontSize(14);
		const subtitle = 'Vietnamese Translation';
		const subtitleWidth = doc.getTextWidth(subtitle);
		doc.text(subtitle, (pageWidth - subtitleWidth) / 2, yPosition);
		yPosition += 15;

		// Add date
		doc.setFontSize(12);
		const date = new Date().toLocaleDateString('en-US', { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
		const dateWidth = doc.getTextWidth(date);
		doc.text(date, (pageWidth - dateWidth) / 2, yPosition);
		yPosition += 10;
		
		doc.setLineWidth(0.5);
		doc.line(margin, yPosition, pageWidth - margin, yPosition);
		yPosition += 15;
		
		// Set 18pt font - good for bifocal users while maintaining readability
		doc.setFont('NotoSerif', 'normal');
		doc.setFontSize(18);
		
		const content = summary;
		// Line height for 18pt font (1.4x for good readability)
		const lineHeight = 25;
		const paragraphSpacing = 12; // Space between paragraphs
		
		const paragraphs = content.split('\n\n');
		
		for (let i = 0; i < paragraphs.length; i++) {
			const paragraph = paragraphs[i].trim();
			if (!paragraph) continue;
			
			// Handle long words but keep it minimal for better flow
			const processedParagraph = paragraph.replace(/(\S{25,})/g, (word) => {
				if (doc.getTextWidth(word) > contentWidth * 0.9) {
					return word.match(/.{1,20}/g)?.join('-') || word;
				}
				return word;
			});
			
			const lines = doc.splitTextToSize(processedParagraph, contentWidth);
			
			// Check if we need a new page for this paragraph
			const requiredSpace = (lines.length * lineHeight) + paragraphSpacing;
			const availableSpace = pageHeight - margin - 25 - yPosition; // Reserve 25 for footer
			
			if (requiredSpace > availableSpace && yPosition > margin + 50) {
				doc.addPage();
				yPosition = margin + 20;
			}
			
			// Add each line of the paragraph
			for (let j = 0; j < lines.length; j++) {
				// Check if this line will fit on current page
				if (yPosition + lineHeight > pageHeight - margin - 25) {
					doc.addPage();
					yPosition = margin + 20;
				}
				
				// Left-align text for natural paragraph flow
				doc.text(lines[j], margin, yPosition);
				yPosition += lineHeight;
			}
			
			// Add spacing between paragraphs (only if not at end and not near page bottom)
			if (i < paragraphs.length - 1 && 
				yPosition + paragraphSpacing < pageHeight - margin - 25) {
				yPosition += paragraphSpacing;
			}
		}
		
		// Add page numbers and timestamp
		const pageCount = doc.internal.pages.length - 1;
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(10);
			doc.setFont('NotoSerif', 'normal');
			
			// Page number
			const pageText = `Page ${i} of ${pageCount}`;
			const pageTextWidth = doc.getTextWidth(pageText);
			doc.text(pageText, pageWidth - pageTextWidth - margin, pageHeight - 10);
			
			// Timestamp on first page only
			if (i === 1) {
				doc.setFontSize(8);
				const timestamp = `Generated: ${new Date().toLocaleString('en-US')}`;
				doc.text(timestamp, margin, pageHeight - 10);
			}
		}
		
		doc.save('translation.pdf');
	} catch (e: unknown) {
		if (e instanceof Error) {
			error = `Failed to generate PDF: ${e.message}`;
		} else {
			error = 'Failed to generate PDF: Unknown error';
		}
		console.error('PDF generation error:', e);
	} finally {
		pdfLoading = false;
	}
}

	// No need for onDestroy for the main EventSource here as it's handled within handleSubmit
</script>

<div class="flex min-h-screen items-center justify-center bg-white px-4 py-8 sm:px-6">
	<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md sm:max-w-lg sm:p-10">
		<h1 class="mb-8 text-center text-2xl font-semibold sm:text-3xl">Translate</h1>
		<form class="flex flex-col gap-6" onsubmit={handleSubmit}> 
			<div class="grid w-full gap-2">
				<Label for="document" class="text-base">Upload Document</Label>
				<Input
					id="document"
					type="file"
					accept=".txt,.pdf,.doc,.docx"
					class="cursor-pointer pb-12 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
					on:change={handleFileChange}
				/>
			</div>
			<p class="text-center text-sm text-gray-500 sm:text-left">
				Supported formats: TXT, PDF, DOC, DOCX
			</p>
			<button
				type="submit"
				class="mt-2 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
				disabled={loading}
			>
				{@html loading ? Spinner + 'Translating...' : 'Translate'}
			</button>
			{#if error}
				<p class="text-center text-sm text-red-500">{error}</p>
			{/if}
			{#if summary}
				<div class="mt-4 rounded bg-gray-50 p-4 text-sm text-gray-800">
					<div class="flex justify-between items-center mb-2">
						<strong>Translation:</strong>
						<button
							type="button" 
							onclick={generatePDF}
							class="flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
							disabled={pdfLoading || !streamingComplete}
						>
							{@html pdfLoading ? Spinner + 'Generating PDF...' : 
								!streamingComplete ? Spinner + 'Waiting for translation...' : 
								DownloadIcon + 'Download PDF'}
						</button>
					</div>
					<div id="translation-content" class="mt-2 whitespace-pre-line">{summary}</div>
				</div>
			{/if}
		</form>
	</div>
</div>