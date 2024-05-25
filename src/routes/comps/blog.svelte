<script lang="ts">
	export let data;
	import { Badge } from '$lib/components/ui/badge';
	import { formatDate } from '$lib/utils';
</script>

<div class="mt-23">
	<div class="border-b w-full my-8"></div>

	{#each data.posts as post}
		<a class="my-12 hover:text-sky-600" href="../{post.slug}">
			<div class="flex flex-row mb-6">
				<p class="text-gray-500 me-5">{formatDate(post.date)}</p>
				{#each post.categories as categories}
					<Badge variant="secondary" class="me-3">{categories}</Badge>
				{/each}
			</div>
			<h1 class="text-5xl">{post.title}</h1>
			<p class="text-gray-500 mt-2">{post.description}</p>
			<div class="border-b w-full my-8"></div>
		</a>
	{/each}
</div>
