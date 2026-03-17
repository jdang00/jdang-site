<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const items = [
		{
			title: 'Decks Subdomain',
			description:
				'This page is served from the same SvelteKit app and is intended to be reached through decks.justindang.dev.'
		},
		{
			title: 'Routing Check',
			description:
				'If you can load this page from the subdomain after attaching the domain in Vercel, the host-based rewrite is working.'
		},
		{
			title: 'Next Step',
			description:
				'Replace this placeholder page with your actual decks experience once the domain wiring is verified.'
		}
	];
</script>

<svelte:head>
	<title>Decks | Justin A. Dang</title>
	<meta
		name="description"
		content="Decks landing page served from the justindang.dev SvelteKit app."
	/>
</svelte:head>

<section class="relative overflow-hidden bg-background py-16 sm:py-20" in:fade={{ duration: 200 }}>
	<div
		class="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-muted/60 to-transparent"
		aria-hidden="true"
	></div>

	<div class="container relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<div class="max-w-3xl" in:fly={{ y: 18, duration: 300, easing: quintOut }}>
			<p class="font-display text-sm uppercase tracking-[0.28em] text-muted-foreground">
				decks.justindang.dev
			</p>
			<h1 class="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
				Decks
			</h1>
			<p class="mt-5 text-lg leading-8 text-muted-foreground sm:text-xl">
				A dedicated subdomain routed through the main site on Vercel. This page exists so you can
				verify the domain setup before building out the actual content.
			</p>
		</div>

		<div class="mt-12 grid gap-4 sm:grid-cols-3">
			{#each items as item, i}
				<div
					class="rounded-2xl border border-border bg-card p-6 shadow-sm"
					in:fly={{ y: 20, duration: 280, delay: 80 + i * 70, easing: quintOut }}
				>
					<h2 class="text-lg font-medium text-card-foreground">{item.title}</h2>
					<p class="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
