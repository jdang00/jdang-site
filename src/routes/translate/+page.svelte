<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { onMount } from 'svelte';

	let file: File | null = null;
	let loading = false;
	let error: string | null = null;
	let summary: string | null = null;
	// Improved translation prompt
	const prompt = `You are a professional translator. Translate the entire content of the provided document into Vietnamese. The document may contain headers, footers, and page numbers—please recognize and preserve these in the translation, maintaining their position and formatting. Also, preserve the original structure, formatting, and any technical terms. If the document contains tables, lists, or special formatting, maintain them in the translation. Do not summarize or omit any content. Output only the translated Vietnamese text.`;

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		file = target.files && target.files[0] ? target.files[0] : null;
		summary = null;
		error = null;
	}

	async function handleSubmit() {
		if (!file) {
			error = 'Please select a file.';
			return;
		}
		loading = true;
		error = null;
		summary = null;
		try {
			const base64 = await toBase64(file);
			const res = await fetch('/api/summarize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ base64, prompt })
			});
			const data = await res.json();
			if (!res.ok) {
				error = data.error || 'Failed to translate.';
			} else {
				summary = data.summary;
			}
		} catch (e) {
			error = 'An error occurred.';
		} finally {
			loading = false;
		}
	}

	function toBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as string;
				// Remove the data:...;base64, prefix
				resolve(result.split(',')[1]);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-white px-4 py-8 sm:px-6">
	<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md sm:max-w-lg sm:p-10">
		<h1 class="mb-8 text-center text-2xl font-semibold sm:text-3xl">Translate</h1>
		<form class="flex flex-col gap-6" on:submit|preventDefault={handleSubmit}>
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
				class="mt-2 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
				disabled={loading}
			>
				{loading ? 'Translating...' : 'Translate'}
			</button>
			{#if error}
				<p class="text-center text-sm text-red-500">{error}</p>
			{/if}
			{#if summary}
				<div class="mt-4 rounded bg-gray-50 p-4 text-sm text-gray-800">
					<strong>Translation:</strong>
					<div class="mt-2 whitespace-pre-line">{summary}</div>
				</div>
			{/if}
		</form>
	</div>
</div>
