<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { deckLibrary } from '$lib/decks/registry';

	const totalSlides = deckLibrary.reduce((count, deck) => count + deck.slides, 0);
</script>

<svelte:head>
	<title>Decks | Justin A. Dang</title>
	<meta name="description" content="Presentations built with Animotion and Svelte." />
</svelte:head>

<section class="min-h-screen bg-background py-10 sm:py-14">
	<div class="mx-auto max-w-3xl px-4 sm:px-6">
		<header class="mb-10 max-w-2xl">
			<p class="font-mono text-xs text-muted-foreground">~/decks</p>
			<h1 class="mt-2 text-2xl font-medium tracking-tight text-foreground">Decks</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				{deckLibrary.length} presentations
			</p>
		</header>

		<div class="border-t border-border">
			{#each deckLibrary as deck, i}
				<a
					href={`/decks/${deck.slug}`}
					in:fly={{ y: 16, duration: 320, delay: 80 + i * 55, opacity: 0.15 }}
					class="group flex items-center gap-4 border-b border-border/50 py-4 transition-colors hover:bg-muted/40 sm:-mx-3 sm:rounded-md sm:border-none sm:px-3"
				>
					<div
						class="mt-1 size-2.5 shrink-0 rounded-full sm:mt-0"
						style="background-color: {deck.accent};"
					></div>

					<div class="min-w-0 flex-1">
						<div class="flex items-baseline gap-3">
							<p class="font-medium text-foreground">{deck.title}</p>
							<span class="hidden font-mono text-xs text-muted-foreground/50 sm:inline">
								{deck.slides} slides
							</span>
						</div>
						<p class="mt-0.5 font-mono text-xs text-muted-foreground">{deck.slug}</p>
					</div>

					<div class="hidden items-center gap-1.5 lg:flex">
						{#each deck.tags.slice(0, 2) as tag}
							<span
								class="rounded border px-1.5 py-0.5 font-mono text-[10px]"
								style="border-color: {deck.accent}25; color: {deck.accent}; background-color: {deck.accent}08;"
							>
								{tag}
							</span>
						{/each}

						<ArrowRight
							class="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
						/>
					</div>
				</a>
			{/each}
		</div>

		<footer class="mt-6 font-mono text-xs text-muted-foreground/70">
			{deckLibrary.length} decks · {totalSlides} slides · animotion + svelte
		</footer>
	</div>
</section>
