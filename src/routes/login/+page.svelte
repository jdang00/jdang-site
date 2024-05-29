<script lang="ts">
	import '../../app.css';
	import type { PageData } from './$types.js';
	import Login from './login.svelte';
	export let data: PageData;
</script>

<div class="border-b min-h-14 flex flex-row items-center px-8 justify-between">
	<a class="font-semibold" href="/">jdang-site</a>
</div>

<div class="flex flex-col items-center justify-center mx-auto mt-36">
	<div class="rounded shadow-2xl px-16 py-16 w-auto">
		<h1 class="font-semibold text-3xl mb-8">Login</h1>
		<Login data={data.form} />
	</div>
</div>
