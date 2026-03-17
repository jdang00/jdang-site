<script lang="ts">
	import { Code as AnimotionCode } from '@animotion/core';
	import type { BundledLanguage, BundledTheme, SpecialLanguage } from 'shiki';

	type Lang = BundledLanguage | SpecialLanguage;
	type Theme = BundledTheme;

	type CodeProps =
		| {
				code: string;
				codes?: never;
				lang?: Lang;
				theme?: Theme;
				class?: string;
		  }
		| {
				code?: never;
				codes: string[];
				lang?: Lang;
				theme?: Theme;
				class?: string;
		  };

	let {
		code,
		codes,
		lang = 'ts' as Lang,
		theme = 'poimandres' as Theme,
		class: className = ''
	}: CodeProps = $props();
</script>

{#if code !== undefined}
	<AnimotionCode {code} {lang} {theme} class={className} />
{:else if codes !== undefined}
	<AnimotionCode {codes} {lang} {theme} class={className} />
{/if}
