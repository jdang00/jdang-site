<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	export let data;
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatDate } from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover';
	import { Input } from '$lib/components/ui/input/index.js';

	type Post = {
		title: string;
		description: string;
		date: string;
		categories: string[];
		published: boolean;
		slug: string;
	};

	let searchTerm = '';
	$: queryResults = data.posts.filter((post: Post) => {
		let titleTerm = post.title.toLowerCase();
		let descTerm = post.description.toLowerCase();
		let dateTerm = post.date.toLowerCase();
		let dateFormat = formatDate(post.date).toLowerCase();
		let tagsTerm = post.categories ? post.categories.join(' ').toLowerCase() : '';
		let publishedTerm = post.published.toString();
		let slugTerm = post.slug.toLowerCase();

		return (
			titleTerm.includes(searchTerm.toLowerCase()) ||
			descTerm.includes(searchTerm.toLowerCase()) ||
			dateTerm.includes(searchTerm.toLowerCase()) ||
			dateFormat.includes(searchTerm.toLowerCase()) ||
			publishedTerm.includes(searchTerm.toLowerCase()) ||
			slugTerm.includes(searchTerm.toLowerCase()) ||
			tagsTerm.includes(searchTerm.toLowerCase())
		);
	});
</script>

<div class="flex flex-col mx-auto">
	<div class="flex flex-row mb-6 justify-between gap-3">
		<h1 class="text-xl font-semibold self-center">Blog Posts</h1>
		<Input type="text" bind:value={searchTerm} placeholder="Search" class="max-w-xs ml-auto" />

		<Popover.Root portal={null}>
			<div class="flex flex-row justify-end">
				<Popover.Trigger asChild let:builder>
					<Button builders={[builder]} variant="secondary">New Post</Button>
				</Popover.Trigger>
				<Popover.Content class="p-6"><Input type="file" /></Popover.Content>
			</div>
		</Popover.Root>
	</div>
</div>

<div class="border rounded-md">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Title</Table.Head>
				<Table.Head>Description</Table.Head>
				<Table.Head>Date</Table.Head>
				<Table.Head>Tags</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each queryResults as post}
				<Table.Row>
					<Table.Cell
						><a class="hover:text-sky-600" href="/admin/edit/{post.slug}">
							{post.title}
						</a></Table.Cell
					>

					<Table.Cell>{post.description}</Table.Cell>
					<Table.Cell class="w-[200px]">{formatDate(post.date)}</Table.Cell>
					<Table.Cell class="w-[300px]">
						<div class="flex flex-wrap gap-2">
							{#each post.categories as category}
								<Badge variant="secondary">{category}</Badge>
							{/each}
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
