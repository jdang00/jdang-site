<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ExternalLink, X } from 'lucide-svelte';

	interface Props {
		title: string;
		description: string;
		imageUrl?: string;
		imageAlt?: string;
		linkUrl: string;
		linkText?: string;
		trigger?: Snippet;
		open?: boolean;
	}

	let {
		title,
		description,
		imageUrl,
		imageAlt = title,
		linkUrl,
		linkText = 'Visit Link',
		trigger,
		open = $bindable(false)
	}: Props = $props();

	const handleVisitLink = () => {
		window.open(linkUrl, '_blank', 'noopener,noreferrer');
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(linkUrl);
		} catch (err) {
			console.error('Failed to copy link:', err);
		}
	};
</script>

<Drawer.Root bind:open>
	{#if trigger}
		<Drawer.Trigger>
			{@render trigger()}
		</Drawer.Trigger>
	{/if}

	<Drawer.Content class="max-h-[90vh]">
		<div class="mx-auto w-full max-w-4xl">
			<Drawer.Header class="text-center">
				<div class="flex items-center justify-between">
					<Drawer.Title class="text-left text-xl font-semibold leading-tight">
						{title}
					</Drawer.Title>
					<Drawer.Close>
						<button
							class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2"
						>
							<X class="h-4 w-4" />
							<span class="sr-only">Close</span>
						</button>
					</Drawer.Close>
				</div>
			</Drawer.Header>

			<div class="px-6 pb-8">
				<div class="flex flex-col gap-6 md:flex-row md:gap-8">
					{#if imageUrl}
						<div class="shrink-0 md:w-80">
							<div class="aspect-video overflow-hidden rounded-lg bg-muted/10 shadow-lg">
								<img
									src={imageUrl}
									alt={imageAlt}
									class="h-full w-full object-cover object-center"
									loading="lazy"
								/>
							</div>
						</div>
					{/if}
					<div class="flex flex-1 flex-col justify-between">
						<Drawer.Description class="mb-6 text-base leading-relaxed text-muted-foreground">
							{description}
						</Drawer.Description>

						<div class="flex gap-3 self-start">
							<Button onclick={handleVisitLink} class="flex items-center gap-2" variant="default">
								<ExternalLink class="h-4 w-4" />
								{linkText}
							</Button>
							<Button onclick={copyToClipboard} variant="outline" class="px-3" title="Copy link">
								<svg
									class="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									></path>
								</svg>
								<span class="sr-only">Copy link</span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
