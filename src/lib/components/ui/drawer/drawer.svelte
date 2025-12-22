<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { onDestroy } from "svelte";

	let {
		shouldScaleBackground = true,
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		...restProps
	}: DrawerPrimitive.RootProps = $props();

	// Ensure scroll is always restored when drawer closes
	$effect(() => {
		if (!open) {
			// Small delay to ensure cleanup happens after drawer animation
			setTimeout(() => {
				document.body.style.overflow = '';
				document.body.style.pointerEvents = '';
			}, 100);
		}
	});

	// Cleanup on component unmount
	onDestroy(() => {
		document.body.style.overflow = '';
		document.body.style.pointerEvents = '';
	});
</script>

<DrawerPrimitive.Root {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps} />
