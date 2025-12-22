<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { browser } from "$app/environment";
	import { onDestroy } from "svelte";

	let {
		shouldScaleBackground = true,
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		...restProps
	}: DrawerPrimitive.RootProps = $props();

	// Ensure scroll is always restored when drawer closes (client-side only)
	$effect(() => {
		if (browser && !open) {
			// Small delay to ensure cleanup happens after drawer animation
			setTimeout(() => {
				document.body.style.overflow = '';
				document.body.style.pointerEvents = '';
			}, 100);
		}
	});

	// Cleanup on component unmount (client-side only)
	onDestroy(() => {
		if (browser) {
			document.body.style.overflow = '';
			document.body.style.pointerEvents = '';
		}
	});
</script>

<DrawerPrimitive.Root {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps} />
