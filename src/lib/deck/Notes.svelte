<script lang="ts">
	import { Notes as AnimotionNotes } from '@animotion/core';

	let { children }: { children?: import('svelte').Snippet } = $props();
</script>

<AnimotionNotes>
	{#if children}
		{@render children()}
	{/if}
</AnimotionNotes>
