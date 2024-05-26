<script>
	import '../../../../app.css';
	import { Input } from '$lib/components/ui/input';
	export let data;
</script>

<div class="flex items-center justify-between w-full flex-col p-8 min-h-screen">
	<div class="w-full max-w-3xl">
		<div class="mb-12"><h1 class="text-3xl">Edit</h1></div>
		<div class="flex flex-col">
			<div class="mb-12"><Input class="max-w" bind:value={data.meta.title} /></div>
			<svelte:component this={data.content} />
		</div>
	</div>
</div>
