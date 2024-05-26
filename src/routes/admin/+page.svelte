<script>
	import '../../app.css';
	import BlogTable from './post_table.svelte';
	export let data;
</script>

<div class="border-b min-h-14 flex flex-row items-center justify-center">
	<h1 class="font-semibold">Admin Dashboard</h1>
</div>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-7xl mt-6">
		<BlogTable {data} />
	</div>
</div>
