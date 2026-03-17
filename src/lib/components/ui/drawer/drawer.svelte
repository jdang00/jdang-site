<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { browser } from "$app/environment";
	import { onDestroy } from "svelte";
	import { resetDrawerBodyLock } from "$lib/browser/document-state";

	let {
		shouldScaleBackground = true,
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		...restProps
	}: DrawerPrimitive.RootProps = $props();

	let cleanupTimer: ReturnType<typeof setTimeout> | undefined;

	// Ensure scroll is always restored when drawer closes (client-side only)
	$effect(() => {
		if (browser && !open) {
			// Small delay to ensure cleanup happens after drawer animation
			cleanupTimer = setTimeout(() => {
				resetDrawerBodyLock();
			}, 100);
		}

		return () => {
			if (cleanupTimer) {
				clearTimeout(cleanupTimer);
				cleanupTimer = undefined;
			}
		};
	});

	// Cleanup on component unmount (client-side only)
	onDestroy(() => {
		if (cleanupTimer) {
			clearTimeout(cleanupTimer);
		}

		if (browser) {
			resetDrawerBodyLock();
		}
	});
</script>

<DrawerPrimitive.Root {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps} />
