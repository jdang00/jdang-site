<script>
	import '../../app.css';
	import BlogTable from './post_table.svelte';
	import { Button } from '$lib/components/ui/button';

	export let data;
</script>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full">
		<div class="mb-12"><h1 class="text-xl">Admin Dashboard</h1></div>

		<Button class="mb-6" variant="secondary">New Post</Button>

		<div class="flex flex-row">
			<div class="border rounded max-w-full"><BlogTable {data} /></div>
			<div class=""></div>
		</div>
	</div>
</div>
