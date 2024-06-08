<script>
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	let className = undefined;
	export let delayMs = undefined;
	export { className as class };
</script>

<AvatarPrimitive.Root
	{delayMs}
	class={cn('relative flex shrink-0 overflow-hidden rounded-full', className)}
	{...$$restProps}
>
	<slot />
</AvatarPrimitive.Root>
