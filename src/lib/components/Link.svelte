<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		external?: boolean;
	};

	let { class: className, href, external, children, ...rest }: Props = $props();

	const isExternal = $derived(external ?? /^(https?:)?\/\//.test(href ?? ''));
</script>

<a
	{href}
	data-slot="link"
	class={cn(
		'text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80',
		className
	)}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
	{...rest}
>
	{@render children?.()}
</a>
