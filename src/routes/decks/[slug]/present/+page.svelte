<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';

	import AnimotionDeck from '$lib/deck/AnimotionDeck.svelte';
	import { deckPresentations } from '$lib/decks/presentations';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const DeckComponent = $derived(
		deckPresentations[data.deck.slug as keyof typeof deckPresentations]
	);

	let showControls = $state(true);
	let hideTimeout: ReturnType<typeof setTimeout>;

	function handleMouseMove() {
		showControls = true;
		clearTimeout(hideTimeout);
		hideTimeout = setTimeout(() => { showControls = false; }, 2500);
	}
</script>

<svelte:head>
	<title>{data.deck.title} | Present</title>
	<meta name="description" content={data.deck.description} />
</svelte:head>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
	class="min-h-screen bg-slate-950"
	onmousemove={handleMouseMove}
>
	<div
		class="absolute left-4 top-4 z-20 transition-opacity duration-300"
		class:opacity-0={!showControls}
		class:opacity-100={showControls}
	>
		<a
			href={`/decks/${data.deck.slug}`}
			class="inline-flex items-center gap-2 rounded-md border border-white/10 bg-slate-900/80 px-3 py-1.5 font-mono text-xs text-white/70 backdrop-blur transition hover:border-white/20 hover:text-white"
		>
			<ArrowLeft class="size-3" />
			esc
		</a>
	</div>

	<AnimotionDeck embedded={false} fullHeight={true}>
		<DeckComponent />
	</AnimotionDeck>
</section>
