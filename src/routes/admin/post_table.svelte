<script>
	import * as Table from '$lib/components/ui/table';
	export let data;
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatDate } from '$lib/utils';
	import Edit from '@tabler/icons-svelte/IconEdit.svelte';
	import Trash from '@tabler/icons-svelte/IconTrash.svelte';
</script>

<div>
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
			{#each data.posts as post}
				<Table.Row>
					<Table.Cell
						><a class="hover:text-sky-600" href="/admin/edit/{post.slug}">
							{post.title}
						</a></Table.Cell
					>

					<Table.Cell>{post.description}</Table.Cell>
					<Table.Cell>{formatDate(post.date)}</Table.Cell>
					<Table.Cell>
						{#each post.categories as category}
							<Badge variant="secondary" class="me-3">{category}</Badge>
						{/each}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
