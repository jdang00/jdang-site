<script lang="ts">
	import '../../app.css';
	import type { PageData } from './$types.js';
	import Login from './login.svelte';
	export let data: PageData;
</script>

<div class="flex flex-col items-center justify-center min-h-screen mx-auto">
	<div class="rounded shadow-2xl px-16 py-16 w-auto">
		<h1 class="font-semibold text-3xl mb-8">Login</h1>
		<Login data={data.form} />
	</div>
</div>
