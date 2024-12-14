<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	export let highlighted: string = '';

	const tabs = ['About', 'Blog'];
</script>

<div class="flex flex-row flex-wrap gap-2">
	{#each tabs as tab}
		{#if tab == highlighted}
			<Button href="/{tab.toLowerCase()}">{tab}</Button>
		{:else}
			<Button variant="outline" href="/{tab.toLowerCase()}">{tab}</Button>
		{/if}
	{/each}
</div>
