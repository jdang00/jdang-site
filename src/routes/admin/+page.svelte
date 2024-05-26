<script>
	import '../../app.css';
	import BlogTable from './post_table.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	export let data;
</script>

<div class="border-b min-h-14 flex flex-row items-center justify-between px-8">
	<a class="font-semibold" href="/">jdang-site</a>
	<h1 class="font-semibold">Admin Dashboard</h1>
	<Avatar.Root>
		<Avatar.Image
			src="https://utfs.io/f/11a65a73-c4ff-4b9c-96d4-27c680ec9740-ge3if.webp"
			alt="@jdang"
		/>
		<Avatar.Fallback>JD</Avatar.Fallback>
	</Avatar.Root>
</div>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-7xl mt-6">
		<BlogTable {data} />
	</div>
</div>
