<script lang="ts">
	import '../../app.css';
	import type { PageData } from './$types.js';
	import Login from './login.svelte';
	export let data: PageData;
</script>

<div class="border-b min-h-14 flex flex-row items-center px-8 justify-between">
	<a class="font-semibold" href="/">jdang-site</a>
</div>

<Login data={data.form} />
