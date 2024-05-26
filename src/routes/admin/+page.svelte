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
			src="https://utfs.io/f/50ee5591-301f-4c0f-b9cc-66b188de8d5e-1w6ku.png"
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
