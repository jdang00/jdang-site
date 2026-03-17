<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	let { children } = $props();

	const hideSiteChrome = $derived(page.url.pathname.endsWith('/present'));
</script>

<div class="flex min-h-screen flex-col">
	{#if !hideSiteChrome}
		<header
			class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
		>
			<div class="container mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<div class="flex items-center">
						<a href="/" class="text-xl font-semibold text-foreground">Justin A. Dang</a>
					</div>

					<nav class="hidden items-center space-x-4 md:flex">
						<DarkModeToggle />
					</nav>

					<div class="flex items-center space-x-4 md:hidden">
						<DarkModeToggle />
						<button class="text-muted-foreground hover:text-foreground" aria-label="Open mobile menu">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</header>
	{/if}

	<main class="flex-1">
		{@render children()}
	</main>
</div>
