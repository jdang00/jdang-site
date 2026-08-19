<script lang="ts">
	import katex from 'katex';

	let { tex, display = false }: { tex: string; display?: boolean } = $props();

	const html = $derived(
		katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: false })
	);
</script>

{#if display}
	<div class="tex-display">{@html html}</div>
{:else}<span class="tex-inline">{@html html}</span>{/if}

<style>
	.tex-display {
		margin: 1.7rem 0;
		padding: 0.15rem 0;
		overflow-x: auto;
		overflow-y: hidden;
		font-size: 1.06rem;
		text-align: center;
		scrollbar-width: none;
	}

	.tex-display::-webkit-scrollbar {
		display: none;
	}

	.tex-display :global(.katex-display) {
		margin: 0;
	}

	.tex-inline {
		font-size: 1.02em;
		white-space: nowrap;
	}
</style>
