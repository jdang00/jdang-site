<script lang="ts">
	import { ArrowLeft, Play } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import AnimotionDeck from '$lib/deck/AnimotionDeck.svelte';
	import { deckPresentations } from '$lib/decks/presentations';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const DeckComponent = $derived(
		deckPresentations[data.deck.slug as keyof typeof deckPresentations]
	);
</script>

<svelte:head>
	<title>{data.deck.title} | Decks</title>
	<meta name="description" content={data.deck.description} />
</svelte:head>

<section class="min-h-screen bg-background py-10 sm:py-14">
	<div class="mx-auto max-w-5xl px-4 sm:px-6">
		<div class="mb-8 space-y-6">
			<div class="flex items-start justify-between gap-4">
				<Button
					variant="ghost"
					size="sm"
					href="/decks"
					class="shrink-0 gap-1.5 font-mono text-xs text-muted-foreground"
				>
					<ArrowLeft class="size-3" />
					back
				</Button>

				<Button href={`/decks/${data.deck.slug}/present`} size="sm" class="shrink-0 gap-1.5">
					<Play class="size-3" />
					Present
				</Button>
			</div>

			<div>
				<nav class="mb-3 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
					<a href="/decks" class="transition-colors hover:text-foreground">~/decks</a>
					<span>/</span>
					<span class="text-foreground">{data.deck.slug}</span>
				</nav>
				<div class="flex items-center gap-3">
					<div
						class="size-3 shrink-0 rounded-full"
						style="background-color: {data.deck.accent};"
					></div>
					<h1 class="text-2xl font-medium tracking-tight text-foreground">
						{data.deck.title}
					</h1>
				</div>
				<p class="mt-1.5 max-w-xl text-sm text-muted-foreground">
					{data.deck.description}
				</p>
				<div class="mt-4 flex flex-wrap gap-1.5">
					{#each data.deck.tags as tag}
						<span
							class="rounded border px-1.5 py-0.5 font-mono text-[11px]"
							style="border-color: {data.deck.accent}25; color: {data.deck
								.accent}; background-color: {data.deck.accent}08;"
						>
							{tag}
						</span>
					{/each}
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg border border-border bg-muted/30 dark:bg-muted/20">
			<div class="flex items-center justify-between border-b border-border px-4 py-2">
				<div class="flex items-center gap-3">
					<div class="flex gap-1.5">
						<div
							class="size-2.5 rounded-full"
							style="background-color: {data.deck.accent}40;"
						></div>
						<div class="size-2.5 rounded-full bg-border"></div>
						<div class="size-2.5 rounded-full bg-border"></div>
					</div>
					<span class="font-mono text-[11px] text-muted-foreground">
						{data.deck.slug}
					</span>
				</div>
				<span class="font-mono text-[11px] text-muted-foreground/50">
					{data.deck.slides} slides
				</span>
			</div>
			<div class="p-1.5">
				<AnimotionDeck>
					<DeckComponent />
				</AnimotionDeck>
			</div>
		</div>
	</div>
</section>
