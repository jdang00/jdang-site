<script lang="ts">
	import { Slide as AnimotionSlide } from '@animotion/core';
	import { cn } from '$lib/utils';

	let {
		children,
		id = null,
		animate = false,
		restart = false,
		class: className = '',
		...rest
	}: {
		children?: import('svelte').Snippet;
		id?: string | null;
		animate?: boolean;
		restart?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<AnimotionSlide
	{animate}
	animateId={id ?? undefined}
	animateRestart={restart}
	class={cn('h-full w-full', className)}
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</AnimotionSlide>
