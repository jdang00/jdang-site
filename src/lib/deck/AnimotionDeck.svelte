<script lang="ts">
	import { browser } from '$app/environment';
	import { getPresentation, Presentation } from '@animotion/core';
	import '@animotion/core/theme';
	import { onDestroy, onMount } from 'svelte';

	import { exitFullscreenIfActive, resetRevealDocumentState } from '$lib/browser/document-state';

	let {
		children,
		embedded = true,
		fullHeight = false
	} = $props<{
		children?: import('svelte').Snippet;
		embedded?: boolean;
		fullHeight?: boolean;
	}>();

	type DeckApi = {
		getRevealElement?: () => Element | null;
		destroy?: () => void;
	};

	let deckShell: HTMLDivElement | undefined;
	let deckInstance: DeckApi | undefined;
	let isDisposed = false;

	const options = $derived({
		hash: true,
		embedded,
		slideNumber: 'c/t',
		center: false
	});

	function ownsDeck(candidate: DeckApi) {
		const revealElement = candidate.getRevealElement?.();
		return revealElement instanceof HTMLElement && !!deckShell?.contains(revealElement);
	}

	async function captureDeckInstance() {
		if (!browser) {
			return;
		}

		while (!deckInstance && !isDisposed) {
			const candidate = getPresentation().slides;

			if (candidate && ownsDeck(candidate)) {
				deckInstance = candidate;
				return;
			}

			await new Promise<void>((resolve) => {
				requestAnimationFrame(() => resolve());
			});
		}
	}

	async function teardownDeck() {
		if (!browser) {
			return;
		}

		const instance = deckInstance;
		deckInstance = undefined;

		await exitFullscreenIfActive();

		try {
			instance?.destroy?.();
		} catch {
			// Ignore Reveal teardown errors and still clear the leaked document state.
		}

		resetRevealDocumentState();
	}

	function proxyEmbeddedWheel(node: HTMLElement) {
		function handleWheel(event: WheelEvent) {
			if (!embedded || !browser || event.ctrlKey) {
				return;
			}

			if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
				return;
			}

			const scrollRoot = document.scrollingElement;

			if (!(scrollRoot instanceof HTMLElement)) {
				return;
			}

			event.preventDefault();
			scrollRoot.scrollBy({
				top: event.deltaY,
				left: 0,
				behavior: 'auto'
			});
		}

		node.addEventListener('wheel', handleWheel, { passive: false });

		return {
			destroy() {
				node.removeEventListener('wheel', handleWheel);
			}
		};
	}

	onMount(() => {
		isDisposed = false;

		if (embedded) {
			resetRevealDocumentState();
		}

		void captureDeckInstance();
	});

	onDestroy(() => {
		isDisposed = true;
		void teardownDeck();
	});
</script>

<div
	use:proxyEmbeddedWheel
	bind:this={deckShell}
	class:embedded-preview={embedded}
	class:full-height={fullHeight}
	class="deck-shell"
>
	<Presentation {options} class="deck-reveal">
		{#if children}
			{@render children()}
		{/if}
	</Presentation>
</div>

<style>
	.deck-shell {
		width: 100%;
		aspect-ratio: 16 / 9;
		background: radial-gradient(circle at top left, rgba(179, 213, 255, 0.35), transparent 34%),
			radial-gradient(circle at bottom right, rgba(255, 226, 179, 0.3), transparent 32%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 248, 252, 0.98));
		overflow: hidden;
	}

	.deck-shell.full-height {
		display: grid;
		place-items: center;
		height: 100vh;
		min-height: 100vh;
		aspect-ratio: auto;
		padding: 1rem;
	}

	:global(.deck-shell.full-height > .reveal) {
		width: min(calc(100vw - 2rem), calc((100vh - 2rem) * 16 / 9));
		height: min(calc((100vw - 2rem) * 9 / 16), calc(100vh - 2rem));
		margin: 0 auto;
	}

	/* .reveal is the outer wrapper created by Reveal.js */
	:global(.deck-shell > .reveal) {
		width: 100%;
		height: 100%;
	}

	/*
	 * .deck-reveal IS the .slides element (Presentation puts class on .slides div).
	 * So .deck-reveal = .slides, NOT a parent of .slides.
	 * Use .deck-reveal directly for .slides styles.
	 * Use .deck-reveal section for section styles.
	 */
	:global(.deck-reveal) {
		--r-main-font: 'Geist Sans', ui-sans-serif, system-ui, sans-serif;
		--r-code-font: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		width: 100%;
		height: 100%;
		font-family: var(--r-main-font);
		color: #14213d;
		text-align: left;
	}

	/* Override Reveal's .reveal .slides { text-align: center } */
	:global(.reveal .deck-reveal) {
		text-align: left;
	}

	:global(.deck-reveal section) {
		height: 100%;
		width: 100%;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
		padding: 3.5rem 4rem;
		/* Reveal sets display:'grid' on sections — align to top-left */
		align-content: start;
		justify-items: start;
	}

	:global(.deck-shell.embedded-preview .reveal-viewport),
	:global(.deck-shell.embedded-preview .deck-reveal),
	:global(.deck-shell.embedded-preview .deck-reveal section) {
		overscroll-behavior: auto;
	}

	:global(.deck-reveal h1),
	:global(.deck-reveal h2),
	:global(.deck-reveal h3) {
		font-family: var(--r-main-font);
		letter-spacing: -0.04em;
		text-transform: none;
		color: #0f172a;
	}

	:global(.deck-reveal p),
	:global(.deck-reveal li) {
		font-size: 1.25rem;
		line-height: 1.55;
	}

	:global(.deck-reveal ul) {
		list-style: disc;
		padding-left: 1.5em;
		margin: 0;
	}

	:global(.deck-reveal ul li + li) {
		margin-top: 0.5em;
	}

	:global(.deck-reveal pre) {
		width: 100%;
		border-radius: 1.25rem;
		box-shadow: 0 28px 70px rgba(15, 23, 42, 0.16);
	}

	:global(.deck-reveal code) {
		font-size: 1rem;
	}

	:global(.deck-reveal .controls) {
		color: #1d4ed8;
	}

	:global(.deck-reveal .progress) {
		color: #2563eb;
	}

	:global(.deck-reveal .slide-number) {
		font-family: var(--r-code-font);
		background: rgba(15, 23, 42, 0.7);
		border-radius: 999px;
		padding: 0.25rem 0.6rem;
	}

	@media (max-width: 640px) {
		.deck-shell.full-height {
			padding: 0.75rem;
		}

		:global(.deck-shell.full-height > .reveal) {
			width: min(calc(100vw - 1.5rem), calc((100vh - 1.5rem) * 16 / 9));
			height: min(calc((100vw - 1.5rem) * 9 / 16), calc(100vh - 1.5rem));
		}

		:global(.deck-reveal section) {
			padding: 1.5rem;
		}

		:global(.deck-reveal p),
		:global(.deck-reveal li) {
			font-size: 1rem;
		}
	}
</style>
