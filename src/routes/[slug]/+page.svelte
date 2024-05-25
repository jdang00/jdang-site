<script lang="ts">
	import Header from '../comps/head.svelte';
	import { formatDate } from '$lib/utils';
	import { Badge } from '$lib/components/ui/badge';
	import '../../app.css';
	import { Button } from '$lib/components/ui/button';
	export let data;
	import IconArrowLeft from '@tabler/icons-svelte/IconArrowLeft.svelte';
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-3xl">
		<Header />

		<Button variant="secondary" class="mb-6" href="/blog">
			<IconArrowLeft stroke={2} />
		</Button>

		<article>
			<div class="flex flex-row mb-6">
				<p class="text-gray-500 me-5">{formatDate(data.meta.date)}</p>
				{#each data.meta.categories as categories}
					<Badge variant="secondary" class="me-3">{categories}</Badge>
				{/each}
			</div>
			<h1 class="text-5xl">{data.meta.title}</h1>
			<div class="prose mt-6">
				<svelte:component this={data.content} />
			</div>
		</article>
	</div>
</div>
