<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';
	let { children } = $props();

	const hideSiteChrome = $derived(page.url.pathname.endsWith('/present'));
</script>

<div class="flex min-h-screen flex-col">
	<main class="flex-1">
		{@render children()}
	</main>
</div>
